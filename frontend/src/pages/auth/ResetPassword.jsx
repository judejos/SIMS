import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function ResetPassword() {
  const { register, handleSubmit } = useForm()
  const navigate = useNavigate()
  const onSubmit = () => { toast.success('Password reset!'); navigate('/login') }

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Reset Password</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          {...register('password', { required: true })}
          type="password"
          placeholder="New password"
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <input
          {...register('confirm', { required: true })}
          type="password"
          placeholder="Confirm password"
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <button className="w-full bg-primary-600 text-white py-2.5 rounded-lg font-semibold hover:bg-primary-700">
          Reset Password
        </button>
      </form>
    </div>
  )
}
