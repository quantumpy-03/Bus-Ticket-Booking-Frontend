
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">PickBus</h2>
            <p className="text-gray-400">Your trusted partner for bus booking. Safe, reliable, and affordable travel.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-red-500">Home</Link></li>
              <li><Link to="/booking" className="hover:text-red-500">Booking</Link></li>
              <li><Link to="/destinations" className="hover:text-red-500">Destinations</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="hover:text-red-500">About Us</Link></li>
              <li><Link to="/support" className="hover:text-red-500">Contact Us</Link></li>
              <li><Link to="/faq" className="hover:text-red-500">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex flex-col space-x-4">
              <a href="#" className="hover:text-red-500">Facebook</a>
              <a href="#" className="hover:text-red-500">Twitter</a>
              <a href="#" className="hover:text-red-500">Instagram</a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-4 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} PickBus. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
