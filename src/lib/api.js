export async function loginApi(email, password) {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/account/login`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        }
    );

    if (!res.ok) {
        throw new Error("Login failed");
    }

    const data = await res.json();
    return data.token; // تأكد إن الـ API بيرجع التوكن كده
}
