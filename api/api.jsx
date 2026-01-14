import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { getAccessToken, getRefreshToken, setTokens, removeTokens } from "../utils/tokenManager";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use(async (config) => {
    // Exclude the token refresh endpoint from the interceptor to prevent recursion
    if (config.url.includes("/auth/token/refresh/")) {
        return config;
    }

    let accessToken = getAccessToken();

    if (accessToken) {
        const decoded = jwtDecode(accessToken);
        const isExpired = decoded.exp * 1000 < Date.now();

        if (isExpired) {
            try {
                const refresh = getRefreshToken();
                if (!refresh) {
                    throw new Error("No refresh token available.");
                }

                const response = await axios.post(
                    `${import.meta.env.VITE_API_BASE_URL}/auth/token/refresh/`,
                    { refresh }
                );

                accessToken = response.data.access;
                setTokens(accessToken, null); // Only access token is refreshed
            } catch (error) {
                removeTokens();
                window.location.href = "/login";
                return Promise.reject(error);
            }
        }

        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
});

export default api;
