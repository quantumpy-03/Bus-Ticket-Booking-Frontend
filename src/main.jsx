import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from '../Components/Home.jsx';
import Login from '../Components/Login.jsx';
import Booking from '../Components/Booking.jsx';
import Signup from '../Components/Signup.jsx';
import ProtectedRoute from '../Components/ProtectedRoute.jsx';
import MyBooking from '../Components/MyBooking.jsx';
import Profile from '../Components/Profile.jsx';
import Destinations from '../Components/Destinations.jsx';
import AboutUs from '../Components/AboutUs.jsx';
import Support from '../Components/Support.jsx';
import { DataProvider } from '../Context/DataContext.jsx';
import NotFound from '../Components/NotFound.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <DataProvider>
        <App />
      </DataProvider>
    ),
    errorElement: <div>Oops! Page not found.</div>,
    children: [
      { index: true, element: <Home /> },
      { path: '*', element: <NotFound /> },
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <Signup /> },
      { path: 'destinations', element: <Destinations /> },
      { path: 'about', element: <AboutUs /> },
      { path: 'support', element: <Support /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: 'booking', element: <Booking /> },
          { path: 'mybooking', element: <MyBooking /> },
          { path: 'profile', element: <Profile /> },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
