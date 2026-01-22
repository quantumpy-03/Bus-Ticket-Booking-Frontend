import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { setTokens, getAccessToken, removeTokens } from '../utils/tokenManager';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [bookings, setBookings] = useState([]);
    const [paymentStatus, setPaymentStatus] = useState('idle');

    const [newUser, setNewUser] = useState({
        username: '',
        email: '',
        password: '',
        phone_number: '',
        first_name: '',
        last_name: ''
    });

    const [userLogin, setUserLogin] = useState({
        username: '',
        password: ''
    });

    const [cancellationState, setCancellationState] = useState({
        isCancelling: false,
        selectedBookingId: null,
        cancelError: null,
        cancelSuccess: null,
    });

    const navigate = useNavigate();

    const handleNewUser = (e) => {
        const { name, value } = e.target;
        setNewUser(prev => ({ ...prev, [name]: value }));
    };

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

    const handleUserLogin = (e) => {
        const { name, value } = e.target;
        setUserLogin(prev => ({ ...prev, [name]: value }));
    };

    const logout = useCallback(() => {
        removeTokens();
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
        setIsAuthenticated(false);
        setBookings([]);
        navigate('/login');
        setUserLogin({ username: '', password: '' })
    }, [navigate]);

    const fetchBookings = useCallback(async (orderBy = '-booking_date') => {
        try {
            const response = await api.get(`/book/?ordering=${orderBy}`);
            setBookings(response.data || []);
        } catch (error) {
            console.error(`Failed to fetch bookings ordered by ${orderBy}:`, error);
        }
    }, []);

    useEffect(() => {
        const checkAuth = async () => {
            const accessToken = getAccessToken();
            if (accessToken) {
                try {
                    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                    const response = await api.get('/profile/');
                    setUser(response.data);
                    setIsAuthenticated(true);
                    fetchBookings();
                } catch {
                    logout();
                }
            } else {
                setIsAuthenticated(false);
                setUser(null);
            }
        };
        checkAuth();
    }, [logout, fetchBookings]);

    const login = async (username, password) => {
        try {
            const tokenResponse = await api.post('/auth/token/', { username, password });
            const { access, refresh } = tokenResponse.data;
            if (!access) {
                throw new Error('Token not found in login response');
            }

            setTokens(access, refresh);
            api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
            
            const profileResponse = await api.get('/profile/');
            const user = profileResponse.data;
            setUser(user);
            
            setIsAuthenticated(true);
            await fetchBookings();
            
            navigate('/');

        } catch (error) {
            removeTokens();
            delete api.defaults.headers.common['Authorization'];
            setIsAuthenticated(false);
            setUser(null);
            console.error("Login process failed:", error);
            throw new Error('Invalid credentials. Please try again.');
        }
    };

    const updateUserProfile = async (userData) => {
        try {
            const response = await api.patch('/profile/', userData);
            setUser(response.data);
            alert('Profile updated successfully!');
            return response;
        } catch (error) {
            console.error("Failed to update profile:", error);
            alert('Failed to update profile. Please try again.');
            throw error;
        }
    };

    const startPayment = ({ amount, onSuccess, onError }) => {
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY,
            amount: amount * 100,
            currency: 'INR',
            name: 'FirstClass',
            description: 'Bus Ticket Booking',
            handler: onSuccess,
            prefill: {
                name: user?.username,
                email: user?.email,
            },
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', (response) => {
            setPaymentStatus('failed');
            if (onError) onError(response.error.description);
        });

        rzp.open();
    };

    const startCancellation = (bookingId) => {
        setCancellationState({
            isCancelling: false, 
            selectedBookingId: bookingId, 
            cancelError: null,
            cancelSuccess: null, 
        });
    };

    const resetCancellation = () => {
        setCancellationState({
            isCancelling: false,
            selectedBookingId: null,
            cancelError: null,
            cancelSuccess: null,
        });
    };

    const cancelBooking = async (bookingId) => {
        setCancellationState(prev => ({ ...prev, isCancelling: true, cancelError: null }));

        try {
            const response = await api.post(`/bookings/${bookingId}/cancel/`, {});
            
            setBookings(currentBookings =>
                currentBookings.map(b =>
                    b.id === bookingId ? { ...b, ...response.data.booking } : b
                )
            );
            
            setCancellationState({
                isCancelling: false,
                selectedBookingId: null,
                cancelError: null,
                cancelSuccess: 'Booking successfully cancelled. Refund has been initiated.',
            });
            
        } catch (error) {
            // Log the full error response to the console for debugging
            console.error("Cancellation API Error:", error.response?.data);
            
            const errorMessage = error.response?.data?.error || "Cancellation failed. Please check the console for details.";
            setCancellationState(prev => ({
                ...prev,
                isCancelling: false,
                cancelError: errorMessage,
            }));
        } finally {
            setTimeout(() => {
                resetCancellation();
            }, 5000);
        }
    };

    const createBooking = async (bookingData) => {
        const response = await api.post('/book/', bookingData);
        const newBooking = response.data;
        return newBooking;
    };


    return (
        <DataContext.Provider
            value={{
                user,
                isAuthenticated,
                bookings,
                paymentStatus,
                cancellationState,
                newUser,
                userLogin,
                handleNewUser,
                handleAddNewUser,
                handleUserLogin,
                setBookings,
                login,
                logout,
                startPayment,
                setPaymentStatus,
                startCancellation,
                resetCancellation,
                cancelBooking,
                updateUserProfile,
                createBooking,
                fetchBookings,
            }}
        >
            {children}
        </DataContext.Provider>
    );
};

export default DataContext;
