import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, company, subject, message } = body

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create contact entry
    const docRef = await adminDb.collection('contacts').add({
      name,
      email,
      phone: phone || null,
      company: company || null,
      subject,
      message,
      source: 'website',
      createdAt: new Date()
    })

    return NextResponse.json(
      { message: 'Contact form submitted successfully', id: docRef.id },
      { status: 201 }
    )
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}