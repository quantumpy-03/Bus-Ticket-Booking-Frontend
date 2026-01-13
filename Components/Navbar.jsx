import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import DataContext from '../Context/DataContext'
import { FaBus } from 'react-icons/fa'

const NavItem = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `px-3 py-2 rounded font-medium transition ${isActive ? 'bg-white text-red-600' : 'text-white hover:bg-red-700'}`
    }
  >
    {children}
  </NavLink>
)

const Navbar = () => {
  const { isAuthenticated, logout } = useContext(DataContext)

  return (
    <header className="bg-red-600 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <NavLink to="/" className="text-white text-2xl font-bold hover:text-red-100 transition">
          <FaBus className="inline mr-2" /> PickBus
        </NavLink>

        <nav className="flex items-center gap-1">
          <NavItem to="/">Home</NavItem>

          {!isAuthenticated && (
              <>
                <NavItem to="/login">Login</NavItem>
                <NavItem to="/signup">Sign Up</NavItem>
              </>
          )}

          {isAuthenticated && (
            <>
              <NavItem to="/booking">Book Ticket</NavItem>
              <NavItem to="/mybooking">My Bookings</NavItem>
              <NavItem to="/profile">Profile</NavItem>
              <button onClick={logout} className="ml-2 px-4 py-2 rounded bg-white text-red-600 font-semibold hover:bg-gray-100 transition">
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Navbar
