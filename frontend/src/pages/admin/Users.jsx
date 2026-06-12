import { useEffect, useState } from 'react'
import { getUsers } from '../../services/usersAPI'
import { Trash2, Pencil } from 'lucide-react'
import SearchBar from '../../components/common/SearchBar'
import PageHeader from '../../components/common/PageHeader'
import useSearch from '../../hooks/useSearch'

export default function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const { query, setQuery, filtered } = useSearch(users, ['username', 'email', 'first_name', 'last_name'])

  useEffect(() => {
    getUsers().then(r => setUsers(r.data)).finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-4">
      <PageHeader title="Users" subtitle={`${filtered.length} of ${users.length} users`} />
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b">
          <SearchBar value={query} onChange={setQuery} placeholder="Search by name, email, username…" className="max-w-sm" />
        </div>
        {loading ? <p className="p-6 text-gray-500">Loading...</p> : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 text-left">Username</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-400">No users match your search.</td></tr>
              ) : filtered.map(u => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 font-medium">{u.username}</td>
                  <td className="px-6 py-3 text-gray-500">{u.email}</td>
                  <td className="px-6 py-3">{u.first_name} {u.last_name}</td>
                  <td className="px-6 py-3 flex gap-2">
                    <button className="text-blue-500 hover:text-blue-700"><Pencil size={16} /></button>
                    <button className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
