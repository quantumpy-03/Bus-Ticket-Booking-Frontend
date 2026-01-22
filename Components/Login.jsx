import React, { useContext, useState, useEffect } from 'react'
import DataContext from '../Context/DataContext';
import { Link, useNavigate } from 'react-router-dom';
import Button from './Button';

const Login = () => {
  const { handleUserLogin, login, userLogin, isAuthenticated } = useContext(DataContext);
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(userLogin.username, userLogin.password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-8">
     <form
       onSubmit={handleLoginSubmit}
       className="w-full max-w-lg mx-auto bg-white shadow-xl rounded-xl p-8 space-y-6 border-t-4 border-blue-600"
     >
       <div className="text-center">
         <h2 className="text-3xl font-extrabold text-gray-800 mb-1">Welcome back</h2>
         <p className="text-sm text-gray-500">Sign in to continue to PickBus</p>
       </div>

       {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center" role="alert">{error}</div>}

       <div className="flex flex-col space-y-1">
         <label htmlFor="username" className="text-sm font-medium text-gray-700">User name</label>
         <input
           onChange={(e) => handleUserLogin(e)}
           value={userLogin?.username ?? ''}
           className="border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition"
           type="text"
           id="username"
           name="username"
           autoComplete="username"
           required
         />
       </div>

       <div className="flex flex-col space-y-1">
         <label htmlFor="password-input" className="text-sm font-medium text-gray-700">Password</label>
         <input
           onChange={(e) => handleUserLogin(e)}
           value={userLogin?.password ?? ''}
           className="border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition"
           type="password"
           id="password-input"
           name="password"
           autoComplete="current-password"
           required
         />
       </div>
       
       <div className="flex flex-col gap-3">
        <Button
          type="submit"
          disabled={loading}
          variant="primary"
          className="w-full py-3"
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </Button>
        
        <div className="text-center text-sm text-gray-600">Already have an account? <Link to="/signup" className="text-blue-600 font-medium hover:underline">Signup</Link></div>
      </div>
     </form>
    </div>
  )
}

export default Login
