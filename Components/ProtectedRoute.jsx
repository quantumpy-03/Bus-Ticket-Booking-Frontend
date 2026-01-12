import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react'
import axios from 'axios'
import * as jwtDecodeModule from "jwt-decode";

function jwtDecodeSafe(token) {
    const candidate = jwtDecodeModule && (jwtDecodeModule.default ?? jwtDecodeModule);
    if (typeof candidate === "function") return candidate(token);
    if (jwtDecodeModule && typeof jwtDecodeModule.jwtDecode === "function") return jwtDecodeModule.jwtDecode(token);
    throw new TypeError("jwt-decode import is not callable. Use an ESM-compatible import or 'jwt-decode/dist/jwt-decode.esm.js'");
}

const ProtectedRoute = () => {
    const navigate = useNavigate()
    const [ready, setReady] = useState(false)

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("access_token");
            if (!token) {
                navigate('/login', { replace: true })
                return
            }

            try {
                const decoded = jwtDecodeSafe(token);
                const isExpired = decoded.exp * 1000 < Date.now();

                if (!isExpired) {
                    setReady(true)
                    return
                }

                // token expired -> try refresh
                const refresh = localStorage.getItem('refresh_token')
                if (!refresh) {
                    localStorage.removeItem('access_token')
                    navigate('/login', { replace: true })
                    return
                }

                try {
                    const res = await axios.post('http://127.0.0.1:8000/api/auth/token/refresh/', { refresh })
                    const newAccess = res.data.access
                    localStorage.setItem('access_token', newAccess)
                    setReady(true)
                    return
                } catch (err) {
                    localStorage.removeItem('access_token')
                    localStorage.removeItem('refresh_token')
                    navigate('/login', { replace: true })
                    return
                }
            } catch (err) {
                localStorage.removeItem('access_token')
                localStorage.removeItem('refresh_token')
                navigate('/login', { replace: true })
                return
            }
        }

        checkAuth()
    }, [navigate])

    if (!ready) return null
    return <Outlet />
}

export default ProtectedRoute;
