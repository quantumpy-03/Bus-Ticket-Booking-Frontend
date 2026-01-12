import axios from "axios";
import * as jwtDecodeModule from "jwt-decode";

function jwtDecodeSafe(token) {
    const candidate = jwtDecodeModule && (jwtDecodeModule.default ?? jwtDecodeModule);
    if (typeof candidate === "function") return candidate(token);
    if (jwtDecodeModule && typeof jwtDecodeModule.jwtDecode === "function") return jwtDecodeModule.jwtDecode(token);
    throw new TypeError("jwt-decode import is not callable. Use an ESM-compatible import or 'jwt-decode/dist/jwt-decode.esm.js'");
}

const api = axios.create({
    baseURL: "https://bus-ticket-booking-backend-gkz6.onrender.com/api",
});

api.interceptors.request.use(async (config) => {
    let accessToken = localStorage.getItem("access_token");

    if (accessToken) {
        const decoded = jwtDecodeSafe(accessToken);
        const isExpired = decoded.exp * 1000 < Date.now();

        if (isExpired) {
            try {
                const refresh = localStorage.getItem("refresh_token");

                const response = await api.post(
                    "/auth/token/refresh/",
                    { refresh }
                );

                accessToken = response.data.access;
                localStorage.setItem("access_token", accessToken);
            } catch (error) {
                localStorage.clear();
                window.location.href = "/login";
                return Promise.reject(error);
            }
        }

        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
});

export default api;
