"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function withRole(Component, allowedRoles) {
    return function ProtectedComponent(props) {
        const router = useRouter();

        useEffect(() => {
            const role = localStorage.getItem("role"); // قراءة الدور من localStorage
            if (!role || !allowedRoles.includes(role)) {
                router.push("/unauthorized"); // إعادة التوجيه إذا لم يكن لديه الصلاحية
            }
        }, []);

        return <Component {...props} />;
    };
}
