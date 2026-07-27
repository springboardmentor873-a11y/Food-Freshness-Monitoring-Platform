import { useCallback, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { UploadCloud, Camera, FolderOpen, ScanLine, X, Sparkles, ImageIcon, Tag } from 'lucide-react'
import Breadcrumb from '../components/common/Breadcrumb.jsx'
import Button from '../components/common/Button.jsx'
import * as api from '../services/api'
import { saveAssessment } from '../utils/assessmentStore.js'
import { FOOD_CATEGORIES, FOOD_CATALOG } from '../data/mockData.js'

const FORMATS = ['PNG', 'JPG', 'JPEG', 'WEBP']

export default function ImageAnalysisPage() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [category, setCategory] = useState(FOOD_CATEGORIES[0])
  const [itemName, setItemName] = useState(FOOD_CATALOG[FOOD_CATEGORIES[0]][0].name)
  const fileInputRef = useRef(null)
  const cameraInputRef = useRef(null)
  const navigate = useNavigate()

  const handleFile = useCallback((selected) => {
    if (!selected) return
    const validTypes = ['image/png', 'image/jpeg', 'image/webp']
    if (!validTypes.includes(selected.type)) {
      toast.error('Unsupported format. Please upload PNG, JPG, JPEG or WEBP.')
      return
    }
    setFile(selected)
    setPreview(URL.createObjectURL(selected))
  }, [])

  const onDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    handleFile(e.dataTransfer.files?.[0])
  }

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory)
    setItemName(FOOD_CATALOG[newCategory][0].name)
  }

  const handleAnalyze = async () => {
    if (!file) { toast.error('Please upload a food image first.'); return }
    setAnalyzing(true)
    try {
      const catalogItem = FOOD_CATALOG[category].find(i => i.name === itemName)
      const assessment = await api.uploadImage(file, { name: itemName, category, shelfDays: catalogItem?.shelfDays })
      const { shelfLife, recommendations } = await api.getPrediction(assessment)
      saveAssessment({ assessment, shelfLife, recommendations, imagePreview: preview, analyzedAt: new Date().toISOString() })
      toast.success(`Analysis complete — identified as ${assessment.identifiedFood}`)
      navigate('/freshness-assessment')
    } catch (err) {
      toast.error(err.message || 'Analysis failed. Please try again.')
    } finally {
      setAnalyzing(false)
    }
  }

  const clearFile = () => { setFile(null); setPreview(null) }

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Image Analysis' }]} />

      <div>
        <h2 className="font-display text-xl font-bold text-graphite-800 dark:text-white">AI Image Analysis</h2>
        <p className="text-sm text-graphite-500 dark:text-graphite-400">Upload a photo of your food item and let our EfficientNetB0-based model assess its freshness.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="glass-card col-span-1 p-6 lg:col-span-3"
        >
          {!preview ? (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              className={`flex min-h-[22rem] flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-colors ${
                dragOver ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-500/10' : 'border-graphite-200 dark:border-graphite-700'
              }`}
            >
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 3 }} className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <UploadCloud className="h-8 w-8" />
              </motion.div>
              <p className="mt-4 font-display text-lg font-bold text-graphite-800 dark:text-white">Drag & drop your food image here</p>
              <p className="mt-1 text-sm text-graphite-400">or use one of the options below</p>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Button variant="secondary" icon={FolderOpen} onClick={() => fileInputRef.current?.click()}>Browse Files</Button>
                <Button variant="secondary" icon={Camera} onClick={() => cameraInputRef.current?.click()}>Camera Upload</Button>
              </div>
              <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
              <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />

              <p className="mt-6 text-xs text-graphite-400">Supported formats: {FORMATS.join(', ')}</p>
            </div>
          ) : (
            <div className="relative">
              <button onClick={clearFile} className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-graphite-900/70 text-white hover:bg-graphite-900">
                <X className="h-4 w-4" />
              </button>
              <img src={preview} alt="Food preview" className="max-h-[26rem] w-full rounded-2xl object-cover" />

              <div className="mt-5 rounded-2xl border border-graphite-100 p-4 dark:border-graphite-800">
                <p className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-graphite-700 dark:text-graphite-200">
                  <Tag className="h-4 w-4 text-emerald-600" /> What food is this?
                </p>
                <p className="mb-3 text-xs text-graphite-400">
                  Confirm the item so the assessment below is matched to the right shelf-life data.
                </p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-graphite-500 dark:text-graphite-400">Category</label>
                    <select value={category} onChange={(e) => handleCategoryChange(e.target.value)} className="input-field">
                      {FOOD_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-graphite-500 dark:text-graphite-400">Item</label>
                    <select value={itemName} onChange={(e) => setItemName(e.target.value)} className="input-field">
                      {FOOD_CATALOG[category].map(i => <option key={i.name} value={i.name}>{i.name}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
                <div className="flex items-center gap-2 text-sm text-graphite-500 dark:text-graphite-400">
                  <ImageIcon className="h-4 w-4" /> {file?.name} · {(file?.size / 1024).toFixed(0)} KB
                </div>
                <Button icon={analyzing ? undefined : ScanLine} loading={analyzing} onClick={handleAnalyze} className="w-full sm:w-auto">
                  {analyzing ? 'Analyzing freshness...' : 'Analyze Food'}
                </Button>
              </div>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass-card col-span-1 space-y-4 p-6 lg:col-span-2"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-emerald-600" />
            <h3 className="font-display font-bold text-graphite-800 dark:text-white">How it works</h3>
          </div>
          {[
            { step: '1', title: 'Upload a photo', desc: 'Drag & drop, browse, or capture directly from your camera.' },
            { step: '2', title: 'AI freshness scan', desc: 'EfficientNetB0 extracts color, texture and surface features.' },
            { step: '3', title: 'Get your results', desc: 'Freshness score, spoilage probability and shelf-life prediction.' },
          ].map((s) => (
            <div key={s.step} className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">{s.step}</div>
              <div>
                <p className="text-sm font-semibold text-graphite-800 dark:text-white">{s.title}</p>
                <p className="text-xs text-graphite-500 dark:text-graphite-400">{s.desc}</p>
              </div>
            </div>
          ))}
          <div className="rounded-xl bg-emerald-50/70 p-4 dark:bg-emerald-500/10">
            <p className="text-xs text-emerald-700 dark:text-emerald-300">
              Tip: photograph the food item against a plain background in good lighting for the most accurate assessment.
            </p>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {analyzing && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="glass-card flex items-center gap-4 p-5"
          >
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }} className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white">
              <ScanLine className="h-5 w-5" />
            </motion.div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-graphite-800 dark:text-white">Running EfficientNetB0 inference...</p>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-graphite-200 dark:bg-graphite-700">
                <motion.div
                  className="h-full bg-emerald-600"
                  initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 3, ease: 'easeInOut' }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
