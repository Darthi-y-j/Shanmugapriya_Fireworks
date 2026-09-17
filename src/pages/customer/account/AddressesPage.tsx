import { useEffect, useState } from 'react'
import { Plus, Star, Pencil, Trash2 } from 'lucide-react'
import { SEO } from '@/components/shared/SEO'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import {
  AccountPageHeader,
  accountContentClass,
  accountInputClass,
  accountLabelClass,
} from '@/components/customer/account/AccountUI'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import {
  createAddressId,
  getSavedAddresses,
  saveAddresses,
  type AddressType,
  type SavedAddress,
} from '@/lib/profileStore'
import { formatDisplayPhone } from '@/lib/businessInfo'
import { validatePhone } from '@/lib/utils'

const emptyForm = {
  name: '',
  mobile: '',
  houseNo: '',
  street: '',
  area: '',
  city: '',
  district: '',
  state: '',
  pincode: '',
  type: 'home' as AddressType,
}

export function AddressesPage() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [addresses, setAddresses] = useState<SavedAddress[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    if (!user) return
    setAddresses(getSavedAddresses(user.id))
  }, [user])

  const persist = (next: SavedAddress[]) => {
    if (!user) return
    saveAddresses(user.id, next)
    setAddresses(next)
  }

  const openAdd = () => {
    setEditingId(null)
    setForm(emptyForm)
    setShowForm(true)
  }

  const openEdit = (address: SavedAddress) => {
    setEditingId(address.id)
    setForm({
      name: address.name,
      mobile: address.mobile,
      houseNo: address.houseNo,
      street: address.street,
      area: address.area,
      city: address.city,
      district: address.district,
      state: address.state,
      pincode: address.pincode,
      type: address.type,
    })
    setShowForm(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    if (!form.name.trim() || !form.city.trim() || !form.pincode.trim()) {
      showToast('Name, city, and pincode are required', 'error')
      return
    }
    if (!validatePhone(form.mobile)) {
      showToast('Please enter a valid mobile number', 'error')
      return
    }

    if (editingId) {
      persist(
        addresses.map((a) =>
          a.id === editingId
            ? { ...a, ...form, name: form.name.trim(), pincode: form.pincode.trim() }
            : a,
        ),
      )
      showToast('Address updated', 'success')
    } else {
      const isFirst = addresses.length === 0
      const newAddress: SavedAddress = {
        id: createAddressId(),
        ...form,
        name: form.name.trim(),
        pincode: form.pincode.trim(),
        isDefault: isFirst,
      }
      persist([...addresses, newAddress])
      showToast('Address added', 'success')
    }

    setShowForm(false)
    setEditingId(null)
    setForm(emptyForm)
  }

  const setDefault = (id: string) => {
    persist(addresses.map((a) => ({ ...a, isDefault: a.id === id })))
    showToast('Default address updated', 'success')
  }

  const confirmDelete = () => {
    if (!deleteId) return
    const remaining = addresses.filter((a) => a.id !== deleteId)
    if (remaining.length > 0 && !remaining.some((a) => a.isDefault)) {
      remaining[0].isDefault = true
    }
    persist(remaining)
    setDeleteId(null)
    showToast('Address deleted', 'success')
  }

  const typeLabel = (type: AddressType) =>
    type === 'home' ? 'Home' : type === 'work' ? 'Work' : 'Other'

  return (
    <>
      <SEO title="My Addresses" description="Manage your delivery addresses." noIndex />

      <AccountPageHeader backTo="/account" subtitle="My Addresses" />

      <div className={`${accountContentClass} space-y-4`}>
        <p className="text-sm text-navy-700/65">
          Save delivery addresses for faster checkout — especially important for cracker deliveries across Tamil Nadu and India.
        </p>

        {addresses.length === 0 && !showForm && (
          <div className="rounded-2xl border border-dashed border-navy-900/15 bg-white p-8 text-center">
            <p className="text-sm text-navy-700/60">No saved addresses yet.</p>
          </div>
        )}

        {addresses.map((address) => (
          <article
            key={address.id}
            className="rounded-2xl border border-navy-900/10 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-navy-900">{address.name}</p>
                  <span className="rounded-full bg-navy-900/5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-navy-700/70">
                    {typeLabel(address.type)}
                  </span>
                  {address.isDefault && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-gold-500/15 px-2 py-0.5 text-[10px] font-bold text-gold-700">
                      <Star className="h-3 w-3 fill-gold-500 text-gold-500" />
                      Default
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-navy-700/70">{formatDisplayPhone(address.mobile)}</p>
                <p className="mt-2 text-sm leading-relaxed text-navy-800/80">
                  {[address.houseNo, address.street, address.area, address.city, address.district, address.state]
                    .filter(Boolean)
                    .join(', ')}
                  {address.pincode && ` — ${address.pincode}`}
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2 border-t border-navy-900/8 pt-4">
              {!address.isDefault && (
                <button
                  type="button"
                  onClick={() => setDefault(address.id)}
                  className="text-xs font-semibold text-gold-700 hover:text-gold-600"
                >
                  Set as Default
                </button>
              )}
              <button
                type="button"
                onClick={() => openEdit(address)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-navy-700 hover:text-navy-900"
              >
                <Pencil className="h-3 w-3" /> Edit
              </button>
              <button
                type="button"
                onClick={() => setDeleteId(address.id)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-3 w-3" /> Delete
              </button>
            </div>
          </article>
        ))}

        {showForm ? (
          <form onSubmit={handleSubmit} className="rounded-2xl border border-navy-900/10 bg-white p-6 shadow-sm">
            <h3 className="font-display text-lg font-bold text-navy-900">
              {editingId ? 'Edit Address' : 'Add New Address'}
            </h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className={accountLabelClass}>Name *</label>
                <input className={accountInputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <label className={accountLabelClass}>Mobile *</label>
                <input className={accountInputClass} type="tel" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} required />
              </div>
              <div>
                <label className={accountLabelClass}>House / Door No.</label>
                <input className={accountInputClass} value={form.houseNo} onChange={(e) => setForm({ ...form, houseNo: e.target.value })} />
              </div>
              <div>
                <label className={accountLabelClass}>Street</label>
                <input className={accountInputClass} value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} />
              </div>
              <div>
                <label className={accountLabelClass}>Area</label>
                <input className={accountInputClass} value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} />
              </div>
              <div>
                <label className={accountLabelClass}>City *</label>
                <input className={accountInputClass} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
              </div>
              <div>
                <label className={accountLabelClass}>District</label>
                <input className={accountInputClass} value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} />
              </div>
              <div>
                <label className={accountLabelClass}>State</label>
                <input className={accountInputClass} value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
              </div>
              <div>
                <label className={accountLabelClass}>Pincode *</label>
                <input className={accountInputClass} value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} required />
              </div>
              <div>
                <label className={accountLabelClass}>Address Type</label>
                <select className={accountInputClass} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as AddressType })}>
                  <option value="home">Home</option>
                  <option value="work">Work</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div className="mt-5 flex gap-2">
              <button type="submit" className="rounded-xl bg-navy-900 px-5 py-2.5 text-sm font-bold text-gold-300 hover:bg-navy-800">
                Save Address
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingId(null)
                }}
                className="rounded-xl border border-navy-900/10 px-5 py-2.5 text-sm font-semibold text-navy-700 hover:bg-cream-50"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            type="button"
            onClick={openAdd}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-gold-500/40 bg-gold-500/5 py-4 text-sm font-semibold text-gold-800 transition hover:bg-gold-500/10"
          >
            <Plus className="h-4 w-4" />
            Add New Address
          </button>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete address?"
        message="This address will be removed from your saved list."
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </>
  )
}
