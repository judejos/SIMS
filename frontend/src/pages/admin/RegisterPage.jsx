import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { register as registerUser } from '../../services/authAPI'
import Button from '../../components/common/Button'
import PageHeader from '../../components/common/PageHeader'

export default function RegisterPage() {
  const { register, handleSubmit, reset, formState: { isSubmitting, errors } } = useForm()

  const onSubmit = async (data) => {
    if (data.password !== data.confirm_password) { toast.error('Passwords do not match'); return }
    try {
      await registerUser({ username: data.username, email: data.email, password: data.password, first_name: data.first_name, last_name: data.last_name })
      toast.success(`Staff member ${data.username} registered!`)
      reset()
    } catch (e) {
      const msg = e.response?.data
      toast.error(msg?.username?.[0] || msg?.email?.[0] || 'Registration failed')
    }
  }

  return (
    <div className="max-w-lg">
      <PageHeader title="Register Staff" subtitle="Create a new staff account" />
      <div className="bg-white rounded-xl shadow-sm p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input {...register('first_name', { required: true })} className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input {...register('last_name', { required: true })} className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input {...register('username', { required: true })} className="w-full border rounded-lg px-3 py-2 text-sm" />
            {errors.username && <p className="text-red-500 text-xs mt-1">Required</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" {...register('email', { required: true })} className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" {...register('password', { required: true, minLength: 8 })} className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input type="password" {...register('confirm_password', { required: true })} className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Registering...' : 'Register Staff Member'}
          </Button>
        </form>
      </div>
    </div>
  )
}
