"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"; // استيراد أيقونات العين
import { RegisterFormSchema } from "@/lib/rules"; // استيراد المخطط من ملف rules.js
import { toast } from "react-toastify";

export default function RegisterPage() {
    const router = useRouter();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("Sales");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false); // حالة لإظهار/إخفاء كلمة المرور
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // حالة لإظهار/إخفاء تأكيد كلمة المرور
    const [passwordHint, setPasswordHint] = useState(false); // حالة لإظهار/إخفاء الرسالة التوضيحية

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const formData = {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            role,
        };
        const validation = RegisterFormSchema.safeParse(formData);

        if (!validation.success) {
            setError(validation.error.errors[0].message);
            return;
        }

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/account/register-staff`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                }
            );

            if (!res.ok) {
                throw new Error("Registration failed");
            }
            const data = await res.json();
            localStorage.setItem("role", role);
            toast.success("Registration successful! Please log in.");
            router.push("/login");
        } catch (err) {
            setError("Registration failed");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-200">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded shadow-lg w-96 text-black"
            >
                <h2 className="text-3xl font-bold mb-2 text-blue-600 text-center">
                    Register
                </h2>
                <p className="text-gray-600 text-center mb-2">
                    Signup now and get full access to our app.
                </p>

                {error && <div className="text-red-500 mb-4">{error}</div>}

                <div className="flex gap-4 mb-2">
                    <input
                        type="text"
                        placeholder="First-name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-1/2 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
                    />
                    <input
                        type="text"
                        placeholder="Last-name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-1/2 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
                    />
                </div>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full mb-2 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
                />

                <div className="relative mb-2">
                    <input
                        type={showPassword ? "text" : "password"} // تغيير نوع الإدخال بناءً على حالة العرض
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setPasswordHint(true)} // إظهار الرسالة عند التركيز
                        onBlur={() => setPasswordHint(false)} // إخفاء الرسالة عند فقدان التركيز
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500 pr-10"
                    />
                    <span
                        className="absolute right-3 top-2.5 text-gray-400 cursor-pointer text-2xl"
                        onClick={() => setShowPassword(!showPassword)} // تبديل حالة العرض
                    >
                        {showPassword ? (
                            <AiOutlineEyeInvisible />
                        ) : (
                            <AiOutlineEye />
                        )}
                    </span>
                    {passwordHint && (
                        <div className="mt-2 text-sm text-gray-500">
                            <ul className="list-disc pl-5">
                                <li>
                                    Passwords must be at least 8 characters.
                                </li>
                                <li>
                                    Passwords must have at least one
                                    non-alphanumeric character.
                                </li>
                                <li>
                                    Passwords must have at least one digit
                                    ('0'-'9').
                                </li>
                                <li>
                                    Passwords must have at least one uppercase
                                    ('A'-'Z').
                                </li>
                            </ul>
                        </div>
                    )}
                </div>

                <div className="relative mb-2">
                    <input
                        type={showConfirmPassword ? "text" : "password"} // تغيير نوع الإدخال بناءً على حالة العرض
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500 pr-10"
                    />
                    <span
                        className="absolute right-3 top-2.5 text-gray-400 cursor-pointer text-2xl"
                        onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                        } // تبديل حالة العرض
                    >
                        {showConfirmPassword ? (
                            <AiOutlineEyeInvisible />
                        ) : (
                            <AiOutlineEye />
                        )}
                    </span>
                </div>

                <div className="mb-2">
                    <label htmlFor="role" className="block text-gray-700 mb-2">
                        Select Role
                    </label>
                    <select
                        id="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                        <option value="Sales">Sales</option>
                        <option value="Admin">Admin</option>
                    </select>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-300 cursor-pointer"
                >
                    Register
                </button>

                <div className="text-center mt-4">
                    <span className="text-gray-600">
                        Already have an account?{" "}
                    </span>
                    <a href="/login" className="text-blue-600 hover:underline">
                        Sign in
                    </a>
                </div>
            </form>
        </div>
    );
}
