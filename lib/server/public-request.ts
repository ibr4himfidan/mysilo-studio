/** Pin the public origin instead of trusting arbitrary forwarded host headers. */
export function publicRequest(request: Request): Request {
  const origin = process.env.MYSILO_PUBLIC_ORIGIN;
  if (!origin) {
    // Next may construct a localhost URL even when the browser used 127.0.0.1.
    // Local development accepts only loopback hosts, never forwarded hosts.
    const host = request.headers.get('host');
    if (!host) return request;
    const local = new URL('http://' + host);
    if (!['127.0.0.1', 'localhost', '[::1]'].includes(local.hostname)) throw new Error('Configure MYSILO_PUBLIC_ORIGIN for public hosting.');
    const source = new URL(request.url);
    return new Request(new URL(source.pathname + source.search, local.origin), request);
  }
  const configured = new URL(origin);
  if (configured.protocol !== 'https:' || configured.pathname !== '/') throw new Error('MYSILO_PUBLIC_ORIGIN must be an HTTPS origin.');
  const source = new URL(request.url);
  return new Request(new URL(source.pathname + source.search, configured.origin), request);
}
