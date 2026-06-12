import { useEffect, useState } from 'react'
import { getAssets } from '../../../services/assetsAPI'
import { getUsers } from '../../../services/usersAPI'
import Table from '../../../components/tables/Table'
import Badge from '../../../components/common/Badge'
import PageHeader from '../../../components/common/PageHeader'

export default function AssetAssigned() {
  const [assets, setAssets] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    Promise.all([getAssets(), getUsers()])
      .then(([a, u]) => { setAssets(a.data.filter(x => x.status === 'assigned')); setUsers(u.data) })
      .finally(() => setLoading(false))
  }, [])
  const getName = (id) => users.find(u => u.id === id)?.username || '—'
  const columns = [
    { key: 'asset_name', label: 'Asset' },
    { key: 'asset_id', label: 'ID' },
    { key: 'assigned_to', label: 'Assigned To', render: r => getName(r.assigned_to) },
    { key: 'purchase_date', label: 'Purchased' },
    { key: 'status', label: 'Status', render: r => <Badge value={r.status} /> },
  ]
  return (
    <div>
      <PageHeader title="Assigned Assets" subtitle={`${assets.length} assets currently assigned`} />
      <div className="bg-white rounded-xl shadow-sm"><Table columns={columns} data={assets} loading={loading} /></div>
    </div>
  )
}
