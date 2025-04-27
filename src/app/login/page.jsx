"use client";

import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { FaUser, FaLock } from "react-icons/fa";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // استيراد أيقونات العين
import Cookies from "js-cookie"; // استيراد مكتبة js-cookie
import { toast } from "react-toastify";

export default function LoginPage() {
    const { login } = useAuth();
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false); // حالة لإظهار/إخفاء كلمة المرور
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, password }),
                }
            );

            if (!res.ok) {
                throw new Error("Login failed");
            }

            const data = await res.json();
            Cookies.set("token", data.token, { expires: 7 }); // تخزين التوكن في الكوكيز لمدة 7 أيام
            localStorage.setItem("role", data.role); // تخزين الدور في localStorage
            toast.success("Login successful!");
            router.push("/dashboard");
        } catch (err) {
            setError("Login error");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-200">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-lg shadow-md w-96 text-black"
            >
                <h2 className="text-2xl font-bold mb-6 text-center text-black">
                    Sign in to your account
                </h2>
                {error && <div className="text-red-500 mb-4">{error}</div>}
                <div className="relative mb-4">
                    <FaUser className="absolute left-2 top-2 text-gray-400 text-2xl" />
                    <input
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded-lg pl-10"
                    />
                </div>
                <div className="relative mb-6">
                    <FaLock className="absolute left-2 top-2 text-gray-400 text-2xl" />
                    <input
                        type={showPassword ? "text" : "password"} // تغيير نوع الإدخال بناءً على حالة العرض
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded-lg pl-10 pr-10"
                    />
                    <span
                        className="absolute right-3 top-2.5 text-gray-400 cursor-pointer text-2xl"
                        onClick={() => setShowPassword(!showPassword)} // تبديل حالة العرض
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                </div>
                <button
                    type="submit"
                    className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
                >
                    SIGN IN
                </button>
                <div className="text-center mt-4">
                    <span className="text-gray-600">No account? </span>
                    <a
                        href="/register"
                        className="text-purple-600 hover:underline"
                    >
                        Sign up
                    </a>
                </div>
            </form>
        </div>
    );
}
