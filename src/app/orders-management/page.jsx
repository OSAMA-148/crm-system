import withRole from "@/components/withRole";

function OrdersManagement() {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold">Orders Management</h1>
            <p>
                Welcome to the Orders Management page. This page is accessible
                to Sales and Admin roles.
            </p>
        </div>
    );
}

export default withRole(OrdersManagement, ["Sales", "Admin"]); // السماح لـ Sales و Admin فقط
