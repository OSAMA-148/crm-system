import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function withRole(Component, allowedRoles) {
    return function ProtectedComponent(props) {
        const router = useRouter();
        const [isAuthorized, setIsAuthorized] = useState(null);

        useEffect(() => {
            const role = localStorage.getItem("role");
            if (!role || !allowedRoles.includes(role)) {
                router.replace("/not-found");
            } else {
                setIsAuthorized(true);
            }
        }, []);

        if (isAuthorized === null) {
            return (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-xl font-semibold animate-pulse">
                        Loading...
                    </div>
                </div>
            );
        }

        return <Component {...props} />;
    };
}
