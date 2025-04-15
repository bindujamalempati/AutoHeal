"use client";

import { useEffect, useState } from 'react';
import { initializeApp } from "firebase/app";
import {
  getFirestore, doc, getDoc
} from "firebase/firestore";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from 'recharts';

// 🔐 Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyD...your_key...",
  authDomain: "k8s-autopilot-6lf2f.firebaseapp.com",
  projectId: "k8s-autopilot-6lf2f",
  storageBucket: "k8s-autopilot-6lf2f.appspot.com",
  messagingSenderId: "829279917467",
  appId: "1:829279917467:web:xxxxxxx"
};

// ✅ Init Firebase once
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function Dashboard() {
  const [dark, setDark] = useState(false);
  const [startTime] = useState(Date.now());
  const [uptime, setUptime] = useState('');
  const [refreshTime, setRefreshTime] = useState(Date.now());

  const [metrics, setMetrics] = useState({
    cpu: 0,
    memory: 0,
    healthScore: 0,
    alert: "Loading..."
  });

  const fetchMetrics = async () => {
    const docRef = doc(db, "metrics", "current");
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      setMetrics(snapshot.data());
    }
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(() => {
      fetchMetrics();
    }, 5000); // every 5 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const diff = Date.now() - startTime;
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setUptime(`${h}h ${m}m ${s}s`);
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  const handleManualRefresh = () => {
    setRefreshTime(Date.now());
    fetchMetrics();
    alert('🔁 Manual Health Scan Triggered!');
  };

  const chartData = [
    {
      name: new Date().toLocaleTimeString(),
      cpu: metrics.cpu,
      memory: metrics.memory
    }
  ];

  return (
    <div className={`min-h-screen p-6 ${dark ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">AutoHeal – Monitor. React. Recover.</h1>
        <button onClick={() => setDark(!dark)} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
          Toggle {dark ? 'Light' : 'Dark'} Mode
        </button>
      </div>

      <div className="text-right text-sm text-gray-500 italic mb-2">
        Last manual refresh: {new Date(refreshTime).toLocaleTimeString()}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-200 p-4 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-1">🟢 Service Status</h2>
          <p>{metrics.alert}</p>
        </div>

        <div className="bg-blue-200 p-4 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-1">📊 Resource Usage</h2>
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="cpu" stroke="#3b82f6" name="CPU (%)" />
              <Line type="monotone" dataKey="memory" stroke="#22c55e" name="Memory (%)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-yellow-200 p-4 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-1">🔔 Alerts</h2>
          <p>{metrics.alert}</p>
        </div>

        <div className="bg-purple-200 p-4 rounded-xl shadow col-span-1 md:col-span-2">
          <h2 className="text-xl font-bold mb-1">🛠️ Pod Health</h2>
          <p>Placeholder for pod/container metrics and status.</p>
        </div>

        <div className="bg-pink-200 p-4 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-1">🌐 Cluster Info</h2>
          <p>Region: us-central1<br />Version: 1.27.2-gke.200</p>
        </div>

        <div className="bg-indigo-200 p-4 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-1">🧠 Daily Health Score</h2>
          <p>System Health: <strong>{metrics.healthScore}%</strong> ✅</p>
        </div>

        <div className="bg-gray-200 p-4 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-1">⏱️ Uptime Tracker</h2>
          <p>Stable for: {uptime}</p>
        </div>

        <div className="bg-orange-200 p-4 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-1">🔁 Manual Health Scan</h2>
          <button
            onClick={handleManualRefresh}
            className="mt-2 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
          >
            Run Scan
          </button>
        </div>
      </div>

      <div className="mt-6 text-xs text-gray-600 italic">
        🛈 Metrics update every 5 seconds from your local system. Friendly for all users — no technical knowledge required!
      </div>
    </div>
  );
}
