import { useEffect, useState } from 'react'
import { getAssets } from '../../../services/assetsAPI'
import StatCard from '../../../components/cards/StatCard'
import Table from '../../../components/tables/Table'
import Badge from '../../../components/common/Badge'
import { Package, PackageCheck, Wrench, PackageOpen } from 'lucide-react'

export default function AssetOverview() {
  const [assets, setAssets] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => { getAssets().then(r => setAssets(r.data)).finally(() => setLoading(false)) }, [])

  const available = assets.filter(a => a.status === 'available').length
  const assigned = assets.filter(a => a.status === 'assigned').length
  const repair = assets.filter(a => a.status === 'repair').length

  const columns = [
    { key: 'asset_name', label: 'Asset' },
    { key: 'asset_id', label: 'Asset ID' },
    { key: 'status', label: 'Status', render: r => <Badge value={r.status} /> },
    { key: 'purchase_date', label: 'Purchased' },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Assets" value={assets.length} icon={Package} color="blue" />
        <StatCard title="Available" value={available} icon={PackageOpen} color="green" />
        <StatCard title="Assigned" value={assigned} icon={PackageCheck} color="yellow" />
        <StatCard title="Under Repair" value={repair} icon={Wrench} color="red" />
      </div>
      <div className="bg-white rounded-xl shadow-sm">
        <div className="px-5 py-4 border-b"><h3 className="font-semibold text-gray-700">All Assets</h3></div>
        <Table columns={columns} data={assets} loading={loading} />
      </div>
    </div>
  )
}
