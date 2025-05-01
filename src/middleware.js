import { NextResponse } from "next/server";

export function middleware(req) {
    // ✅ عرض كل الكوكيز في اللوج
    const token = req.cookies.get("token")?.value; // استخدم ?.value لاستخراج التوكين

    

    const isAuthPage = ["/login", "/register"].includes(req.nextUrl.pathname);

    if (!token && !isAuthPage) {
        return NextResponse.redirect(new URL("/not-found", req.url)); // 🔒 توجيه المستخدم إلى تسجيل الدخول
    }

    if (token && isAuthPage) {
        return NextResponse.redirect(new URL("/dashboard", req.url)); // 🔐 منع الدخول لصفحة تسجيل الدخول إذا كان التوكين موجود
    }

    return NextResponse.next(); // ✅ السماح بالمتابعة
}

export const config = {
    matcher: ["/clients-management", "/orders-management" , "/dashboard"], // 🔒 تحديد المسارات المحمية
};
