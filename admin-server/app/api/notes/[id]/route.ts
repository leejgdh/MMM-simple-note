import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { UpdateNoteData } from '@/lib/types'

// GET /api/notes/[id] - Get a specific note
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const noteId = parseInt(params.id)

    if (isNaN(noteId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid note ID' },
        { status: 400 }
      )
    }

    const note = await prisma.note.findUnique({
      where: { id: noteId }
    })

    if (!note) {
      return NextResponse.json(
        { success: false, error: 'Note not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(note)
  } catch (error) {
    console.error('Error fetching note:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch note' },
      { status: 500 }
    )
  }
}

// PUT /api/notes/[id] - Update a specific note
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const noteId = parseInt(params.id)

    if (isNaN(noteId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid note ID' },
        { status: 400 }
      )
    }

    const body = await request.json() as UpdateNoteData

    if (body.content !== undefined && body.content.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Content cannot be empty' },
        { status: 400 }
      )
    }

    const note = await prisma.note.update({
      where: { id: noteId },
      data: {
        ...(body.title !== undefined && { title: body.title || null }),
        ...(body.content !== undefined && { content: body.content.trim() })
      }
    })

    return NextResponse.json(note)
  } catch (error: any) {
    console.error('Error updating note:', error)

    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: 'Note not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update note' },
      { status: 500 }
    )
  }
}

// DELETE /api/notes/[id] - Delete a specific note
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const noteId = parseInt(params.id)

    if (isNaN(noteId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid note ID' },
        { status: 400 }
      )
    }

    await prisma.note.delete({
      where: { id: noteId }
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting note:', error)

    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: 'Note not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Failed to delete note' },
      { status: 500 }
    )
  }
}