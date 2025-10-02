import { getToken } from 'next-auth/jwt';
import { NextResponse, NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    // now has a function name getToken return token is obj take req : request

    const token = request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value;;

    if (token) {
        return NextResponse.next(); // if has a token next
    } else {
        const loginUrl = new URL('/auth/login', request.url);
        loginUrl.searchParams.set(
            'callbackUrl',
            request.nextUrl.pathname + request.nextUrl.search
        );
        return NextResponse.redirect(loginUrl);
    }
}
export const config = {
    matcher: ['/cart/:path*', '/wishlist/:path*', '/products/:path*', '/brands/:path*', '/categories/:path*'],
};

