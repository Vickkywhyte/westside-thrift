// /lib/get-ip.js
// Helper to get visitor's real IP address

export function getRequestIP(request) {
  const netlifyIp = request.headers.get('x-nf-client-connection-ip');
  if (netlifyIp) return netlifyIp;
  
  const cfIp = request.headers.get('cf-connecting-ip');
  if (cfIp) return cfIp;
  
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp;
  
  return 'unknown';
}

export function getFunctionIP(context) {
  return context?.ip || context?.clientContext?.ip || 'unknown';
}
