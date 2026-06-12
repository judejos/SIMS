import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import Button from '../../../components/common/Button'
import PageHeader from '../../../components/common/PageHeader'

export default function InternForms() {
  const [fields, setFields] = useState([{ label: '', type: 'text' }])
  const [formName, setFormName] = useState('')

  const addField = () => setFields(f => [...f, { label: '', type: 'text' }])
  const removeField = (i) => setFields(f => f.filter((_, idx) => idx !== i))
  const updateField = (i, key, val) => setFields(f => f.map((field, idx) => idx === i ? { ...field, [key]: val } : field))

  return (
    <div className="max-w-2xl space-y-4">
      <PageHeader title="Form Builder" subtitle="Create custom forms for interns" />
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Form Name</label>
          <input value={formName} onChange={e => setFormName(e.target.value)} placeholder="e.g. Weekly Report Form" className="w-full border rounded-lg px-3 py-2 text-sm" />
        </div>
        <div className="space-y-3">
          {fields.map((field, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input value={field.label} onChange={e => updateField(i, 'label', e.target.value)} placeholder="Field label" className="flex-1 border rounded-lg px-3 py-2 text-sm" />
              <select value={field.type} onChange={e => updateField(i, 'type', e.target.value)} className="border rounded-lg px-3 py-2 text-sm">
                <option value="text">Text</option>
                <option value="textarea">Textarea</option>
                <option value="number">Number</option>
                <option value="date">Date</option>
                <option value="select">Select</option>
              </select>
              <button onClick={() => removeField(i)} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={addField}><Plus size={15} className="inline mr-1" />Add Field</Button>
          <Button onClick={() => alert('Form saved! (Backend integration coming soon)')}>Save Form</Button>
        </div>
      </div>
    </div>
  )
}
