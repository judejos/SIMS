import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, GraduationCap, Briefcase, CheckCircle2, ChevronRight, ChevronLeft, Upload } from 'lucide-react'
import api from '../../services/api'
import { toast } from 'react-toastify'

const STEPS = [
  { id: 'personal', title: 'Personal Details', icon: FileText },
  { id: 'academic', title: 'Academic Details', icon: GraduationCap },
  { id: 'internship', title: 'Internship Details', icon: Briefcase }
]

export default function InternOnboarding() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  
  const [formData, setFormData] = useState({
    employee_id: '', first_name: '', last_name: '', email: '', phone: '', aadhar_number: '', gender: '', dob: '',
    registration_number: '', location: '', college_name: '', degree: '', college_department: '', year_of_passing: '',
    domain: '', shift_timing: '', scheme: 'free', start_date: '', end_date: '', terms_agreed: false
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1))
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.terms_agreed) {
      toast.error('You must agree to the terms and conditions')
      return
    }
    
    setIsSubmitting(true)
    try {
      // Endpoint does not require auth
      await api.post('/interns/onboarding/submit/', formData)
      setSuccess(true)
      toast.success('Onboarding form submitted successfully!')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to submit onboarding form')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="text-green-500 w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Application Submitted!</h2>
          <p className="text-gray-600 mb-6">Your onboarding details have been sent to the Management team for review. You will receive an email with login credentials once approved.</p>
          <a href="/login" className="inline-block bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors">Return to Login</a>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Intern Onboarding</h1>
          <p className="mt-2 text-gray-500">Please complete all steps to register for the SIMS platform.</p>
        </div>

        {/* Stepper */}
        <div className="mb-12">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 rounded"></div>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary-600 rounded transition-all duration-300" style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}></div>
            
            {STEPS.map((step, index) => {
              const isActive = index <= currentStep
              const Icon = step.icon
              return (
                <div key={step.id} className="relative z-10 flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-white transition-colors duration-300 ${isActive ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                    <Icon size={20} />
                  </div>
                  <span className={`mt-2 text-xs font-semibold ${isActive ? 'text-primary-700' : 'text-gray-400'}`}>{step.title}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <form onSubmit={currentStep === STEPS.length - 1 ? handleSubmit : (e) => { e.preventDefault(); nextStep() }}>
            <div className="p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  
                  {/* STEP 1: Personal Details */}
                  {currentStep === 0 && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-bold text-gray-800 border-b pb-2">Personal Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID *</label>
                          <input required type="text" name="employee_id" value={formData.employee_id} onChange={handleChange} className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-primary-500 focus:border-primary-500" placeholder="e.g. INT-1024" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Aadhar Number</label>
                          <input type="text" name="aadhar_number" value={formData.aadhar_number} onChange={handleChange} className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-primary-500 focus:border-primary-500" placeholder="XXXX-XXXX-XXXX" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                          <input required type="text" name="first_name" value={formData.first_name} onChange={handleChange} className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-primary-500 focus:border-primary-500" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                          <input required type="text" name="last_name" value={formData.last_name} onChange={handleChange} className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-primary-500 focus:border-primary-500" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                          <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-primary-500 focus:border-primary-500" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                          <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-primary-500 focus:border-primary-500" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                          <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-primary-500 focus:border-primary-500" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                          <select name="gender" value={formData.gender} onChange={handleChange} className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-primary-500 focus:border-primary-500">
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: Academic Details */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-bold text-gray-800 border-b pb-2">Academic Background</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">College Name *</label>
                          <input required type="text" name="college_name" value={formData.college_name} onChange={handleChange} className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-primary-500 focus:border-primary-500" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number *</label>
                          <input required type="text" name="registration_number" value={formData.registration_number} onChange={handleChange} className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-primary-500 focus:border-primary-500" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Degree *</label>
                          <input required type="text" name="degree" value={formData.degree} onChange={handleChange} className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-primary-500 focus:border-primary-500" placeholder="e.g. B.Tech, B.Sc" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Department/Specialization *</label>
                          <input required type="text" name="college_department" value={formData.college_department} onChange={handleChange} className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-primary-500 focus:border-primary-500" placeholder="e.g. Computer Science" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Year of Passing *</label>
                          <input required type="text" name="year_of_passing" value={formData.year_of_passing} onChange={handleChange} className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-primary-500 focus:border-primary-500" placeholder="YYYY" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                          <input required type="text" name="location" value={formData.location} onChange={handleChange} className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-primary-500 focus:border-primary-500" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: Internship Details */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-bold text-gray-800 border-b pb-2">Internship Program</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Applied Domain *</label>
                          <select required name="domain" value={formData.domain} onChange={handleChange} className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-primary-500 focus:border-primary-500">
                            <option value="">Select Domain</option>
                            <option value="Full Stack">Full Stack Development</option>
                            <option value="Data Science">Data Science / ML</option>
                            <option value="UI/UX">UI/UX Design</option>
                            <option value="DevOps">DevOps & Cloud</option>
                            <option value="Marketing">Marketing</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Internship Scheme *</label>
                          <select required name="scheme" value={formData.scheme} onChange={handleChange} className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-primary-500 focus:border-primary-500">
                            <option value="free">Free / Unpaid</option>
                            <option value="paid">Paid (Intern pays fee)</option>
                            <option value="stipend">Stipend (Company pays intern)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Shift *</label>
                          <select required name="shift_timing" value={formData.shift_timing} onChange={handleChange} className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-primary-500 focus:border-primary-500">
                            <option value="">Select Shift</option>
                            <option value="Morning">Morning (9 AM - 6 PM)</option>
                            <option value="Evening">Evening (2 PM - 10 PM)</option>
                            <option value="Flexible">Flexible</option>
                          </select>
                        </div>
                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                            <input required type="date" name="start_date" value={formData.start_date} onChange={handleChange} className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-primary-500 focus:border-primary-500" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Expected End Date *</label>
                            <input required type="date" name="end_date" value={formData.end_date} onChange={handleChange} className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-primary-500 focus:border-primary-500" />
                          </div>
                        </div>
                        <div className="md:col-span-2 mt-4 pt-4 border-t border-gray-100">
                          <label className="flex items-start gap-3 cursor-pointer">
                            <input type="checkbox" name="terms_agreed" checked={formData.terms_agreed} onChange={handleChange} className="mt-1 w-5 h-5 text-primary-600 rounded focus:ring-primary-500" />
                            <span className="text-sm text-gray-600">I certify that the information provided is accurate and true. I agree to abide by the company's internship policies and non-disclosure agreements as part of this program. *</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* Footer Navigation */}
            <div className="bg-gray-50 p-6 border-t border-gray-200 flex items-center justify-between">
              <button type="button" onClick={prevStep} disabled={currentStep === 0} className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-colors ${currentStep === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-200 bg-white border border-gray-300'}`}>
                <ChevronLeft size={18} /> Back
              </button>
              
              <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-sm">
                {currentStep === STEPS.length - 1 ? (isSubmitting ? 'Submitting...' : 'Submit Application') : 'Continue'}
                {currentStep !== STEPS.length - 1 && <ChevronRight size={18} />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
