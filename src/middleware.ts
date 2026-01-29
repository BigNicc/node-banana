import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// BasicAuth credentials from environment variables
const VALID_USERNAME = process.env.AUTH_USERNAME || '';
const VALID_PASSWORD = process.env.AUTH_PASSWORD || '';

export function middleware(request: NextRequest) {
    // Check for authorization header
    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
        return new NextResponse('Authentication required', {
            status: 401,
            headers: {
                'WWW-Authenticate': 'Basic realm="Node Banana - Protected Area"',
            },
        });
    }

    // Decode and verify credentials
    try {
        const base64Credentials = authHeader.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
        const [username, password] = credentials.split(':');

        if (username === VALID_USERNAME && password === VALID_PASSWORD) {
            return NextResponse.next();
        }
    } catch (error) {
        // Invalid auth header format
    }

    // Invalid credentials
    return new NextResponse('Invalid credentials', {
        status: 401,
        headers: {
            'WWW-Authenticate': 'Basic realm="Node Banana - Protected Area"',
        },
    });
}

// Apply middleware to all routes
export const config = {
    matcher: '/:path*',
};
