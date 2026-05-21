// /app/api/sell/route.js
import { rateLimiters } from '../../../lib/rate-limit';
import { getRequestIP } from '../../../lib/get-ip';

export async function POST(request) {
  // Get visitor IP address
  const ip = getRequestIP(request);
  
  // Check rate limit (max 5 submissions per hour)
  const rateLimit = rateLimiters.sellForm.check(ip);
  
  // If rate limit exceeded, return error
  if (!rateLimit.success) {
    return Response.json(
      { 
        error: 'Too many submissions. Please try again later.',
        retryAfter: Math.ceil((rateLimit.resetTime.getTime() - Date.now()) / 1000)
      },
      { status: 429 }
    );
  }
  
  try {
    // Parse the form data
    const formData = await request.json();
    
    // TODO: Add your sell form processing logic here
    // For now, just return success
    console.log('Sell request received:', formData);
    
    return Response.json(
      { 
        success: true, 
        message: 'Sell request received successfully',
        rateLimit: {
          remaining: rateLimit.remaining,
          resetTime: rateLimit.resetTime
        }
      },
      {
        headers: {
          'X-RateLimit-Limit': rateLimit.limit.toString(),
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
          'X-RateLimit-Reset': Math.ceil(rateLimit.resetTime.getTime() / 1000).toString()
        }
      }
    );
  } catch (error) {
    console.error('Error processing sell request:', error);
    return Response.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

// Handle GET requests (optional)
export async function GET() {
  return Response.json({ message: 'Sell API is working' });
}
