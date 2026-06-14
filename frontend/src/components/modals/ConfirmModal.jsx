import Modal from './Modal'
import Button from '../common/Button'
import { AlertTriangle } from 'lucide-react'

export default function ConfirmModal({ open, onClose, onConfirm, title = 'Confirm Action', message = 'Are you sure you want to proceed?', confirmText = 'Confirm', variant = 'danger' }) {
  const isDanger = variant === 'danger'
  
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className="flex flex-col items-center text-center py-4">
        <div className={`p-3 rounded-full mb-4 ${isDanger ? 'bg-red-100 text-red-600' : 'bg-primary-100 text-primary-600'}`}>
          <AlertTriangle size={32} />
        </div>
        <p className="text-gray-700 text-sm">{message}</p>
      </div>
      <div className="flex justify-end gap-3 pt-4 mt-2 border-t">
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <button 
          onClick={() => { onConfirm(); onClose(); }}
          className={`px-4 py-2 text-sm font-medium rounded-lg text-white transition-colors ${
            isDanger ? 'bg-red-600 hover:bg-red-700' : 'bg-primary-600 hover:bg-primary-700'
          }`}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  )
}
