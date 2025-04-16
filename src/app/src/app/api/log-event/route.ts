import { NextRequest, NextResponse } from 'next/server'
import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    })
  })
}

const db = getFirestore()

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { system, status, cpu, memory, message, timestamp } = body

    if (!system || !status || !timestamp) {
      return NextResponse.json({ message: 'Missing fields' }, { status: 400 })
    }

    await db.collection('logs').add({
      system,
      status,
      cpu: cpu || null,
      memory: memory || null,
      message: message || '',
      timestamp: new Date(timestamp)
    })

    return NextResponse.json({ message: 'Log saved successfully' }, { status: 200 })
  } catch (err) {
    console.error('POST error:', err)
    return NextResponse.json({ message: 'Error saving log' }, { status: 500 })
  }
}
