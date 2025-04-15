"use client";

import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const [dark, setDark] = useState(false);
  const [startTime] = useState(Date.now());
  const [uptime, setUptime] = useState("");
  const [refreshTime, setRefreshTime] = useState(Date.now());
  const [resourceData, setResourceData] = useState([
    { name: "12:00", cpu: 0, memory: 0 },
    { name: "12:05", cpu: 0, memory: 0 },
    { name: "12:10", cpu: 0, memory: 0 },
  ]);
  const [healthScore, setHealthScore] = useState(0);
  const [alertStatus, setAlertStatus] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = Date.now() - startTime;
      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setUptime(`${hours}h ${minutes}m ${seconds}s`);
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "metrics", "current"), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        const timestamp = new Date().toLocaleTimeString().slice(0, 5);
        setResourceData((prev) => [
          ...prev.slice(1),
          {
            name: timestamp,
            cpu: data.cpu,
            memory: data.memory,
          },
        ]);
        setHealthScore(data.healthScore);
        setAlertStatus(data.alert);
      }
    });

    return () => unsub();
  }, []);

  const handleManualRefresh = () => {
    setRefreshTime(Date.now());
    alert("Manual Health Scan Triggered! ✅");
  };

  return (
    <div className={`min-h-screen p-6 ${dark ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">AutoHeal – Monitor. React. Recover.</h1>
        <button
          onClick={() => setDark(!dark)}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Toggle {dark ? "Light" : "Dark"} Mode
        </button>
      </div>

      <div className="text-right text-sm text-gray-500 italic mb-2">
        Last manual refresh: {new Date(refreshTime).toLocaleTimeString()}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-200 p-4 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-1">🟢 Service Status</h2>
          <p>All systems are operational and stable.</p>
        </div>

        <div className="bg-blue-200 p-4 rounded-xl shadow">
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

        <div className="bg-yellow-200 p-4 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-1">🔔 Alerts</h2>
          <p>{alertStatus}</p>
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
          <p>System Health: <strong>{healthScore}%</strong> ✅</p>
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
        🛈 Hover over metrics or sections to learn more. Friendly for all users — no technical knowledge required!
      </div>
    </div>
  );
}
