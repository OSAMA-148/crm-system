"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { v4 as uuidv4 } from "uuid";

function OrdersManagement() {
    const [orders, setOrders] = useState([]);
    const [newOrder, setNewOrder] = useState({
        orderNumber: 0,
        price: 0,
        orderDate: "",
        status: "Pending",
    });
    const [isAdding, setIsAdding] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingOrderId, setEditingOrderId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [authToken, setAuthToken] = useState(""); // حالة لتخزين التوكن

    // Fetch orders from API
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = Cookies.get("token");
                setAuthToken(token); // تخزين التوكن وقت الفتح
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/Orders`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setOrders(res.data);
            } catch (err) {
                console.error(err.message);
            } finally {
                setFetching(false);
            }
        };

        fetchOrders();
    }, []);

    // Add a new order
    const handleAddOrder = async () => {
        setLoading(true);
        try {
            const token = Cookies.get("token");

            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/Orders`,
                { ...newOrder },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // تحديث التوكن لو رجع من الـ POST
            if (res.data.token) {
                setAuthToken(res.data.token);
                Cookies.set("token", res.data.token, { expires: 7 }); // اختياري تحدث الكوكيز برضو
                console.log("Token updated:", res.data.token);
            }

            setOrders([...orders, res.data]);
            resetForm();
            setIsAdding(false);
        } catch (err) {
            console.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Delete an order
    const handleDeleteOrder = async (id) => {
        try {
            await axios.delete(
                `${process.env.NEXT_PUBLIC_API_URL}/api/Orders`,
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                }
            );
            setOrders(orders.filter((order) => order.id !== id));
        } catch (err) {
            console.error(
                "Error deleting order:",
                err.response?.data || err.message
            );
        }
    };

    // Edit an order
    const handleEditOrder = (order) => {
        setIsEditing(true);
        setEditingOrderId(order.id);
        setNewOrder({
            orderNumber: order.orderNumber || "",
            price: order.price || 0,
            product: order.product || 0,
            orderDate: order.orderDate
                ? new Date(order.orderDate).toISOString().slice(0, 16)
                : "",
            status: order.status || "Pending",
            userId: order.userId || 0,
        });
    };

    // Update order
    const handleUpdateOrder = async () => {
        setLoading(true);
        try {
            const res = await axios.put(
                `${process.env.NEXT_PUBLIC_API_URL}/api/Orders`,
                { ...newOrder },
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`, // استخدام التوكن المخزن هنا
                    },
                }
            );

            setOrders(
                orders.map((order) =>
                    order.id === editingOrderId ? res.data : order
                )
            );
            resetForm();
            setIsEditing(false);
        } catch (err) {
            console.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewOrder((prev) => ({
            ...prev,
            [name]:
                name === "price" ||
                name === "product" ||
                name === "userId" ||
                name === "orderNumber"
                    ? Number(value)
                    : name === "orderDate"
                    ? new Date(value).toISOString()
                    : value,
        }));
    };

    const resetForm = () => {
        setNewOrder({
            orderNumber: "",
            price: 0,
            orderDate: "",
            status: "Pending",
        });
    };

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Orders Management</h1>

            {/* Table to display orders */}
            <table className="w-full bg-white rounded-lg shadow-md">
                <thead>
                    <tr className="bg-gray-200 text-left">
                        <th className="p-4">Order Number</th>
                        <th className="p-4">Date</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Price</th>
                        <th className="p-4">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.id || uuidv4()} className="border-b">
                            <td className="p-4">{order.orderNumber ?? "-"}</td>
                            <td className="p-4">
                                {order.orderDate
                                    ? new Date(order.orderDate).toLocaleString()
                                    : "-"}
                            </td>
                            <td className="p-4">{order.status ?? "-"}</td>
                            <td className="p-4">
                                $
                                {order.price !== undefined
                                    ? Number(order.price).toFixed(2)
                                    : "0.00"}
                            </td>
                            <td className="p-4">
                                <button
                                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 mr-2"
                                    onClick={() => handleDeleteOrder(order.id)}
                                >
                                    Delete
                                </button>
                                <button
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                    onClick={() => handleEditOrder(order)}
                                >
                                    Edit
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Button to add a new order */}
            <div className="mt-6">
                <button
                    className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                    onClick={() => setIsAdding(true)}
                >
                    Add New Order
                </button>
            </div>

            {/* Form to add or edit an order */}
            {(isAdding || isEditing) && (
                <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-4">
                        {isEditing ? "Edit Order" : "Add New Order"}
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <label className="mb-1 text-gray-700 font-medium">
                                Order Number{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="orderNumber"
                                placeholder="Enter Order Number"
                                value={newOrder.orderNumber}
                                onChange={handleInputChange}
                                className="p-2 border border-gray-300 rounded"
                                required
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="mb-1 text-gray-700 font-medium">
                                Price <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="price"
                                placeholder="Enter Price"
                                value={newOrder.price}
                                onChange={handleInputChange}
                                className="p-2 border border-gray-300 rounded"
                                required
                            />
                        </div>

                        

                        <div className="flex flex-col">
                            <label className="mb-1 text-gray-700 font-medium">
                                Order Date{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="datetime-local"
                                name="orderDate"
                                value={
                                    newOrder.orderDate
                                        ? new Date(newOrder.orderDate)
                                              .toISOString()
                                              .slice(0, 16)
                                        : ""
                                }
                                onChange={handleInputChange}
                                className="p-2 border border-gray-300 rounded"
                                required
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="mb-1 text-gray-700 font-medium">
                                Status <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="status"
                                value={newOrder.status}
                                onChange={handleInputChange}
                                className="p-2 border border-gray-300 rounded"
                                required
                            >
                                <option value="Pending">Pending</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-6">
                        <button
                            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 mr-4"
                            onClick={
                                isEditing ? handleUpdateOrder : handleAddOrder
                            }
                            disabled={loading}
                        >
                            {loading
                                ? "Saving..."
                                : isEditing
                                ? "Update"
                                : "Save"}
                        </button>
                        <button
                            className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500"
                            onClick={() => {
                                resetForm();
                                setIsAdding(false);
                                setIsEditing(false);
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default OrdersManagement;
