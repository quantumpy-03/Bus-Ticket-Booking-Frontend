import React, { useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';
import DataContext from '../Context/DataContext';
import { FaBus, FaBars, FaTimes } from 'react-icons/fa';

const NavItem = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `px-3 py-2 rounded-md font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-600 ${
        isActive ? 'text-blue-700' : 'text-gray-600 hover:text-blue-700'
      }`
    }
  >
    {children}
  </NavLink>
);

const AuthLink = ({ to, children }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `px-4 py-2 rounded-md font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-600 ${
          isActive
            ? 'bg-blue-600 text-white font-bold hover:bg-blue-700'
            : 'text-gray-600 hover:text-blue-700'
        }`
      }
    >
      {children}
    </NavLink>
  );
  

const Navbar = () => {
  const { isAuthenticated, logout } = useContext(DataContext);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <NavLink
          to="/"
          className="px-2 py-1 rounded-md text-blue-600 text-3xl font-bold transition focus:outline-none focus:ring-2 focus:ring-blue-600"
          onClick={closeMobileMenu}
        >
          <FaBus className="inline mr-2" /> PickBus
        </NavLink>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4">
          <NavItem to="/">Home</NavItem>
          <NavItem to="/destinations">Destinations</NavItem>
          <NavItem to="/about">About Us</NavItem>
          <NavItem to="/support">Support</NavItem>
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <NavLink
                to="/profile"
                className="bg-blue-600 text-white px-4 py-2 rounded-md font-bold hover:bg-blue-700 transition"
              >
                Profile
              </NavLink>
              <button
                onClick={logout}
                className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <AuthLink to="/login">Login</AuthLink>
              <AuthLink to="/signup">Sign Up</AuthLink>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-600 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            {isMobileMenuOpen ? (
              <FaTimes className="h-6 w-6" />
            ) : (
              <FaBars className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <nav className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-700" onClick={closeMobileMenu}>Home</NavLink>
            <NavLink to="/destinations" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-700" onClick={closeMobileMenu}>Destinations</NavLink>
            <NavLink to="/about" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-700" onClick={closeMobileMenu}>About Us</NavLink>
            <NavLink to="/support" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-700" onClick={closeMobileMenu}>Support</NavLink>
          </nav>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="px-2 space-y-2">
              {isAuthenticated ? (
                <>
                  <NavLink to="/profile" className="block w-full text-left bg-blue-600 text-white px-4 py-2 rounded-md font-bold hover:bg-blue-700 transition" onClick={closeMobileMenu}>
                    Profile
                  </NavLink>
                  <button
                    onClick={() => {
                      logout();
                      closeMobileMenu();
                    }}
                    className="block w-full text-left px-4 py-2 rounded-md bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink to="/login" className="block w-full text-left px-4 py-2 rounded-md font-medium text-gray-600 hover:text-blue-700 transition" onClick={closeMobileMenu}>
                    Login
                  </NavLink>
                  <NavLink to="/signup" className="block w-full text-left bg-blue-600 text-white px-4 py-2 rounded-md font-bold hover:bg-blue-700 transition" onClick={closeMobileMenu}>
                    Sign Up
                  </NavLink>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
