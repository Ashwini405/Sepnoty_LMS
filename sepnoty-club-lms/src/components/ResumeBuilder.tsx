import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  FileText, Plus, Trash2, Download, Eye, Save, User,
  Briefcase, GraduationCap, Award, Code, Mail, Phone, MapPin, Globe
} from 'lucide-react'
import { useAuth } from '../App'

interface Experience {
  id: string
  title: string
  company: string
  duration: string
  description: string
}

interface Education {
  id: string
  degree: string
  school: string
  year: string
}

interface Skill {
  id: string
  name: string
  level: number
}

export default function ResumeBuilder() {
  const { user, addNotification } = useAuth()
  const [activeTab, setActiveTab] = useState('edit')

  const [personalInfo, setPersonalInfo] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    website: 'linkedin.com/in/yourprofile',
    summary: 'Passionate software developer with expertise in web technologies and a strong foundation in computer science.'
  })

  const [experiences, setExperiences] = useState < Experience[] > ([
    { id: '1', title: 'Senior Developer', company: 'Tech Corp', duration: '2022 - Present', description: 'Led development of key features and mentored junior developers.' },
    { id: '2', title: 'Web Developer', company: 'StartUp Inc', duration: '2020 - 2022', description: 'Built responsive web applications using React and Node.js.' },
  ])

  const [education, setEducation] = useState < Education[] > ([
    { id: '1', degree: 'B.S. Computer Science', school: 'University of Technology', year: '2020' },
  ])

  const [skills, setSkills] = useState < Skill[] > ([
    { id: '1', name: 'JavaScript', level: 90 },
    { id: '2', name: 'React', level: 85 },
    { id: '3', name: 'Python', level: 75 },
    { id: '4', name: 'Node.js', level: 80 },
  ])

  const addExperience = () => {
    setExperiences([...experiences, { id: Date.now().toString(), title: '', company: '', duration: '', description: '' }])
  }

  const addEducation = () => {
    setEducation([...education, { id: Date.now().toString(), degree: '', school: '', year: '' }])
  }

  const addSkill = () => {
    setSkills([...skills, { id: Date.now().toString(), name: '', level: 50 }])
  }

  const handleSave = () => {
    addNotification({
      title: 'Resume Saved! 💾',
      message: 'Your resume has been saved successfully.',
      type: 'success'
    })
  }

  const handleDownload = () => {
    addNotification({
      title: 'Resume Downloaded! 📄',
      message: 'Your resume PDF has been generated and downloaded.',
      type: 'success'
    })
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Resume <span className="gradient-text">Builder</span>
            </h1>
            <p className="text-muted">Create a professional resume that stands out</p>
          </div>
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              className="px-4 py-2 bg-surface rounded-xl font-medium text-foreground flex items-center gap-2 hover:bg-border transition-colors"
            >
              <Save className="w-4 h-4" />
              Save
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownload}
              className="px-4 py-2 gradient-bg text-white rounded-xl font-medium flex items-center gap-2 shadow-lg shadow-primary/25"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </motion.button>
          </div>
        </motion.div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('edit')}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${activeTab === 'edit' ? 'gradient-bg text-white' : 'bg-surface text-muted'
              }`}
          >
            Edit
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${activeTab === 'preview' ? 'gradient-bg text-white' : 'bg-surface text-muted'
              }`}
          >
            <Eye className="w-4 h-4" />
            Preview
          </button>
        </div>

        {activeTab === 'edit' ? (
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-surface rounded-2xl p-6"
            >
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Personal Information
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                  <input
                    type="text"
                    value={personalInfo.name}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                  <input
                    type="email"
                    value={personalInfo.email}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
                  <input
                    type="tel"
                    value={personalInfo.phone}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Location</label>
                  <input
                    type="text"
                    value={personalInfo.location}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, location: e.target.value })}
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:border-primary outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2">Professional Summary</label>
                  <textarea
                    value={personalInfo.summary}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, summary: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:border-primary outline-none resize-none"
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-surface rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-primary" />
                  Work Experience
                </h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={addExperience}
                  className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm font-medium flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </motion.button>
              </div>
              <div className="space-y-4">
                {experiences.map((exp, i) => (
                  <div key={exp.id} className="p-4 bg-background rounded-xl">
                    <div className="grid md:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Job Title"
                        value={exp.title}
                        onChange={(e) => {
                          const updated = [...experiences]
                          updated[i].title = e.target.value
                          setExperiences(updated)
                        }}
                        className="px-3 py-2 bg-surface border border-border rounded-lg focus:border-primary outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Company"
                        value={exp.company}
                        onChange={(e) => {
                          const updated = [...experiences]
                          updated[i].company = e.target.value
                          setExperiences(updated)
                        }}
                        className="px-3 py-2 bg-surface border border-border rounded-lg focus:border-primary outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Duration"
                        value={exp.duration}
                        onChange={(e) => {
                          const updated = [...experiences]
                          updated[i].duration = e.target.value
                          setExperiences(updated)
                        }}
                        className="px-3 py-2 bg-surface border border-border rounded-lg focus:border-primary outline-none"
                      />
                      <button
                        onClick={() => setExperiences(experiences.filter(e => e.id !== exp.id))}
                        className="px-3 py-2 bg-danger/10 text-danger rounded-lg flex items-center justify-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        Remove
                      </button>
                    </div>
                    <textarea
                      placeholder="Description"
                      value={exp.description}
                      onChange={(e) => {
                        const updated = [...experiences]
                        updated[i].description = e.target.value
                        setExperiences(updated)
                      }}
                      rows={2}
                      className="w-full mt-3 px-3 py-2 bg-surface border border-border rounded-lg focus:border-primary outline-none resize-none"
                    />
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-surface rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Code className="w-5 h-5 text-primary" />
                  Skills
                </h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={addSkill}
                  className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm font-medium flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </motion.button>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {skills.map((skill, i) => (
                  <div key={skill.id} className="flex items-center gap-3">
                    <input
                      type="text"
                      placeholder="Skill name"
                      value={skill.name}
                      onChange={(e) => {
                        const updated = [...skills]
                        updated[i].name = e.target.value
                        setSkills(updated)
                      }}
                      className="flex-1 px-3 py-2 bg-background border border-border rounded-lg focus:border-primary outline-none"
                    />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={skill.level}
                      onChange={(e) => {
                        const updated = [...skills]
                        updated[i].level = parseInt(e.target.value)
                        setSkills(updated)
                      }}
                      className="w-24"
                    />
                    <span className="text-sm text-muted w-8">{skill.level}%</span>
                    <button
                      onClick={() => setSkills(skills.filter(s => s.id !== skill.id))}
                      className="p-2 text-danger hover:bg-danger/10 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl p-8 shadow-xl max-w-3xl mx-auto"
          >
            <div className="text-center mb-8 pb-6 border-b">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{personalInfo.name}</h1>
              <div className="flex items-center justify-center gap-4 text-sm text-gray-600 flex-wrap">
                <span className="flex items-center gap-1"><Mail className="w-4 h-4" />{personalInfo.email}</span>
                <span className="flex items-center gap-1"><Phone className="w-4 h-4" />{personalInfo.phone}</span>
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{personalInfo.location}</span>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-2 border-b pb-1">Professional Summary</h2>
              <p className="text-gray-700">{personalInfo.summary}</p>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-3 border-b pb-1">Work Experience</h2>
              {experiences.map((exp) => (
                <div key={exp.id} className="mb-4">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{exp.title}</h3>
                      <p className="text-gray-600">{exp.company}</p>
                    </div>
                    <span className="text-sm text-gray-500">{exp.duration}</span>
                  </div>
                  <p className="text-gray-700 mt-1">{exp.description}</p>
                </div>
              ))}
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3 border-b pb-1">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span key={skill.id} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
