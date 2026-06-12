import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

export default function NotFound() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const goHome = () => {
    if (!user) navigate('/login')
    else if (user.role === 'intern') navigate('/intern-user')
    else navigate('/admin')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-8xl font-bold text-primary-200">404</h1>
        <h2 className="text-2xl font-bold text-gray-800 mt-4">Page Not Found</h2>
        <p className="text-gray-500 mt-2 mb-6">The page you're looking for doesn't exist.</p>
        <button
          onClick={goHome}
          className="px-6 py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  )
}
