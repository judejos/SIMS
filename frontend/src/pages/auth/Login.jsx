import { useForm } from 'react-hook-form'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import useAuth from '../../hooks/useAuth'

const ROLE_REDIRECT = {
  super_admin: '/admin',
  admin:   '/admin',
  manager: '/admin',
  lead:    '/task',
  mentor:  '/task',
  intern:  '/intern-user',
}

export default function Login() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()
  const { login } = useAuth()
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    try {
      const result = await login(data)
      toast.success('Login successful!')
      navigate(ROLE_REDIRECT[result.user?.role] || '/admin')
    } catch (e) {
      const msg = e.response?.data?.non_field_errors?.[0] || 'Invalid username or password'
      toast.error(msg)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary-700">SIMS</h1>
        <p className="text-gray-500 mt-1 text-sm">Student Intern Management System</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <input
            {...register('username', { required: 'Username is required' })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Enter username"
            autoComplete="username"
          />
          {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            {...register('password', { required: 'Password is required' })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Enter password"
            autoComplete="current-password"
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>
        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-sm text-primary-600 hover:underline">
            Forgot password?
          </Link>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-60"
        >
          {isSubmitting ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  )
}
