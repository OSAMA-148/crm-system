"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import withRole from "@/components/withRole";
import { v4 as uuidv4 } from "uuid";

function ClientsManagement() {
    const [clients, setClients] = useState([]);
    const [newClient, setNewClient] = useState({
        name: "",
        phone: "",
        email: "",
        address: "",
        lastInteraction: "",
    });
    const [isAdding, setIsAdding] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingClientId, setEditingClientId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [authToken, setAuthToken] = useState(""); // حالة لتخزين التوكن

    // Fetch clients from API
    useEffect(() => {
        const fetchClients = async () => {
            try {
                const token = Cookies.get("token");
                setAuthToken(token); // تخزين التوكن في الحالة
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/Client`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setClients(res.data);
            } catch (err) {
                console.error(err.message);
            } finally {
                setFetching(false);
            }
        };

        fetchClients();
    }, []);

    // Add a new client
    const handleAddClient = async () => {
        setLoading(true);
        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/Client`,
                newClient,
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                }
            );

            // تحديث التوكن إذا تم إرجاعه
            if (res.data.token) {
                setAuthToken(res.data.token);
                Cookies.set("token", res.data.token, { expires: 7 });
            }

            // إعادة تحميل الصفحة بعد الإضافة
            window.location.reload();
        } catch (err) {
            console.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Edit a client
    const handleEditClient = (client) => {
        setIsEditing(true);
        setEditingClientId(client.id);
        setNewClient({
            name: client.name,
            phone: client.phone,
            email: client.email,
            address: client.address,
            lastInteraction: client.lastInteraction,
        });
    };

    // Update a client
    const handleUpdateClient = async () => {
        setLoading(true);
        try {
            const res = await axios.put(
                `${process.env.NEXT_PUBLIC_API_URL}/api/Client`,
                newClient,
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                }
            );

            // تحديث التوكن إذا تم إرجاعه
            if (res.data.token) {
                setAuthToken(res.data.token);
                Cookies.set("token", res.data.token, { expires: 7 });
            }

            // إعادة تحميل الصفحة بعد التحديث
            window.location.reload();
        } catch (err) {
            console.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Delete a client
    const handleDeleteClient = async (id) => {
        try {
            await axios.delete(
                `${process.env.NEXT_PUBLIC_API_URL}/api/Client`,
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                }
            );
            setClients(clients.filter((client) => client.id !== id));
        } catch (err) {
            console.error(
                "Error deleting client:",
                err.response?.data || err.message
            );
        }
    };

    // Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewClient((prev) => ({
            ...prev,
            [name]:
                name === "lastInteraction"
                    ? new Date(value).toISOString()
                    : value,
        }));
    };

    // Reset form
    const resetForm = () => {
        setNewClient({
            name: "",
            phone: "",
            email: "",
            address: "",
            lastInteraction: "",
        });
    };

    if (fetching) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-xl font-semibold">Loading clients...</p>
            </div>
        );
    }

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Clients Management</h1>

            {/* Table to display clients */}
            <table className="w-full bg-white rounded-lg shadow-md">
                <thead>
                    <tr className="bg-gray-200 text-left">
                        <th className="p-4">Name</th>
                        <th className="p-4">Phone</th>
                        <th className="p-4">Email</th>
                        <th className="p-4">Address</th>
                        <th className="p-4">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {clients.map((client) => (
                        <tr key={client.id || uuidv4()} className="border-b">
                            <td className="p-4">{client.name}</td>
                            <td className="p-4">{client.phone}</td>
                            <td className="p-4">{client.email}</td>
                            <td className="p-4">{client.address}</td>

                            <td className="p-4">
                                <button
                                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 mr-2"
                                    onClick={() =>
                                        handleDeleteClient(client.id)
                                    }
                                >
                                    Delete
                                </button>
                                <button
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                    onClick={() => handleEditClient(client)}
                                >
                                    Edit
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Button to add a new client */}
            <div className="mt-6">
                <button
                    className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                    onClick={() => setIsAdding(true)}
                >
                    Add New Client
                </button>
            </div>

            {/* Form to add or edit a client */}
            {(isAdding || isEditing) && (
                <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-4">
                        {isEditing ? "Edit Client" : "Add New Client"}
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={newClient.name}
                            onChange={handleInputChange}
                            className="p-2 border border-gray-300 rounded"
                        />
                        <input
                            type="text"
                            name="phone"
                            placeholder="Phone"
                            value={newClient.phone}
                            onChange={handleInputChange}
                            className="p-2 border border-gray-300 rounded"
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={newClient.email}
                            onChange={handleInputChange}
                            className="p-2 border border-gray-300 rounded"
                        />
                        <input
                            type="text"
                            name="address"
                            placeholder="Address"
                            value={newClient.address}
                            onChange={handleInputChange}
                            className="p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="mt-4">
                        <button
                            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 mr-4"
                            onClick={
                                isEditing ? handleUpdateClient : handleAddClient
                            }
                            disabled={loading}
                        >
                            {loading
                                ? "Saving..."
                                : isEditing
                                ? "Update Client"
                                : "Add Client"}
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

export default withRole(ClientsManagement, ["Admin"]);
