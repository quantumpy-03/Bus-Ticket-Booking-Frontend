import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from '../Components/Home.jsx'
import Login from '../Components/Login.jsx'
import Booking from '../Components/Booking.jsx'
import Signup from '../Components/Signup.jsx'
import ProtectedRoute from '../Components/ProtectedRoute.jsx'
import MyBookings from '../Components/MyBookings.jsx'
import Profile from '../Components/Profile.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <div>Oops! Page not found.</div>,
    children: [
      {index: true , element: <Home />},
      {path: "login", element: <Login />},
      {path: "signup", element: <Signup />},
      {element: <ProtectedRoute /> ,
        children: [
          {path: "booking", element: <Booking />},
          {path: "mybooking", element: <MyBookings />},
          {path: "profile", element: <Profile />},
        ],
      }
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
