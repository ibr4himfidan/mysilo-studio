/** Pin the public origin instead of trusting arbitrary forwarded host headers. */
export function publicRequest(request: Request): Request {
  const origin = process.env.MYSILO_PUBLIC_ORIGIN;
  if (!origin) return request;
  const configured = new URL(origin);
  if (configured.protocol !== 'https:' || configured.pathname !== '/') throw new Error('MYSILO_PUBLIC_ORIGIN must be an HTTPS origin.');
  const source = new URL(request.url);
  return new Request(new URL(source.pathname + source.search, configured.origin), request);
}
