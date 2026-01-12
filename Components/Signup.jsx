import { useContext, useState } from 'react'
import DataContext from '../Context/DataContext';

const Signup = () => {
  const { handleNewUser, handleAddNewUser, newUser } = useContext(DataContext);
  const [loading, setLoading] = useState(false)

  return (
    <div className="min-h-[72vh] flex items-center justify-center px-4 py-8">
      <form
        onSubmit={async (e) => { setLoading(true); await handleAddNewUser(e); setLoading(false); }}
        className="w-full max-w-lg mx-auto bg-white shadow-xl rounded-xl p-8 space-y-6 border-t-4 border-red-600"
      >
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-1">Create your account</h2>
          <p className="text-sm text-gray-500">Join BusBook — quick, safe booking in seconds.</p>
        </div>

        <div className="flex flex-col space-y-1">
          <label htmlFor="username" className="text-sm font-medium text-gray-700">User name</label>
          <input
            onChange={(e) => handleNewUser(e)}
            value={newUser?.username ?? ''}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-300"
            type="text"
            id="username"
            name="username"
            required
          />
        </div>

        <div className="flex flex-col space-y-1">
          <label htmlFor="phone_number" className="text-sm font-medium text-gray-700">Phone</label>
          <input
            onChange={(e) => handleNewUser(e)}
            value={newUser?.phone_number ?? ''}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-300"
            type="text"
            id="phone_number"
            name="phone_number"
            required
          />
        </div>

        <div className="flex flex-col space-y-1">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
          <input
            onChange={(e) => handleNewUser(e)}
            value={newUser?.email ?? ''}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-300"
            type="email"
            id="email"
            name="email"
            required
          />
        </div>

        <div className="flex flex-col space-y-1">
          <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
          <input
            onChange={(e) => handleNewUser(e)}
            value={newUser?.password ?? ''}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-300"
            type="password"
            id="password"
            name="password"
            minLength={6}
            required
          />
          <small className="text-xs text-gray-500">Use at least 6 characters.</small>
        </div>

        <div className="flex flex-col gap-3">
          <button disabled={loading} type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold shadow">
            {loading ? 'Creating account...' : 'Create account'}
          </button>
          <div className="text-center text-sm text-gray-600">Already have an account? <a href="/login" className="text-red-600 font-medium hover:underline">Login</a></div>
        </div>
      </form>
    </div>
  )
}

export default Signup