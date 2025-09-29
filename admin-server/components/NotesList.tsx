'use client'

import { Note } from '@/lib/types'
import { Edit3, Trash2, Calendar, Clock } from 'lucide-react'

interface NotesListProps {
  notes: Note[]
  onEdit: (note: Note) => void
  onDelete: (id: number) => void
  isLoading?: boolean
}

export default function NotesList({ notes, onEdit, onDelete, isLoading }: NotesListProps) {
  const formatDate = (date: Date | string) => {
    const d = new Date(date)
    return d.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleDelete = (id: number, title?: string | null) => {
    const noteTitle = title || '제목 없음'
    if (confirm(`정말로 "${noteTitle}" 노트를 삭제하시겠습니까?`)) {
      onDelete(id)
    }
  }

  if (notes.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="text-gray-400 text-lg mb-2">📝</div>
        <h3 className="text-lg font-medium text-gray-600 mb-2">노트가 없습니다</h3>
        <p className="text-gray-500">새 노트를 추가해보세요!</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        📋 저장된 노트 목록
        <span className="text-sm font-normal text-gray-500">({notes.length}개)</span>
      </h2>

      <div className="space-y-4">
        {notes.map((note) => (
          <div
            key={note.id}
            className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow group"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                {note.title && (
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">
                    {note.title}
                  </h3>
                )}
                <p className="text-gray-600 whitespace-pre-wrap line-clamp-3 leading-relaxed">
                  {note.content}
                </p>
              </div>

              <div className="flex gap-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onEdit(note)}
                  disabled={isLoading}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                  title="수정"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(note.id, note.title)}
                  disabled={isLoading}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                  title="삭제"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(note.createdAt)}</span>
              </div>
              {note.updatedAt !== note.createdAt && (
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>수정: {formatDate(note.updatedAt)}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}