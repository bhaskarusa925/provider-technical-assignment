const BASE_URL = "/api/providers";

async function handleResponse(response) {
    if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Request failed");
    }

    if (response.status === 204) {
        return null;
    }

    return response.json();
}

export async function getProviders(search = "") {
    const params = new URLSearchParams();

    if (search.trim()) {
        params.set("search", search.trim());
    }

    const url = params.toString()
        ? `${BASE_URL}?${params}`
        : BASE_URL;

    const response = await fetch(url);

    return handleResponse(response);
}

export async function createProvider(data) {
    const response = await fetch(BASE_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    return handleResponse(response);
}

export async function updateProvider(id, data) {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    return handleResponse(response);
}

export async function deleteProvider(id) {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE"
    });

    return handleResponse(response);
}