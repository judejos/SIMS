import { useEffect, useState } from 'react'
import { getAssets } from '../../../services/assetsAPI'
import Table from '../../../components/tables/Table'
import Badge from '../../../components/common/Badge'
import PageHeader from '../../../components/common/PageHeader'

export default function AssetRepair() {
  const [assets, setAssets] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    getAssets().then(r => setAssets(r.data.filter(a => a.status === 'repair'))).finally(() => setLoading(false))
  }, [])
  const columns = [
    { key: 'asset_name', label: 'Asset' },
    { key: 'asset_id', label: 'ID' },
    { key: 'purchase_date', label: 'Purchased' },
    { key: 'status', label: 'Status', render: r => <Badge value={r.status} /> },
  ]
  return (
    <div>
      <PageHeader title="Under Repair" subtitle={`${assets.length} assets under repair`} />
      <div className="bg-white rounded-xl shadow-sm"><Table columns={columns} data={assets} loading={loading} /></div>
    </div>
  )
}
