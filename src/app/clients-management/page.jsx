import withRole from "@/components/withRole";

function ClientsManagement() {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold">Clients Management</h1>
            <p>
                Welcome to the Clients Management page. This page is accessible
                to Admin only.
            </p>
        </div>
    );
}

export default withRole(ClientsManagement, ["Admin"]); // السماح لـ Admin فقط
