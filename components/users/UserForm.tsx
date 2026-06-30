'use client'

import { useState, useEffect } from 'react'
import type { CrmUser } from './users-view'
import { useModal } from '@/lib/modal'
import api from '@/lib/api'

type UserFormProps = {
  user?: CrmUser | null
  onSuccess?: () => void
}

export function UserForm({ user, onSuccess }: UserFormProps) {
  const { closeModal } = useModal()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullname: '',
    mobile_phone: '',
    type: 'viewer',
    is_active: true,
    is_verified: true,
    wallet: 0,
    points: 0,
  })

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email,
        password: '',
        fullname: user.name,
        mobile_phone: '',
        type: user.tier === 'Corporate' ? 'enterprise' : user.tier === 'Pro' ? 'student' : 'viewer',
        is_active: user.status === 'active',
        is_verified: user.twoFA,
        wallet: 0,
        points: user.events || 0,
      })
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (user) {
        await api.updateUser(user.id, formData)
      } else {
        await api.createUser(formData)
      }
      onSuccess?.()
      closeModal()
    } catch (error) {
      console.error('Failed to save user:', error)
      alert('فشل حفظ المستخدم')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-bold text-muted-foreground mb-1">الاسم الكامل</label>
        <input
          type="text"
          required
          value={formData.fullname}
          onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
          className="w-full rounded-xl border border-border bg-white/5 px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-muted-foreground mb-1">البريد الإلكتروني</label>
        <input
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full rounded-xl border border-border bg-white/5 px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
        />
      </div>

      {!user && (
        <div>
          <label className="block text-sm font-bold text-muted-foreground mb-1">كلمة المرور</label>
          <input
            type="password"
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full rounded-xl border border-border bg-white/5 px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-bold text-muted-foreground mb-1">رقم الجوال</label>
        <input
          type="tel"
          value={formData.mobile_phone}
          onChange={(e) => setFormData({ ...formData, mobile_phone: e.target.value })}
          className="w-full rounded-xl border border-border bg-white/5 px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-muted-foreground mb-1">نوع المستخدم</label>
        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
          className="w-full rounded-xl border border-border bg-white/5 px-4 py-2.5 text-foreground focus:outline-none focus:border-primary"
        >
          <option value="viewer">مشرف</option>
          <option value="enterprise">شركة</option>
          <option value="student">طالب</option>
        </select>
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.is_active}
            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
            className="rounded border-border bg-white/5 text-primary focus:ring-primary"
          />
          <span className="text-sm font-medium text-foreground">نشط</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.is_verified}
            onChange={(e) => setFormData({ ...formData, is_verified: e.target.checked })}
            className="rounded border-border bg-white/5 text-primary focus:ring-primary"
          />
          <span className="text-sm font-medium text-foreground">موثق</span>
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-muted-foreground mb-1">المحفظة</label>
          <input
            type="number"
            step="0.01"
            value={formData.wallet}
            onChange={(e) => setFormData({ ...formData, wallet: parseFloat(e.target.value) || 0 })}
            className="w-full rounded-xl border border-border bg-white/5 px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-muted-foreground mb-1">النقاط</label>
          <input
            type="number"
            value={formData.points}
            onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 0 })}
            className="w-full rounded-xl border border-border bg-white/5 px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={closeModal}
          className="flex-1 rounded-xl border border-border bg-white/5 px-4 py-2.5 text-sm font-bold text-foreground transition hover:bg-white/10"
        >
          إلغاء
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-50"
        >
          {loading ? 'جار الحفظ...' : user ? 'حفظ التغييرات' : 'إضافة مستخدم'}
        </button>
      </div>
    </form>
  )
}
