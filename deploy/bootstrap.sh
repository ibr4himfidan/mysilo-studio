#!/usr/bin/env bash
set -euo pipefail
[[ $(id -u) == 0 ]] || { echo 'Run as root on the new Ubuntu server.'; exit 1; }
PUBLIC_HOST=${1:?Usage: bootstrap.sh PUBLIC_IPV4}
[[ "$PUBLIC_HOST" =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]] || { echo 'An IPv4 address is required.'; exit 1; }
DEPLOY_DIR=$(cd -- "$(dirname -- "$0")" && pwd)
apt-get update -qq
DEBIAN_FRONTEND=noninteractive apt-get install -y -qq nginx python3-venv curl xz-utils ca-certificates ufw
python3 - <<'PY'
import urllib.request,json,hashlib,subprocess,pathlib
releases=json.load(urllib.request.urlopen('https://nodejs.org/dist/index.json'))
version=next(r['version'] for r in releases if r['version'].startswith('v24.') and r['lts'])
name=f'node-{version}-linux-x64.tar.xz'; base=f'https://nodejs.org/dist/{version}/'
archive=pathlib.Path('/tmp')/name
urllib.request.urlretrieve(base+name,archive)
sums=urllib.request.urlopen(base+'SHASUMS256.txt').read().decode()
expected=next(line.split()[0] for line in sums.splitlines() if line.split()[-1]==name)
assert hashlib.sha256(archive.read_bytes()).hexdigest()==expected,'Node checksum mismatch'
destination=pathlib.Path('/opt/mysilo-node');destination.mkdir(exist_ok=True)
subprocess.run(['tar','-xJf',str(archive),'--strip-components=1','-C',str(destination)],check=True)
for command in ['node','npm','npx']:
    path=pathlib.Path('/usr/local/bin')/command
    target=destination/'bin'/command
    if path.is_symlink(): path.unlink()
    if path.exists(): raise RuntimeError(f'Refusing to replace {path}')
    path.symlink_to(target)
print('Installed Node',version)
PY
if ! id mysilo >/dev/null 2>&1; then useradd --system --home /var/lib/mysilo --shell /usr/sbin/nologin mysilo; fi
install -d -m 700 -o mysilo -g mysilo /var/lib/mysilo /var/backups/mysilo
install -d -m 755 /opt/mysilo/releases /etc/mysilo /var/www/certbot
if [[ ! -f /etc/mysilo/app.env ]]; then
    umask 077
    cat > /etc/mysilo/app.env <<EOF
NODE_ENV=production
HOSTNAME=127.0.0.1
PORT=5188
NEXT_TELEMETRY_DISABLED=1
MYSILO_DATABASE_PATH=/var/lib/mysilo/mysilo.sqlite
MYSILO_BACKUP_DIR=/var/backups/mysilo
MYSILO_PUBLIC_ORIGIN=https://$PUBLIC_HOST
MYSILO_TRUST_PROXY=1
NODE_OPTIONS=--max-old-space-size=1024
EOF
fi
if [[ ! -f /swapfile ]] && ! swapon --show --noheadings | read -r _; then
    fallocate -l 2G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    printf '/swapfile none swap sw 0 0\n' >> /etc/fstab
fi
python3 -m venv /opt/certbot
/opt/certbot/bin/pip install --quiet 'certbot>=5.4,<7'
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable
if [[ -L /etc/nginx/sites-enabled/default ]]; then unlink /etc/nginx/sites-enabled/default; fi
cat > /etc/nginx/sites-available/mysilo <<EOF
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name $PUBLIC_HOST;
    location /.well-known/acme-challenge/ { root /var/www/certbot; }
    location / { return 503; }
}
EOF
ln -sfn /etc/nginx/sites-available/mysilo /etc/nginx/sites-enabled/mysilo
nginx -t
systemctl reload nginx
/opt/certbot/bin/certbot certonly --non-interactive --agree-tos --register-unsafely-without-email --preferred-profile shortlived --webroot --webroot-path /var/www/certbot --ip-address "$PUBLIC_HOST" --cert-name mysilo-ip
sed "s/__PUBLIC_HOST__/$PUBLIC_HOST/g" "$DEPLOY_DIR/nginx.conf" > /etc/nginx/sites-available/mysilo
nginx -t
systemctl reload nginx
install -m 644 "$DEPLOY_DIR"/*.service "$DEPLOY_DIR"/*.timer /etc/systemd/system/
systemctl daemon-reload
systemctl enable mysilo mysilo-backup.timer mysilo-certbot.timer
systemctl start mysilo-certbot.timer
echo 'Bootstrap complete. Install the release and database before starting mysilo.'
