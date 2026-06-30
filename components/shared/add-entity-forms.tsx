'use client'

import { useState, type ReactNode } from 'react'
import { UploadCloud } from 'lucide-react'
import { useModal } from '@/lib/modal'
import { useToast } from '@/lib/toast'
import { GeoBlockingControl } from '@/components/shared/geo-widgets'

// ============================================================================
// Reusable "create new" modal forms used across the dashboard's green + buttons.
// Each form manages its own local state and, on save, fires a success toast and
// closes the modal. The actual API wiring is left to the backend (marked TODO).
// Open them via: openModal({ title, content: <CmsUploadForm /> })
// ============================================================================

function FormShell({
  children,
  onSave,
  saveLabel = 'حفظ',
  saveClass = 'bg-primary text-primary-foreground',
  disabled,
}: {
  children: ReactNode
  onSave: () => void
  saveLabel?: string
  saveClass?: string
  disabled?: boolean
}) {
  const { closeModal } = useModal()
  return (
    <div className="w-full">
      <div className="space-y-4">{children}</div>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          onClick={closeModal}
          className="flex-1 rounded-xl border border-border bg-white/5 py-3 text-sm font-bold text-foreground transition hover:bg-white/10"
        >
          إلغاء
        </button>
        <button
          onClick={onSave}
          disabled={disabled}
          className={`flex-1 rounded-xl py-3 text-sm font-bold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 ${saveClass}`}
        >
          {saveLabel}
        </button>
      </div>
    </div>
  )
}

function FieldLabel({ children }: { children: ReactNode }) {
  return <label className="mb-2 block text-sm font-medium text-muted-foreground">{children}</label>
}

// ---------------------------------------------------------------- CMS upload
export function CmsUploadForm() {
  const { closeModal } = useModal()
  const { toast } = useToast()
  const [type, setType] = useState('')
  const [title, setTitle] = useState('')
  const [fileName, setFileName] = useState('')
  const [desc, setDesc] = useState('')

  const save = () => {
    // TODO: BACKEND — POST content metadata + uploaded file to the CMS API.
    toast.success(`تم نشر المحتوى: ${title}`)
    closeModal()
  }

  return (
    <FormShell onSave={save} saveLabel="حفظ ونشر" saveClass="bg-success text-white" disabled={!title.trim() || !type}>
      <div>
        <FieldLabel>نوع المحتوى</FieldLabel>
        <select value={type} onChange={(e) => setType(e.target.value)} className="input-base">
          <option value="" className="bg-popover">اختر نوع المحتوى...</option>
          <option value="movie" className="bg-popover">فيلم قصير</option>
          <option value="series" className="bg-popover">مسلسل</option>
          <option value="promo" className="bg-popover">إعلان ترويجي</option>
          <option value="documentary" className="bg-popover">وثائقي</option>
        </select>
      </div>
      <div>
        <FieldLabel>عنوان العمل</FieldLabel>
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="input-base" placeholder="مثال: ظل الصحراء" />
      </div>
      <div>
        <FieldLabel>ملف الفيديو</FieldLabel>
        <label className="flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-border p-6 text-center transition hover:bg-white/5">
          <UploadCloud className="mb-2 h-7 w-7 text-primary" />
          <span className="text-sm font-medium text-primary">
            {fileName || 'اضغط لرفع الفيديو (MP4, MOV)'}
          </span>
          <span className="mt-1 text-xs text-muted-foreground">الحد الأقصى للملف 2GB</span>
          <input
            type="file"
            accept="video/mp4,video/quicktime"
            className="hidden"
            onChange={(e) => setFileName(e.target.files?.[0]?.name ?? '')}
          />
        </label>
      </div>
      <div>
        <FieldLabel>وصف العمل</FieldLabel>
        <textarea value={desc} onChange={(e) => setDesc(e.target.value)} className="input-base h-24 resize-none" placeholder="وصف العمل والقصة..." />
      </div>
      <GeoBlockingControl />
    </FormShell>
  )
}

// ---------------------------------------------------------------- Chat room
export function ChatRoomForm() {
  const { closeModal } = useModal()
  const { toast } = useToast()
  const [name, setName] = useState('')
  const [visibility, setVisibility] = useState('public')

  const save = () => {
    // TODO: BACKEND — create a new chat room with the chosen visibility.
    toast.success(`تم إنشاء غرفة: ${name}`)
    closeModal()
  }

  return (
    <FormShell onSave={save} saveLabel="إنشاء الغرفة" disabled={!name.trim()}>
      <div>
        <FieldLabel>اسم الغرفة</FieldLabel>
        <input value={name} onChange={(e) => setName(e.target.value)} className="input-base" placeholder="مثال: نقاشات صناع الأفلام" />
      </div>
      <div>
        <FieldLabel>نوع الغرفة</FieldLabel>
        <select value={visibility} onChange={(e) => setVisibility(e.target.value)} className="input-base">
          <option value="public" className="bg-popover">عامة (لجميع المشتركين)</option>
          <option value="private" className="bg-popover">خاصة (للمحترفين فقط)</option>
          <option value="cast" className="bg-popover">طاقم عمل مشروع محدد</option>
        </select>
      </div>
    </FormShell>
  )
}

// ---------------------------------------------------------------- Workshop
export function WorkshopForm() {
  const { closeModal } = useModal()
  const { toast } = useToast()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [coverImage, setCoverImage] = useState('')
  const [specialization, setSpecialization] = useState('')
  const [location, setLocation] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [numberOfParticipants, setNumberOfParticipants] = useState('')
  const [isActive, setIsActive] = useState('true')
  const [isApproved, setIsApproved] = useState('false')

  const save = () => {
    // TODO: BACKEND — schedule the workshop and notify subscribers.
    toast.success(`تم جدولة الورشة: ${name}`)
    closeModal()
  }

  return (
    <FormShell onSave={save} saveLabel="جدولة الورشة" disabled={!name.trim()}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <FieldLabel>اسم الورشة</FieldLabel>
          <input value={name} onChange={(e) => setName(e.target.value)} className="input-base" placeholder="مثال: أساسيات الإخراج" />
        </div>
        <div className="md:col-span-2">
          <FieldLabel>الوصف</FieldLabel>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="input-base h-24 resize-none" placeholder="وصف الورشة" />
        </div>
        <div className="md:col-span-2">
          <FieldLabel>صورة الغلاف (URL)</FieldLabel>
          <input type="url" dir="ltr" value={coverImage} onChange={(e) => setCoverImage(e.target.value)} className="input-base text-left" placeholder="https://example.com/image.jpg" />
        </div>
        <div>
          <FieldLabel>التخصص</FieldLabel>
          <input value={specialization} onChange={(e) => setSpecialization(e.target.value)} className="input-base" placeholder="مثال: السينما" />
        </div>
        <div>
          <FieldLabel>الموقع</FieldLabel>
          <input value={location} onChange={(e) => setLocation(e.target.value)} className="input-base" placeholder="مدينة الكويت" />
        </div>
        <div>
          <FieldLabel>تاريخ البدء</FieldLabel>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="input-base" />
        </div>
        <div>
          <FieldLabel>تاريخ الانتهاء</FieldLabel>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="input-base" />
        </div>
        <div>
          <FieldLabel>عدد المشاركين</FieldLabel>
          <input type="number" value={numberOfParticipants} onChange={(e) => setNumberOfParticipants(e.target.value)} className="input-base" placeholder="50" />
        </div>
        <div>
          <FieldLabel>نشط</FieldLabel>
          <select value={isActive} onChange={(e) => setIsActive(e.target.value)} className="input-base">
            <option value="true" className="bg-popover">نعم</option>
            <option value="false" className="bg-popover">لا</option>
          </select>
        </div>
        <div>
          <FieldLabel>معتمد</FieldLabel>
          <select value={isApproved} onChange={(e) => setIsApproved(e.target.value)} className="input-base">
            <option value="true" className="bg-popover">نعم</option>
            <option value="false" className="bg-popover">لا</option>
          </select>
        </div>
      </div>
    </FormShell>
  )
}

// ---------------------------------------------------------------- Job posting
export function JobForm() {
  const { closeModal } = useModal()
  const { toast } = useToast()
  const [jobTitle, setJobTitle] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [image, setImage] = useState('')
  const [about, setAbout] = useState('')
  const [isActive, setIsActive] = useState('true')
  const [isApproved, setIsApproved] = useState('false')

  const save = () => {
    // TODO: BACKEND — publish the job posting to the careers board.
    toast.success(`تم نشر الوظيفة: ${jobTitle}`)
    closeModal()
  }

  return (
    <FormShell onSave={save} saveLabel="نشر الوظيفة" saveClass="bg-success text-white" disabled={!jobTitle.trim()}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <FieldLabel>المسمى الوظيفي</FieldLabel>
          <input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} className="input-base" placeholder="مثال: مطلوب محرر فيديو" />
        </div>
        <div className="md:col-span-2">
          <FieldLabel>اسم الشركة</FieldLabel>
          <input value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="input-base" placeholder="شركة الإبداع" />
        </div>
        <div className="md:col-span-2">
          <FieldLabel>صورة الوظيفة (URL)</FieldLabel>
          <input type="url" dir="ltr" value={image} onChange={(e) => setImage(e.target.value)} className="input-base text-left" placeholder="https://example.com/image.jpg" />
        </div>
        <div className="md:col-span-2">
          <FieldLabel>عن الوظيفة</FieldLabel>
          <textarea value={about} onChange={(e) => setAbout(e.target.value)} className="input-base h-24 resize-none" placeholder="وصف الوظيفة" />
        </div>
        <div>
          <FieldLabel>نشط</FieldLabel>
          <select value={isActive} onChange={(e) => setIsActive(e.target.value)} className="input-base">
            <option value="true" className="bg-popover">نعم</option>
            <option value="false" className="bg-popover">لا</option>
          </select>
        </div>
        <div>
          <FieldLabel>معتمد</FieldLabel>
          <select value={isApproved} onChange={(e) => setIsApproved(e.target.value)} className="input-base">
            <option value="true" className="bg-popover">نعم</option>
            <option value="false" className="bg-popover">لا</option>
          </select>
        </div>
      </div>
    </FormShell>
  )
}

// ---------------------------------------------------------------- Promo code
export function PromoCodeForm() {
  const { closeModal } = useModal()
  const { toast } = useToast()
  const [code, setCode] = useState('')
  const [percent, setPercent] = useState('')
  const [expiry, setExpiry] = useState('')

  const save = () => {
    // TODO: BACKEND — register the discount code with its validity window.
    toast.success(`تم تفعيل كود الخصم: ${code.toUpperCase()}`)
    closeModal()
  }

  return (
    <FormShell onSave={save} saveLabel="تفعيل الكود" disabled={!code.trim() || !percent}>
      <div>
        <FieldLabel>كود الخصم</FieldLabel>
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          className="input-base text-center font-bold uppercase tracking-widest"
          placeholder="VIP2026"
        />
      </div>
      <div>
        <FieldLabel>نسبة الخصم</FieldLabel>
        <div className="flex items-center overflow-hidden rounded-xl border border-border bg-white/5 focus-within:border-primary">
          <span className="bg-secondary px-4 py-3 font-bold text-muted-foreground">%</span>
          <input
            type="number"
            min={1}
            max={100}
            value={percent}
            onChange={(e) => setPercent(e.target.value)}
            className="w-full bg-transparent px-3 py-3 text-foreground outline-none"
            placeholder="مثال: 20"
          />
        </div>
      </div>
      <div>
        <FieldLabel>صالح حتى تاريخ</FieldLabel>
        <input type="date" value={expiry} onChange={(e) => setExpiry(e.target.value)} className="input-base" />
      </div>
    </FormShell>
  )
}
