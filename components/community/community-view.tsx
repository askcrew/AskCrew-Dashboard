'use client'

import { useState, useEffect } from 'react'
import { MessageSquare, Plus, Radio, ShieldAlert, FileText, HelpCircle, Check, Edit3, Trash2, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useExecMode } from '@/lib/exec-mode'
import { useModal } from '@/lib/modal'
import { ChatRoomForm } from '@/components/shared/add-entity-forms'
import { AutoTranslateMessage, LocalTimeBadge } from '@/components/shared/geo-widgets'
import { ChatWindow } from '@/components/community/chat-window'
import { QABankPanel } from '@/components/community/qa-bank'
import api from '@/lib/api'

const TABS = ['غرف المحادثة', 'رسائل الأعضاء', 'ملفات الرسائل', 'بنك الأسئلة (Q&A)']

export function CommunityView() {
  const { execMode } = useExecMode()
  const { openModal } = useModal()
  const [tab, setTab] = useState(0)
  const accent = execMode ? 'text-destructive' : 'text-primary'
  const [chatRooms, setChatRooms] = useState<any[]>([])
  const [messages, setMessages] = useState<any[]>([])
  const [messageFiles, setMessageFiles] = useState<any[]>([])
  const [questions, setQuestions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const fetchAllData = async () => {
    setLoading(true)
    try {
      const [roomsRes, messagesRes, filesRes, questionsRes] = await Promise.all([
        api.fetchChatRooms(),
        api.fetchMessages(),
        api.fetchMessageFiles(),
        api.fetchQuestions(),
      ])
      console.log('API Responses:', { roomsRes, messagesRes, filesRes, questionsRes })
      
      // Handle paginated responses (extract results array)
      setChatRooms(Array.isArray(roomsRes) ? roomsRes : ((roomsRes as any)?.results || []))
      setMessages(Array.isArray(messagesRes) ? messagesRes : ((messagesRes as any)?.results || []))
      setMessageFiles(Array.isArray(filesRes) ? filesRes : ((filesRes as any)?.results || []))
      setQuestions(Array.isArray(questionsRes) ? questionsRes : ((questionsRes as any)?.results || []))
    } catch (err) {
      console.error('Failed to fetch data:', err)
      console.error('Error details:', err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllData()
  }, [])

  const deleteChatRoom = async (id: number) => {
    try {
      await api.deleteChatRoom(id)
      await fetchAllData()
    } catch (err) {
      console.error('Failed to delete chat room:', err)
    }
  }

  const deleteMessage = async (id: number) => {
    try {
      await api.deleteMessage(id)
      await fetchAllData()
    } catch (err) {
      console.error('Failed to delete message:', err)
    }
  }

  const deleteMessageFile = async (id: number) => {
    try {
      await api.deleteMessageFile(id)
      await fetchAllData()
    } catch (err) {
      console.error('Failed to delete message file:', err)
    }
  }

  const deleteQuestion = async (id: number) => {
    try {
      await api.deleteQuestion(id)
      await fetchAllData()
    } catch (err) {
      console.error('Failed to delete question:', err)
    }
  }

  const editChatRoom = (room: any) => {
    console.log('Edit chat room:', room)
    // TODO: Implement edit modal for chat rooms
  }

  const editMessage = (message: any) => {
    console.log('Edit message:', message)
    // TODO: Implement edit modal for messages
  }

  const editMessageFile = (file: any) => {
    console.log('Edit message file:', file)
    // TODO: Implement edit modal for message files
  }

  const editQuestion = (question: any) => {
    console.log('Edit question:', question)
    // TODO: Implement edit modal for questions
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-black text-foreground">
            <MessageSquare className={cn('h-6 w-6', accent)} />
            إدارة المجتمع والدردشات
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">مراقبة الغرف، الرسائل، الملفات، وبنك الأسئلة.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchAllData}
            className="flex items-center gap-2 rounded-xl bg-secondary px-4 py-2.5 text-sm font-bold text-foreground transition hover:bg-white/15"
          >
            <RotateCcw className="h-4 w-4" />
            تحديث
          </button>
          <button
            onClick={() => openModal({ title: 'إنشاء غرفة دردشة جديدة', content: <ChatRoomForm />, size: 'sm' })}
            className="flex items-center gap-2 rounded-xl bg-success px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-success/20 transition hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            إنشاء غرفة جديدة
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatCard 
          label="غرف المحادثة النشطة" 
          value={chatRooms.length.toString()} 
          icon={Radio} 
          accent={accent} 
        />
        <StatCard 
          label="الرسائل المتبادلة" 
          value={messages.length.toString()} 
          icon={MessageSquare} 
          accent={accent} 
        />
        <StatCard 
          label="ملفات الرسائل" 
          value={messageFiles.length.toString()} 
          icon={FileText} 
          accent={accent} 
        />
      </div>

      <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-thin">
        {TABS.map((t, i) => (
          <button
            key={t}
            onClick={() => setTab(i)}
            className={cn(
              'whitespace-nowrap rounded-full px-5 py-2 text-sm font-bold transition',
              i === tab
                ? execMode
                  ? 'bg-destructive text-white'
                  : 'bg-primary text-primary-foreground'
                : 'bg-secondary text-muted-foreground hover:text-foreground',
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 0 ? (
        <div className="glass rounded-2xl border border-border p-6">
          <h3 className="mb-4 text-lg font-bold text-foreground">أحدث غرف المحادثة</h3>
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="space-y-3">
              {chatRooms.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between rounded-xl border border-border/60 bg-white/5 p-4 transition hover:border-white/20"
                >
                  <div>
                    <h4 className="font-bold text-foreground">
                      {r.participant1?.fullname || r.participant1?.email} ↔ {r.participant2?.fullname || r.participant2?.email}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      تم الإنشاء: {new Date(r.created_at).toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => editChatRoom(r)}
                      className={cn(
                        'flex items-center justify-center rounded-lg border border-border bg-white/5 p-2 text-muted-foreground transition hover:bg-white/10 hover:text-foreground shrink-0',
                      )}
                      aria-label="تعديل"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => deleteChatRoom(r.id)}
                      className="flex items-center justify-center rounded-lg border border-destructive/30 bg-destructive/10 p-2 text-destructive transition hover:bg-destructive hover:text-white shrink-0"
                      aria-label="حذف"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : tab === 1 ? (
        <div className="glass rounded-2xl border border-border p-6">
          <h3 className="mb-4 text-lg font-bold text-foreground">الرسائل</h3>
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between rounded-xl border border-border/60 bg-white/5 p-4 transition hover:border-white/20"
                >
                  <div className="flex-1">
                    <h4 className="font-bold text-foreground">{m.sender?.fullname || m.sender?.email}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{m.content}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(m.created_at).toLocaleString('ar-SA')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mr-4">
                    <button
                      onClick={() => editMessage(m)}
                      className={cn(
                        'flex items-center justify-center rounded-lg border border-border bg-white/5 p-2 text-muted-foreground transition hover:bg-white/10 hover:text-foreground shrink-0',
                      )}
                      aria-label="تعديل"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => deleteMessage(m.id)}
                      className="flex items-center justify-center rounded-lg border border-destructive/30 bg-destructive/10 p-2 text-destructive transition hover:bg-destructive hover:text-white shrink-0"
                      aria-label="حذف"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : tab === 2 ? (
        <div className="glass rounded-2xl border border-border p-6">
          <h3 className="mb-4 text-lg font-bold text-foreground">ملفات الرسائل</h3>
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="space-y-3">
              {messageFiles.map((f) => (
                <div
                  key={f.id}
                  className="flex items-center justify-between rounded-xl border border-border/60 bg-white/5 p-4 transition hover:border-white/20"
                >
                  <div>
                    <h4 className="font-bold text-foreground">{f.file_name}</h4>
                    <p className="text-xs text-muted-foreground">
                      حجم: {(f.file_size / 1024 / 1024).toFixed(2)} MB • نوع: {f.file_type}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => editMessageFile(f)}
                      className={cn(
                        'flex items-center justify-center rounded-lg border border-border bg-white/5 p-2 text-muted-foreground transition hover:bg-white/10 hover:text-foreground shrink-0',
                      )}
                      aria-label="تعديل"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => deleteMessageFile(f.id)}
                      className="flex items-center justify-center rounded-lg border border-destructive/30 bg-destructive/10 p-2 text-destructive transition hover:bg-destructive hover:text-white shrink-0"
                      aria-label="حذف"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : tab === 3 ? (
        <div className="glass rounded-2xl border border-border p-6">
          <h3 className="mb-4 text-lg font-bold text-foreground">بنك الأسئلة (Q&A)</h3>
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="space-y-3">
              {questions.map((q) => (
                <div
                  key={q.id}
                  className="flex items-center justify-between rounded-xl border border-border/60 bg-white/5 p-4 transition hover:border-white/20"
                >
                  <div className="flex-1">
                    <h4 className="font-bold text-foreground">{q.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{q.body}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      بواسطة: {q.author?.fullname || q.author?.email} • {new Date(q.created_at).toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mr-4">
                    <button
                      onClick={() => editQuestion(q)}
                      className={cn(
                        'flex items-center justify-center rounded-lg border border-border bg-white/5 p-2 text-muted-foreground transition hover:bg-white/10 hover:text-foreground shrink-0',
                      )}
                      aria-label="تعديل"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => deleteQuestion(q.id)}
                      className="flex items-center justify-center rounded-lg border border-destructive/30 bg-destructive/10 p-2 text-destructive transition hover:bg-destructive hover:text-white shrink-0"
                      aria-label="حذف"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}

    </div>
  )
}

function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  accent,
  danger,
}: {
  label: string
  value: string
  hint?: string
  icon: typeof Radio
  accent?: string
  danger?: boolean
}) {
  return (
    <div className={cn('glass rounded-2xl border p-6', danger ? 'border-destructive/30' : 'border-border')}>
      <div className="flex items-center justify-between">
        <p className={cn('mb-2 text-sm', danger ? 'text-destructive' : 'text-muted-foreground')}>{label}</p>
        <Icon className={cn('h-5 w-5', danger ? 'text-destructive' : accent)} />
      </div>
      <h3 className="text-3xl font-black text-foreground">
        {value}
        {hint && <span className="text-sm font-normal text-muted-foreground"> {hint}</span>}
      </h3>
    </div>
  )
}
