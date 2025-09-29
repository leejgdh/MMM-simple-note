'use client'

import { useState } from 'react'
import { Note, CreateNoteData, UpdateNoteData } from '@/lib/types'
import { Plus, Edit3 } from 'lucide-react'

interface NoteFormProps {
  editingNote?: Note | null
  onSubmit: (data: CreateNoteData | UpdateNoteData) => Promise<void>
  onCancel?: () => void
  isLoading?: boolean
}

export default function NoteForm({ editingNote, onSubmit, onCancel, isLoading }: NoteFormProps) {
  const [title, setTitle] = useState(editingNote?.title || '')
  const [content, setContent] = useState(editingNote?.content || '')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim()) {
      alert('내용을 입력해주세요.')
      return
    }

    await onSubmit({
      title: title.trim() || undefined,
      content: content.trim()
    })

    if (!editingNote) {
      setTitle('')
      setContent('')
    }
  }

  const isEditing = !!editingNote

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex items-center gap-2 mb-6">
        {isEditing ? (
          <>
            <Edit3 className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-bold text-gray-800">노트 수정</h2>
          </>
        ) : (
          <>
            <Plus className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-bold text-gray-800">새 노트 추가</h2>
          </>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            제목 (선택사항)
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="노트 제목을 입력하세요"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-gray-900 bg-white"
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            내용 *
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="노트 내용을 입력하세요"
            rows={6}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-vertical text-gray-900 bg-white"
            disabled={isLoading}
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '저장 중...' : isEditing ? '노트 수정' : '노트 추가'}
          </button>

          {isEditing && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              취소
            </button>
          )}
        </div>
      </form>
    </div>
  )
}