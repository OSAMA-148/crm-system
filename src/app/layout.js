import "./globals.css";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "@/components/AuthProvider";

export const metadata = {
    title: "Mini CRM",
    description: "A simple CRM application",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className="bg-[url('/bg-main.svg')] bg-cover">
                <ToastContainer position="top-center" autoClose={1000} />
                <AuthProvider>{children}</AuthProvider>
            </body>
        </html>
    );
}
