"use client"; 
import { useRouter } from "next/navigation";

export default function NotFound() {
    const router = useRouter();

    const handleGoToOrders = () => {
        router.push("/orders-management"); // إعادة التوجيه إلى صفحة Orders Management
    };
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <h1 className="text-3xl font-bold text-red-600 mb-4">
                    Access Denied
                </h1>
                <p className="text-gray-700 mb-6">
                    You do not have permission to access this page.
                </p>
                <button
                    onClick={handleGoToOrders}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                >
                    Go to Orders Management
                </button>
            </div>
        </div>
    );
}
