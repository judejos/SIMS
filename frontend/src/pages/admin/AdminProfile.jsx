import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import useAuth from '../../hooks/useAuth'
import { getUsers, updateUser } from '../../services/usersAPI'
import Button from '../../components/common/Button'
import PageHeader from '../../components/common/PageHeader'

export default function AdminProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const { register, handleSubmit, setValue, formState: { isSubmitting } } = useForm()

  useEffect(() => {
    getUsers().then(r => {
      const me = r.data.find(u => u.username === user?.username)
      if (me) {
        setProfile(me)
        setValue('first_name', me.first_name)
        setValue('last_name', me.last_name)
        setValue('email', me.email)
      }
    })
  }, [user])

  const onSubmit = async (data) => {
    try {
      await updateUser(profile.id, data)
      toast.success('Profile updated!')
    } catch { toast.error('Failed to update') }
  }

  return (
    <div className="max-w-lg">
      <PageHeader title="My Profile" subtitle="Manage your account details" />
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-2xl font-bold">
            {user?.username?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-gray-800 text-lg">{user?.username}</p>
            <p className="text-gray-500 text-sm">Administrator</p>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input {...register('first_name')} className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input {...register('last_name')} className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" {...register('email')} className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </div>
    </div>
  )
}
