import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { getAttendance, markAttendance, updateAttendance } from '../../services/attendanceAPI'
import { getUsers } from '../../services/usersAPI'
import Table from '../../components/tables/Table'
import Modal from '../../components/modals/Modal'
import Button from '../../components/common/Button'
import Badge from '../../components/common/Badge'
import PageHeader from '../../components/common/PageHeader'

export default function AttendanceDashboard() {
  const [records, setRecords] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const { register, handleSubmit, reset, setValue } = useForm()

  const load = () => {
    setLoading(true)
    Promise.all([getAttendance(), getUsers()])
      .then(([a, u]) => { setRecords(a.data); setUsers(u.data) })
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openAdd = () => { setEditing(null); reset(); setModal(true) }
  const openEdit = (r) => {
    setEditing(r)
    setValue('user', r.user); setValue('date', r.date)
    setValue('check_in', r.check_in); setValue('check_out', r.check_out)
    setValue('status', r.status); setValue('notes', r.notes)
    setModal(true)
  }

  const onSubmit = async (data) => {
    try {
      editing ? await updateAttendance(editing.id, data) : await markAttendance(data)
      toast.success(editing ? 'Updated!' : 'Marked!')
      setModal(false); load()
    } catch (e) {
      toast.error(e.response?.data?.non_field_errors?.[0] || 'Error saving record')
    }
  }

  const getUserName = (id) => {
    const u = users.find(u => u.id === id)
    return u ? `${u.first_name} ${u.last_name}` : id
  }

  const columns = [
    { key: 'user', label: 'User', render: r => getUserName(r.user) },
    { key: 'date', label: 'Date' },
    { key: 'check_in', label: 'Check In', render: r => r.check_in || '—' },
    { key: 'check_out', label: 'Check Out', render: r => r.check_out || '—' },
    { key: 'status', label: 'Status', render: r => <Badge value={r.status} /> },
    { key: 'notes', label: 'Notes', render: r => r.notes || '—' },
    {
      key: 'actions', label: 'Actions', render: r => (
        <button onClick={() => openEdit(r)} className="text-blue-500 hover:text-blue-700"><Pencil size={15} /></button>
      )
    },
  ]

  return (
    <div>
      <PageHeader title="Attendance" subtitle="Track daily attendance" action={<Button onClick={openAdd}><Plus size={16} className="inline mr-1" />Mark Attendance</Button>} />
      <div className="bg-white rounded-xl shadow-sm">
        <Table columns={columns} data={records} loading={loading} />
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Attendance' : 'Mark Attendance'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">User</label>
              <select {...register('user', { required: true })} className="w-full border rounded-lg px-3 py-2 text-sm">
                <option value="">Select user</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.username}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input type="date" {...register('date', { required: true })} className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Check In</label>
              <input type="time" {...register('check_in')} className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Check Out</label>
              <input type="time" {...register('check_out')} className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select {...register('status')} className="w-full border rounded-lg px-3 py-2 text-sm">
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
              <option value="half_day">Half Day</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <input {...register('notes')} className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setModal(false)}>Cancel</Button>
            <Button type="submit">{editing ? 'Update' : 'Mark'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
