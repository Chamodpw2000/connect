// import { NextRequest, NextResponse } from 'next/server';
// import { authenticateRequest, AccessTokenPayload } from './cookies';

// /**
//  * Higher-order function to protect API routes
//  * Usage: export const GET = withAuth(async (req, user) => { ... });
//  */
// export function withAuth<T extends any[]>(
//   handler: (req: NextRequest, user: AccessTokenPayload, ...args: T) => Promise<NextResponse>
// ) {
//   return async (req: NextRequest, ...args: T): Promise<NextResponse> => {
//     // Authenticate request
//     const auth = await authenticateRequest(req);
    
//     if (!auth.isAuthenticated) {
//       return NextResponse.json(
//         { error: auth.error || 'Unauthorized' }, 
//         { status: 401 }
//       );
//     }
    
//     // Call original handler with authenticated user
//     return handler(req, auth.user!, ...args);
//   };
// }

// /**
//  * Extract user ID from authenticated request
//  */
// export async function getCurrentUserId(req: NextRequest): Promise<string | null> {
//   const auth = await authenticateRequest(req);
//   return auth.isAuthenticated ? auth.user!.userId : null;
// }

// /**
//  * Check if user has specific role
//  */
// export async function hasRole(req: NextRequest, requiredRole: string): Promise<boolean> {
//   const auth = await authenticateRequest(req);
//   return auth.isAuthenticated && auth.user!.role === requiredRole;
// }

// /**
//  * Check if user owns a resource (by user ID)
//  */
// export async function isResourceOwner(req: NextRequest, resourceUserId: string): Promise<boolean> {
//   const auth = await authenticateRequest(req);
//   return auth.isAuthenticated && auth.user!.userId === resourceUserId;
// }