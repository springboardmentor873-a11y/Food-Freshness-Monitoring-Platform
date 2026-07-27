import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, Image as ImageIcon, Apple } from 'lucide-react'
import Breadcrumb from '../components/common/Breadcrumb.jsx'
import SearchBar from '../components/common/SearchBar.jsx'
import Badge from '../components/common/Badge.jsx'
import Pagination from '../components/common/Pagination.jsx'
import Modal from '../components/common/Modal.jsx'
import Button from '../components/common/Button.jsx'
import { SkeletonTableRow } from '../components/common/SkeletonLoader.jsx'
import { useInventory } from '../hooks/useInventory.js'
import { statusColor } from '../utils/helpers.js'
import { FOOD_CATEGORIES, STORAGE_LOCATIONS } from '../data/mockData.js'

const PAGE_SIZE = 8

export default function InventoryPage() {
  const { inventory: baseInventory, loading } = useInventory()
  const [items, setItems] = useState([])
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [page, setPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  useMemo(() => { if (baseInventory.length && items.length === 0) setItems(baseInventory) }, [baseInventory])

  const filtered = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.batchNumber.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter
    return matchesSearch && matchesCategory && matchesStatus
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const openAdd = () => { setEditingItem(null); setModalOpen(true) }
  const openEdit = (item) => { setEditingItem(item); setModalOpen(true) }

  const saveItem = (form) => {
    if (editingItem) {
      setItems(prev => prev.map(i => (i.id === editingItem.id ? { ...i, ...form } : i)))
      toast.success('Inventory item updated')
    } else {
      const newItem = {
        id: `INV-${Math.floor(Math.random() * 9000 + 1000)}`,
        daysLeft: 10,
        freshnessScore: 80,
        status: 'Fresh',
        ...form
      }
      setItems(prev => [newItem, ...prev])
      toast.success('Inventory item added')
    }
    setModalOpen(false)
  }

  const confirmDelete = () => {
    setItems(prev => prev.filter(i => i.id !== deleteTarget.id))
    toast.success(`${deleteTarget.name} removed from inventory`)
    setDeleteTarget(null)
  }

  return (
    <div className="space-y-5">
      <Breadcrumb items={[{ label: 'Inventory' }]} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-graphite-800 dark:text-white">Food Inventory</h2>
          <p className="text-sm text-graphite-500 dark:text-graphite-400">{filtered.length} batches tracked across all storage locations</p>
        </div>
        <Button icon={Plus} onClick={openAdd}>Add Inventory</Button>
      </div>

      <div className="glass-card p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1) }} placeholder="Search by food name or batch number..." className="sm:max-w-sm" />
          <select value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setPage(1) }} className="input-field sm:w-48">
            <option value="All">All Categories</option>
            {FOOD_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }} className="input-field sm:w-48">
            <option value="All">All Statuses</option>
            {['Fresh', 'Good', 'Acceptable', 'Near Expiry', 'Spoiled'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="glass-card overflow-x-auto p-0">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-graphite-200/60 dark:border-graphite-800 text-xs uppercase tracking-wide text-graphite-400">
            <tr>
              <th className="px-4 py-3">Food</th>
              <th className="px-4 py-3">Batch No.</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Mfg. Date</th>
              <th className="px-4 py-3">Expiry Date</th>
              <th className="px-4 py-3">Quantity</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-graphite-100 dark:divide-graphite-800">
            {loading && Array.from({ length: 6 }).map((_, i) => <SkeletonTableRow key={i} cols={9} />)}
            {!loading && paged.map((item) => (
              <motion.tr
                key={item.id}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="hover:bg-graphite-50/70 dark:hover:bg-graphite-800/40"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <Apple className="h-4 w-4" />
                    </div>
                    <span className="font-medium text-graphite-800 dark:text-white">{item.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-graphite-500">{item.batchNumber}</td>
                <td className="px-4 py-3 text-graphite-500 dark:text-graphite-400">{item.category}</td>
                <td className="px-4 py-3 text-graphite-500 dark:text-graphite-400">{item.manufacturingDate}</td>
                <td className="px-4 py-3 text-graphite-500 dark:text-graphite-400">{item.expiryDate}</td>
                <td className="px-4 py-3 text-graphite-500 dark:text-graphite-400">{item.quantity}</td>
                <td className="px-4 py-3 text-graphite-500 dark:text-graphite-400">{item.storageLocation}</td>
                <td className="px-4 py-3"><Badge color={statusColor(item.status)}>{item.status}</Badge></td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1.5">
                    <button onClick={() => openEdit(item)} className="rounded-lg p-1.5 text-graphite-400 hover:bg-graphite-100 hover:text-emerald-600 dark:hover:bg-graphite-800">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => setDeleteTarget(item)} className="rounded-lg p-1.5 text-graphite-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
            {!loading && paged.length === 0 && (
              <tr><td colSpan={9} className="px-4 py-10 text-center text-graphite-400">No inventory items match your filters.</td></tr>
            )}
          </tbody>
        </table>
        <div className="px-4 pb-4">
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>

      <InventoryFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={saveItem}
        item={editingItem}
      />

      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Inventory Item" size="sm">
        <p className="text-sm text-graphite-500 dark:text-graphite-400">
          Are you sure you want to remove <span className="font-semibold text-graphite-800 dark:text-white">{deleteTarget?.name}</span> (Batch {deleteTarget?.batchNumber})? This action cannot be undone.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button variant="danger" icon={Trash2} onClick={confirmDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  )
}

function InventoryFormModal({ open, onClose, onSave, item }) {
  const [form, setForm] = useState({})

  useMemo(() => {
    if (item) setForm(item)
    else setForm({ name: '', category: FOOD_CATEGORIES[0], batchNumber: '', manufacturingDate: '', expiryDate: '', quantity: '', storageLocation: STORAGE_LOCATIONS[0] })
  }, [item, open])

  const handleChange = (key, value) => setForm(prev => ({ ...prev, [key]: value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name || !form.batchNumber) { toast.error('Food name and batch number are required'); return }
    onSave(form)
  }

  return (
    <Modal open={open} onClose={onClose} title={item ? 'Edit Inventory Item' : 'Add Inventory Item'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-xl border-2 border-dashed border-graphite-200 dark:border-graphite-700 p-6 text-center">
          <ImageIcon className="mx-auto h-8 w-8 text-graphite-300" />
          <p className="mt-2 text-xs text-graphite-400">Food image upload (optional) — connect to Image Analysis for AI-based entry</p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-graphite-600 dark:text-graphite-300">Food Name</label>
            <input className="input-field" value={form.name || ''} onChange={(e) => handleChange('name', e.target.value)} placeholder="e.g. Roma Tomatoes" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-graphite-600 dark:text-graphite-300">Batch Number</label>
            <input className="input-field" value={form.batchNumber || ''} onChange={(e) => handleChange('batchNumber', e.target.value)} placeholder="e.g. VG-2026451" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-graphite-600 dark:text-graphite-300">Category</label>
            <select className="input-field" value={form.category} onChange={(e) => handleChange('category', e.target.value)}>
              {FOOD_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-graphite-600 dark:text-graphite-300">Storage Location</label>
            <select className="input-field" value={form.storageLocation} onChange={(e) => handleChange('storageLocation', e.target.value)}>
              {STORAGE_LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-graphite-600 dark:text-graphite-300">Manufacturing Date</label>
            <input type="date" className="input-field" value={form.manufacturingDate || ''} onChange={(e) => handleChange('manufacturingDate', e.target.value)} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-graphite-600 dark:text-graphite-300">Expiry Date</label>
            <input type="date" className="input-field" value={form.expiryDate || ''} onChange={(e) => handleChange('expiryDate', e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-graphite-600 dark:text-graphite-300">Quantity</label>
            <input className="input-field" value={form.quantity || ''} onChange={(e) => handleChange('quantity', e.target.value)} placeholder="e.g. 120 kg" />
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit">{item ? 'Save Changes' : 'Add Item'}</Button>
        </div>
      </form>
    </Modal>
  )
}
