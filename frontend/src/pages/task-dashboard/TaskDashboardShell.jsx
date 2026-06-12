import { LayoutDashboard, ClipboardList, FolderKanban, Users, PlusCircle, BarChart2, Building2, FileSearch } from 'lucide-react'
import DashboardShell from '../../layouts/shells/DashboardShell'
import TaskOverview from './views/TaskOverview'
import TaskList from './views/TaskList'
import ProjectList from './views/ProjectList'
import TeamList from './views/TeamList'
import TaskDepartments from './views/TaskDepartments'
import CreateTask from './views/CreateTask'
import TaskReports from './views/TaskReports'
import IndividualTask from './views/IndividualTask'

const navItems = [
  { key: 'overview',    label: 'Overview',    icon: LayoutDashboard, component: TaskOverview },
  { key: 'tasks',       label: 'Task List',   icon: ClipboardList,   component: TaskList },
  { key: 'individual',  label: 'Task Detail', icon: FileSearch,      component: IndividualTask },
  { key: 'projects',    label: 'Projects',    icon: FolderKanban,    component: ProjectList },
  { key: 'teams',       label: 'Teams',       icon: Users,           component: TeamList },
  { key: 'departments', label: 'Departments', icon: Building2,       component: TaskDepartments },
  { key: 'create',      label: 'Create Task', icon: PlusCircle,      component: CreateTask },
  { key: 'reports',     label: 'Reports',     icon: BarChart2,       component: TaskReports },
]

export default function TaskDashboardShell() {
  return <DashboardShell title="Tasks" navItems={navItems} accentColor="bg-indigo-900" />
}
