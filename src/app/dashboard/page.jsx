"use client";
import Link from "next/link";
import Cookies from "js-cookie"; // استيراد مكتبة js-cookie
import { useRouter } from "next/navigation";

export default function Dashboard() {
    const router = useRouter();

    const handleLogout = () => {
        Cookies.remove("token"); // إزالة التوكن من الكوكيز
        router.push("/login"); // إعادة التوجيه إلى صفحة تسجيل الدخول
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-300 w-full">
            <div className="flex flex-col gap-4 items-center">
                <h1 className="text-3xl font-bold text-center mb-6 text-black">
                    Dashboard
                </h1>
                <div className="flex flex-col gap-4">
                    <Link href="/orders-management">
                        <button className="w-64 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300">
                            Orders Management
                        </button>
                    </Link>
                    <Link href="/clients-management">
                        <button className="w-64 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300">
                            Clients Management
                        </button>
                    </Link>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-64 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition duration-300 mt-6"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}
