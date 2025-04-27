import Link from "next/link";

export default function Dashboard() {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <ul className="mt-4">
                <li>
                    <Link
                        href="/orders-management"
                        className="text-blue-600 hover:underline"
                    >
                        Orders Management
                    </Link>
                </li>
                <li>
                    <Link
                        href="/clients-management"
                        className="text-blue-600 hover:underline"
                    >
                        Clients Management
                    </Link>
                </li>
            </ul>
        </div>
    );
}
