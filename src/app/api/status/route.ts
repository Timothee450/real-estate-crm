export async function GET() {
  return new Response(
    JSON.stringify({
      status: 'ok',
      message: 'API is working',
      timestamp: new Date().toISOString(),
      env: process.env.NODE_ENV || 'unknown'
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
} 