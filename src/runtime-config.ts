// This file contains runtime configurations that can be imported by various routes

// Specify Node.js runtime for auth-related functionality
export const AUTH_RUNTIME = 'nodejs' as const;

// Specify Edge runtime for other functionality if needed
export const EDGE_RUNTIME = 'edge' as const; 