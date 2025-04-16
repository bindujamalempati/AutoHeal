'use client'
import { useEffect, useState } from 'react'
import { db } from '@/utils/firebaseClient'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'

export default function RealtimeLogPage() {
  const [logs, setLogs] = useState<any[]>([])

  useEffect(() => {
    const q = query(collection(db, 'logs'), orderBy('timestamp', 'desc'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newLogs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setLogs(newLogs)
    })
    return () => unsubscribe()
  }, [])

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">📡 Real-Time System Logs</h1>
      <div className="grid gap-4">
        {logs.map(log => (
          <div key={log.id} className="rounded-xl shadow p-4 border">
            <div><strong>System:</strong> {log.system}</div>
            <div><strong>Status:</strong> {log.status}</div>
            <div><strong>Message:</strong> {log.message}</div>
            <div><strong>CPU:</strong> {log.cpu ?? 'N/A'}%</div>
            <div><strong>Memory:</strong> {log.memory ?? 'N/A'}%</div>
            <div><strong>Time:</strong> {new Date(log.timestamp?.seconds * 1000).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </main>
  )
}
