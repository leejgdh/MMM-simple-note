import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { CreateNoteData } from '@/lib/types'

// GET /api/notes - Get all notes
export async function GET() {
  try {
    const notes = await prisma.note.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(notes)
  } catch (error) {
    console.error('Error fetching notes:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch notes' },
      { status: 500 }
    )
  }
}

// POST /api/notes - Create a new note
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as CreateNoteData

    if (!body.content || body.content.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Content is required' },
        { status: 400 }
      )
    }

    const note = await prisma.note.create({
      data: {
        title: body.title || null,
        content: body.content.trim()
      }
    })

    return NextResponse.json(note, { status: 201 })
  } catch (error) {
    console.error('Error creating note:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create note' },
      { status: 500 }
    )
  }
}