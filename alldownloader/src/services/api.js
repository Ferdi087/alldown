export const downloadMedia = async (url, format) => {
    try {
        // Use environment variable if provided, otherwise default to relative path
        const API_BASE = import.meta.env?.VITE_API_BASE_URL || '';

        const response = await fetch(`${API_BASE}/api/download`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url, format })
        });

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("text/html")) {
            throw new Error(`API route not found (received HTML instead of JSON). Make sure the backend server and proxy are running.`);
        }

        if (!response.ok) {
            let errorData = {};
            try {
                errorData = await response.json();
            } catch (e) {
                // If parsing fails but it's not HTML, handle gracefully
                errorData = { error: await response.text() };
            }
            throw new Error(errorData.text || errorData.error || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching from local Node API:", error);
        throw error;
    }
};
