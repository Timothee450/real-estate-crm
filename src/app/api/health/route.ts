// Simple health check endpoint to verify API functionality
export const runtime = 'nodejs';

export async function GET() {
  return Response.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'unknown',
    vercel: process.env.VERCEL === '1' ? true : false,
    node_version: process.version,
    env_vars_check: {
      has_database_url: !!process.env.DATABASE_URL,
      has_jwt_secret: !!process.env.JWT_SECRET
    }
  });
} 