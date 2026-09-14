#!/usr/bin/env bash
set -euo pipefail
[[ $(id -u) == 0 ]] || exit 1
ARCHIVE=${1:?Usage: activate.sh RELEASE_ARCHIVE RELEASE_ID}
RELEASE_ID=${2:?Release ID required}
[[ "$RELEASE_ID" =~ ^[a-zA-Z0-9._-]+$ ]] || exit 1
TARGET=/opt/mysilo/releases/$RELEASE_ID
[[ ! -e "$TARGET" ]] || { echo 'Release already exists.'; exit 1; }
install -d -m 755 "$TARGET"
tar -xzf "$ARCHIVE" -C "$TARGET"
install -d -o mysilo -g mysilo "$TARGET/.next/cache"
set -a
source /etc/mysilo/app.env
set +a
cd "$TARGET"
runuser -u mysilo -- /usr/local/bin/node scripts/database.mjs init
PREVIOUS=''
if [[ -L /opt/mysilo/current && -d /opt/mysilo/current ]]; then
    PREVIOUS=$(readlink -f /opt/mysilo/current)
fi
ln -sfn "$TARGET" /opt/mysilo/current
systemctl restart mysilo
for attempt in {1..20}; do
    if curl --fail --silent http://127.0.0.1:5188/api/health >/dev/null; then
        systemctl start mysilo-backup.timer
        echo "Release active: $RELEASE_ID"
        exit 0
    fi
    sleep 1
done
if [[ -n "$PREVIOUS" && "$PREVIOUS" != "$TARGET" && -f "$PREVIOUS/server.js" ]]; then
    ln -sfn "$PREVIOUS" /opt/mysilo/current
    systemctl restart mysilo
else
    systemctl stop mysilo
    unlink /opt/mysilo/current
fi
echo 'Health check failed. Previous release restored when available.' >&2
exit 1
