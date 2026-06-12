import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function ForgotPassword() {
  const { register, handleSubmit } = useForm()
  const onSubmit = () => toast.success('Reset link sent to your email!')

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Forgot Password</h2>
      <p className="text-gray-500 text-sm mb-6">Enter your email to receive a reset link.</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          {...register('email', { required: true })}
          type="email"
          placeholder="Email address"
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <button className="w-full bg-primary-600 text-white py-2.5 rounded-lg font-semibold hover:bg-primary-700">
          Send Reset Link
        </button>
      </form>
      <Link to="/login" className="block text-center text-sm text-primary-600 mt-4 hover:underline">
        Back to Login
      </Link>
    </div>
  )
}
