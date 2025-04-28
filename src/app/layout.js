import "./globals.css";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "@/components/AuthProvider";

export const metadata = {
    title: "Mini CRM",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <ToastContainer position="top-center" autoClose={2000} />
                <AuthProvider>{children}</AuthProvider>
            </body>
        </html>
    );
}
