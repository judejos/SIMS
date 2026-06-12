import { LayoutDashboard, Wallet, PlusCircle, BarChart2, CreditCard } from 'lucide-react'
import DashboardShell from '../../layouts/shells/DashboardShell'
import PayrollOverview from './views/PayrollOverview'
import PayrollRecords from './views/PayrollRecords'
import AddPayroll from './views/AddPayroll'
import PayrollReports from './views/PayrollReports'
import InternFees from './views/InternFees'

const navItems = [
  { key: 'overview',     label: 'Overview',       icon: LayoutDashboard, component: PayrollOverview },
  { key: 'records',      label: 'All Records',    icon: Wallet,          component: PayrollRecords },
  { key: 'intern-fees',  label: 'Intern Fees',    icon: CreditCard,      component: InternFees },
  { key: 'add',          label: 'Add Record',     icon: PlusCircle,      component: AddPayroll },
  { key: 'reports',      label: 'Reports',        icon: BarChart2,       component: PayrollReports },
]

export default function PayrollDashboardShell() {
  return <DashboardShell title="Payroll" navItems={navItems} accentColor="bg-emerald-900" />
}
