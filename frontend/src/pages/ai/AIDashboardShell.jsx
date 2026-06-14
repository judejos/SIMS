import { Bot, FileText, Mic, TrendingUp, BookOpen } from 'lucide-react'
import { Routes, Route } from 'react-router-dom'
import DashboardShell from '../../layouts/shells/DashboardShell'
import Chatbot from './Chatbot'
import ResumeBuilder from './ResumeBuilder'
import MockInterview from './MockInterview'
import PerformanceAnalysis from './PerformanceAnalysis'
import LearningPath from './LearningPath'

const navItems = [
  { key: 'chatbot', label: 'AI Chatbot', icon: Bot, component: Chatbot },
  { key: 'resume', label: 'Resume Evaluator', icon: FileText, component: ResumeBuilder },
  { key: 'interview', label: 'Mock Interview', icon: Mic, component: MockInterview },
  { key: 'performance', label: 'AI Insights', icon: TrendingUp, component: PerformanceAnalysis },
  { key: 'learning', label: 'Learning Paths', icon: BookOpen, component: LearningPath },
]

export default function AIDashboardShell() {
  return <DashboardShell title="AI Center" navItems={navItems} accentColor="bg-indigo-900" />
}
