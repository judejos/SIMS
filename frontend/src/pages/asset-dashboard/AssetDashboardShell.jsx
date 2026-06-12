import { LayoutDashboard, Package, PackageCheck, Wrench } from 'lucide-react'
import DashboardShell from '../../layouts/shells/DashboardShell'
import AssetOverview from './views/AssetOverview'
import AssetList from './views/AssetList'
import AssetAssigned from './views/AssetAssigned'
import AssetRepair from './views/AssetRepair'

const navItems = [
  { key: 'overview',  label: 'Overview',        icon: LayoutDashboard, component: AssetOverview },
  { key: 'all',       label: 'All Assets',       icon: Package,         component: AssetList },
  { key: 'assigned',  label: 'Assigned',         icon: PackageCheck,    component: AssetAssigned },
  { key: 'repair',    label: 'Under Repair',     icon: Wrench,          component: AssetRepair },
]

export default function AssetDashboardShell() {
  return <DashboardShell title="Assets" navItems={navItems} accentColor="bg-orange-900" />
}
