export interface Note {
  id: number
  title?: string | null
  content: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateNoteData {
  title?: string
  content: string
}

export interface UpdateNoteData {
  title?: string
  content?: string
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}

export interface NotesResponse extends ApiResponse {
  data?: Note[]
}

export interface NoteResponse extends ApiResponse {
  data?: Note
}