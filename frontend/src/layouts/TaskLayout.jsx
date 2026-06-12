import { Outlet } from 'react-router-dom'
import Navbar from '../components/navbar/Navbar'

export default function TaskLayout() {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <main className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  )
}
