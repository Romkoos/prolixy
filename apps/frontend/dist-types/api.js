const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
if (!apiBaseUrl) {
    throw new Error("VITE_API_BASE_URL is required at build time.");
}
/**
 * Fetches latest articles from the API.
 */
export const fetchArticles = async () => {
    const response = await fetch(`${apiBaseUrl}/articles`);
    if (!response.ok) {
        throw new Error(`Failed to load articles: ${response.status}`);
    }
    const body = (await response.json());
    return body.items;
};
//# sourceMappingURL=api.js.map