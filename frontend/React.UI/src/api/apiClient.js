export async function apiRequest(path, options = {}) {
    const response = await fetch(`/api${path}`, {
        ...options,
        headers: {
            Accept: "application/json",
            ...(options.body
                ? { "Content-Type": "application/json" }
                : {}),
            ...options.headers
        }
    });

    if (!response.ok) {
        let message = `Request failed (${response.status})`;

        try {
            const error = await response.json();

            message =
                error.detail ||
                error.title ||
                error.message ||
                message;

            if (error.errors) {
                const validationMessages = Object.values(
                    error.errors
                ).flat();

                message = validationMessages.join(" ");
            }
        } catch {
        }

        throw new Error(message);
    }

    if (response.status === 204) {
        return null;
    }

    return response.json();
}