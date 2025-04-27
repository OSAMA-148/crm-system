export default function Unauthorized() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <h1 className="text-3xl font-bold text-red-500">
                You are not authorized to access this page.
            </h1>
        </div>
    );
}
