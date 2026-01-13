import React, { useContext, useState } from 'react'
import DataContext from '../Context/DataContext';

const Login = () => {
  const { handleUserLogin, handleLogin, userLogin } = useContext(DataContext);
  const [loading, setLoading] = useState(false)

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-8">
      <form
        onSubmit={async (e) => { setLoading(true); await handleLogin(e); setLoading(false); }}
        className="w-full max-w-lg mx-auto bg-white shadow-xl rounded-xl p-8 space-y-6 border-t-4 border-red-600"
      >
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-1">Welcome back</h2>
          <p className="text-sm text-gray-500">Sign in to continue to PickBus</p>
        </div>

        <div className="flex flex-col space-y-1">
          <label htmlFor="username" className="text-sm font-medium text-gray-700">User name</label>
          <input
            onChange={(e) => handleUserLogin(e)}
            value={userLogin?.username ?? ''}
            className="border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-200 transition"
            type="text"
            id="username"
            name="username"
            required
          />
        </div>

        <div className="flex flex-col space-y-1">
          <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
          <input
            onChange={(e) => handleUserLogin(e)}
            value={userLogin?.password ?? ''}
            className="border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-200 transition"
            type="password"
            id="password"
            name="password"
            required
          />
        </div>

        <div className="flex flex-col gap-3">
          <button disabled={loading} type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold shadow">
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <div className="text-center text-sm text-gray-600">Don't have an account? <a href="/signup" className="text-red-600 font-medium hover:underline">Sign up</a></div>
        </div>
      </form>
    </div>
  )
}

export default Login