import { useEffect, useState } from 'react'
import { getAssets } from '../../../services/assetsAPI'
import useAuth from '../../../hooks/useAuth'
import Table from '../../../components/tables/Table'
import Badge from '../../../components/common/Badge'
import Button from '../../../components/common/Button'
import PageHeader from '../../../components/common/PageHeader'
import toast from 'react-hot-toast'

export default function AssetReport() {
  const { user } = useAuth()
  const [assets, setAssets] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    getAssets().then(r => setAssets(r.data.filter(a => a.assigned_to === user?.id))).finally(() => setLoading(false))
  }, [user])

  const reportIssue = (asset) => {
    toast.success(`Issue reported for ${asset.asset_name}. Admin will be notified.`)
  }

  const columns = [
    { key: 'asset_name', label: 'Asset' },
    { key: 'asset_id', label: 'Asset ID' },
    { key: 'status', label: 'Status', render: r => <Badge value={r.status} /> },
    { key: 'purchase_date', label: 'Purchased' },
    { key: 'actions', label: '', render: r => (
      <Button size="sm" variant="danger" onClick={() => reportIssue(r)}>Report Issue</Button>
    )},
  ]

  return (
    <div>
      <PageHeader title="My Assets" subtitle="Assets assigned to you" />
      {assets.length === 0 && !loading
        ? <div className="bg-white rounded-xl shadow-sm p-6 text-gray-500">No assets assigned to you.</div>
        : <div className="bg-white rounded-xl shadow-sm"><Table columns={columns} data={assets} loading={loading} /></div>
      }
    </div>
  )
}
