import { NextResponse } from "next/server";

export function middleware(request) {
    const token = request.cookies.get("token")?.value;
    const protectedPaths = ["/clients", "/orders"];
    const currentPath = request.nextUrl.pathname;

    if (protectedPaths.includes(currentPath)) {
        if (!token) {
            const loginUrl = new URL("/login", request.url);
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/clients", "/orders"],
};
