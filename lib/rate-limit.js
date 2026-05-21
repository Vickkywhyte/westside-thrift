// /lib/rate-limit.js
// Rate limiting helper to prevent abuse of forms and APIs

const rateLimitStore = new Map();

setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 60 * 60 * 1000);

export function createRateLimiter(options = {}) {
  const {
    windowMs = 60 * 1000,
    maxRequests = 10,
    identifier = 'default'
  } = options;

  return {
    check: (ip) => {
      const key = `${identifier}:${ip}`;
      const now = Date.now();
      
      let record = rateLimitStore.get(key);
      
      if (!record || now > record.resetTime) {
        record = {
          count: 0,
          resetTime: now + windowMs
        };
      }
      
      record.count++;
      rateLimitStore.set(key, record);
      
      const success = record.count <= maxRequests;
      const remaining = Math.max(0, maxRequests - record.count);
      
      return {
        success,
        remaining,
        resetTime: new Date(record.resetTime),
        limit: maxRequests
      };
    },
    
    getStatus: (ip) => {
      const key = `${identifier}:${ip}`;
      const record = rateLimitStore.get(key);
      const now = Date.now();
      
      if (!record || now > record.resetTime) {
        return {
          remaining: maxRequests,
          resetTime: new Date(now + windowMs),
          limit: maxRequests
        };
      }
      
      return {
        remaining: Math.max(0, maxRequests - record.count),
        resetTime: new Date(record.resetTime),
        limit: maxRequests
      };
    },
    
    reset: (ip) => {
      const key = `${identifier}:${ip}`;
      rateLimitStore.delete(key);
    }
  };
}

export const rateLimiters = {
  sellForm: createRateLimiter({
    windowMs: 60 * 60 * 1000,
    maxRequests: 5,
    identifier: 'sell-form'
  }),
  
  checkout: createRateLimiter({
    windowMs: 60 * 60 * 1000,
    maxRequests: 10,
    identifier: 'checkout'
  }),
  
  login: createRateLimiter({
    windowMs: 15 * 60 * 1000,
    maxRequests: 5,
    identifier: 'login'
  }),
  
  api: createRateLimiter({
    windowMs: 60 * 1000,
    maxRequests: 100,
    identifier: 'api'
  }),
  
  search: createRateLimiter({
    windowMs: 60 * 1000,
    maxRequests: 30,
    identifier: 'search'
  })
};
