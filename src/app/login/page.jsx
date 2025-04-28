"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

// دالة مستقلة لجلب الـ Role من API
const fetchUserRole = async (token) => {
    try {
        const profileRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/account/Profile`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "*/*",
                },
            }
        );

        if (!profileRes.ok) {
            throw new Error("Failed to fetch profile");
        }

        const profileData = await profileRes.json();
        console.log(profileData); // تأكد من شكل الداتا لو حابب

        return profileData.role; // تأكد إن المسار دا صح حسب اللى راجع من الـ API
    } catch (error) {
        console.error("Error fetching user role:", error);
        throw error;
    }
};

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/account/login`,
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
            const { token } = data;

            // حفظ التوكن في الكوكيز
            Cookies.set("token", token, { expires: 7 });

            // جلب الرول من خلال الدالة المستقلة
            const role = await fetchUserRole(token);

            // حفظ الرول في localStorage
            localStorage.setItem("role", role);

            toast.success("Login successful!");
            router.push("/dashboard");
        } catch (err) {
            console.error(err);
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
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded-lg pl-10 pr-10"
                    />
                    <span
                        className="absolute right-3 top-2.5 text-gray-400 cursor-pointer text-2xl"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                </div>

                <button
                    type="submit"
                    className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 cursor-pointer transition duration-200 ease-in-out"
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
