'use client';

import { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from 'recharts';

const resourceData = [
  { name: '12:00', cpu: 30, memory: 50 },
  { name: '12:05', cpu: 40, memory: 55 },
  { name: '12:10', cpu: 35, memory: 53 },
  { name: '12:15', cpu: 37, memory: 52 },
];

export default function Dashboard() {
  const [dark, setDark] = useState(false);

  return (
    <div className={`min-h-screen p-6 ${dark ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">K8s AutoPilot Dashboard</h1>
        <button
          onClick={() => setDark(!dark)}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Toggle {dark ? 'Light' : 'Dark'} Mode
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Service Status Card */}
        <div className="bg-gradient-to-r from-green-200 to-green-300 p-4 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-1">🟢 Service Status</h2>
          <p>All services are running smoothly.</p>
        </div>

        {/* Resource Usage Card */}
        <div className="bg-gradient-to-r from-blue-200 to-blue-300 p-4 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-1">📊 Resource Usage</h2>
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={resourceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="cpu" stroke="#3b82f6" />
              <Line type="monotone" dataKey="memory" stroke="#22c55e" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Alerts Card */}
        <div className="bg-gradient-to-r from-yellow-200 to-yellow-300 p-4 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-1">🔔 Alerts</h2>
          <p>No recent alerts. Everything is stable!</p>
        </div>

        {/* Pod Health Placeholder */}
        <div className="bg-gradient-to-r from-purple-200 to-purple-300 p-4 rounded-xl shadow col-span-1 md:col-span-2">
          <h2 className="text-xl font-bold mb-1">🛠️ Pod Health</h2>
          <p>Placeholder for pod/container metrics and status.</p>
        </div>

        {/* Cluster Info Placeholder */}
        <div className="bg-gradient-to-r from-pink-200 to-pink-300 p-4 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-1">🌐 Cluster Info</h2>
          <p>Region: us-central1<br />Version: 1.27.2-gke.200</p>
        </div>
      </div>
    </div>
  );
}
