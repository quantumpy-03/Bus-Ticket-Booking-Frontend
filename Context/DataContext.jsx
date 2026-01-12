import { createContext, useState, useEffect } from 'react'
import api from '../api/api'
import { useNavigate } from 'react-router-dom'

export const DataContext = createContext()

export const DataProvider = ({ children }) => {
    const navigate = useNavigate() 
    const [newUser, setNewUser] = useState({
            username:'',
            email:'',
            phone_number:'',
            password:'',
        })

        const handleNewUser = (e) => {
            setNewUser((prev)=>({
                ...prev,
                [e.target.name]: e.target.value,
            }))
        }

        const handleAddNewUser = async (e) => {
            e.preventDefault();

            try {
                const response = await api.post('/users/', {
                    username: newUser.username,
                    phone_number: newUser.phone_number,
                    email: newUser.email,
                    password: newUser.password,
                });

                if (response.status === 201) {
                    alert("Account created successfully");
                    navigate('/login');
                    setNewUser({ username: '', email: '',phone_number: '', password: '' });
                }
            } catch (error) {
                console.error("Registration error:", error.response?.data || error);
                alert("Registration failed");
            }
        };


        const [userLogin, setUserLogin] = useState({
            username: '',
            password: '',
        })

        const [isAuthenticated, setIsAuthenticated] = useState(false)

        useEffect(() => {
            const access = localStorage.getItem('access_token')
            setIsAuthenticated(!!access)
        }, [])

        const handleUserLogin = (e) => {
            setUserLogin((prev)=>({
                ...prev,
                [e.target.name]: e.target.value,
            }))
        }

        const handleLogin = async (e) => {
            e.preventDefault();

            
            try {
                const response = await api.post('/auth/token/', {
                    username: userLogin.username,
                    password: userLogin.password,
                });
                
                localStorage.setItem('access_token', response.data.access);
                localStorage.setItem('refresh_token', response.data.refresh);

                setIsAuthenticated(true)
                navigate('/');
            } catch (error) {
                console.error("Login failed:", error.response?.data || error);
                alert("Invalid username or password");
            }
        };

        const logout = () => {
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
            setIsAuthenticated(false)
            setUserLogin({
                username: '',
                password: '',
            })
            navigate('/login')
        }

        // Cancellation state management
        const [cancellationState, setCancellationState] = useState({
            isCancelling: false,
            selectedBookingId: null,
            cancelError: null,
            cancelSuccess: null,
        })

        const startCancellation = (bookingId) => {
            setCancellationState({
                isCancelling: true,
                selectedBookingId: bookingId,
                cancelError: null,
                cancelSuccess: null,
            })
        }

        const setCancelSuccess = (message) => {
            setCancellationState(prev => ({
                ...prev,
                cancelSuccess: message
            }))
        }

        const setCancelError = (error) => {
            setCancellationState(prev => ({
                ...prev,
                cancelError: error
            }))
        }

        const resetCancellation = () => {
            setCancellationState({
                isCancelling: false,
                selectedBookingId: null,
                cancelError: null,
                cancelSuccess: null,
            })
        }

        const cancelBooking = async (bookingId) => {
            try {
                const response = await api.post(`/bookings/${bookingId}/cancel/`)
                setCancelSuccess(`Booking cancelled successfully! Refund of ₹${response.data.refund_amount} initiated.`)
                return response.data
            } catch (error) {
                const errorMsg = error.response?.data?.error || 'Failed to cancel booking'
                setCancelError(errorMsg)
                throw error
            } finally {
                setCancellationState(prev => ({
                    ...prev,
                    isCancelling: false
                }))
            }
        }

  
    return (
     <DataContext.Provider value={{ 
         handleNewUser, handleAddNewUser, newUser,
         handleUserLogin, handleLogin, userLogin,
         isAuthenticated, logout,
         cancellationState, startCancellation, setCancelSuccess, setCancelError, resetCancellation, cancelBooking
     }}>
      {children}
    </DataContext.Provider>
  )
}


export default DataContext
