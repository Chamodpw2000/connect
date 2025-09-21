// import { logOut } from '@/actions/auth.actions';

// export const clientLogout = async () => {
//     try {
//         // Call the server action to clear cookies
//         const result = await logOut();
        
//         if (result.success) {
//             // Client-side redirect after successful logout
//             window.location.href = '/auth/login';
//         } else {
//             console.error('Server logout failed:', result.error);
//             // Still redirect even if server logout failed
//             window.location.href = '/auth/login';
//         }
//     } catch (error) {
//         console.error('Client logout error:', error);
//         // Fallback: redirect anyway
//         window.location.href = '/auth/login';
//     }
// };

// export const apiLogout = async () => {
//     try {
//         const response = await fetch('/api/auth/logout', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//         });
        
//         if (response.ok) {
//             return { success: true };
//         } else {
//             return { success: false, error: 'Logout API failed' };
//         }
//     } catch (error) {
//         console.error('API logout error:', error);
//         return { success: false, error: 'Network error' };
//     }
// };