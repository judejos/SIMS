import useAuth from '../../../hooks/useAuth'

export default function MyProfile() {
  const { user } = useAuth()
  return (
    <div className="max-w-lg space-y-4">
      <h2 className="text-xl font-bold text-gray-800">My Profile</h2>
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 text-2xl font-bold">
            {user?.username?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-gray-800 text-lg">{user?.username}</p>
            <p className="text-gray-500 text-sm">Intern</p>
          </div>
        </div>
        <div className="border-t pt-4 text-sm text-gray-500">Profile editing coming soon.</div>
      </div>
    </div>
  )
}
