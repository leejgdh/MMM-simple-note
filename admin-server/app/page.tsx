'use client'

import { useState, useEffect } from 'react'
import { Note, CreateNoteData, UpdateNoteData } from '@/lib/types'
import NoteForm from '@/components/NoteForm'
import NotesList from '@/components/NotesList'
import Toast from '@/components/Toast'

interface ToastState {
  message: string
  type: 'success' | 'error' | 'info'
  show: boolean
}

export default function HomePage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [toast, setToast] = useState<ToastState>({ message: '', type: 'info', show: false })

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type, show: true })
  }

  const hideToast = () => {
    setToast(prev => ({ ...prev, show: false }))
  }

  // Fetch all notes
  const fetchNotes = async () => {
    try {
      const response = await fetch('/api/notes')
      if (!response.ok) throw new Error('Failed to fetch notes')

      const data = await response.json()
      setNotes(data)
    } catch (error) {
      console.error('Error fetching notes:', error)
      showToast('노트를 불러오는 중 오류가 발생했습니다.', 'error')
    }
  }

  // Create or update note
  const handleSubmit = async (data: CreateNoteData | UpdateNoteData) => {
    setIsLoading(true)
    try {
      const isEditing = !!editingNote
      const url = isEditing ? `/api/notes/${editingNote.id}` : '/api/notes'
      const method = isEditing ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save note')
      }

      showToast(
        isEditing ? '노트가 성공적으로 수정되었습니다!' : '노트가 성공적으로 추가되었습니다!',
        'success'
      )

      setEditingNote(null)
      await fetchNotes()
    } catch (error) {
      console.error('Error saving note:', error)
      showToast(
        error instanceof Error ? error.message : '노트 저장 중 오류가 발생했습니다.',
        'error'
      )
    } finally {
      setIsLoading(false)
    }
  }

  // Delete note
  const handleDelete = async (id: number) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete note')
      }

      showToast('노트가 성공적으로 삭제되었습니다!', 'success')
      await fetchNotes()
    } catch (error) {
      console.error('Error deleting note:', error)
      showToast(
        error instanceof Error ? error.message : '노트 삭제 중 오류가 발생했습니다.',
        'error'
      )
    } finally {
      setIsLoading(false)
    }
  }

  // Edit note
  const handleEdit = (note: Note) => {
    setEditingNote(note)
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Cancel edit
  const handleCancelEdit = () => {
    setEditingNote(null)
  }

  // Load notes on component mount
  useEffect(() => {
    fetchNotes()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          📝 Simple Note Admin Panel
        </h1>
        <p className="text-gray-600 text-lg">
          MagicMirror용 노트를 쉽게 관리하세요
        </p>
      </header>

      <div className="space-y-8">
        <NoteForm
          editingNote={editingNote}
          onSubmit={handleSubmit}
          onCancel={handleCancelEdit}
          isLoading={isLoading}
        />

        <NotesList
          notes={notes}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isLoading={isLoading}
        />
      </div>

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </div>
  )
}