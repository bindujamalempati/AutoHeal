"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { onSnapshot, collection, getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDXjfJmXg5yPUygkTbDPcoXm6EhNcWNyQ",
  authDomain: "k8s-autopilot-6lf2f.firebaseapp.com",
  projectId: "k8s-autopilot-6lf2f",
  storageBucket: "k8s-autopilot-6lf2f.appspot.com",
  messagingSenderId: "829279917467",
  appId: "1:829279917467:web:d60f39f56cc85e34ed7d3e",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function Dashboard() {
  const [dark, setDark] = useState(false);
  const [metrics, setMetrics] = useState([]);
  const [logs, setLogs] = useState([]);
  const [showForecast, setShowForecast] = useState(true);
  const [refreshTime, setRefreshTime] = useState(Date.now());

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "metrics_data"), (snap) => {
      const data = [];
      snap.forEach((doc) => data.push(doc.data()));
      setMetrics(
        data
          .sort((a, b) => a.timestamp - b.timestamp)
          .slice(-10) // last 10 points
      );
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "logs"), (snap) => {
      const data = [];
      snap.forEach((doc) => data.push(doc.data()));
      setLogs(data.sort((a, b) => b.timestamp - a.timestamp));
    });
    return () => unsub();
  }, []);

  return (
    <div className={`min-h-screen p-6 ${dark ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">AutoHeal – Monitor. React. Recover.</h1>
        <button
          onClick={() => setDark(!dark)}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Toggle Dark Mode
        </button>
      </div>

      <div className="text-right text-sm text-gray-500 italic mb-2">
        Last manual refresh: {new Date(refreshTime).toLocaleTimeString()}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-green-200 p-4 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-1">🟢 Service Status
          </h2>
          <p>All systems stable</p>
        </div>

        <div className="bg-blue-200 p-4 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-1">📊 Resource Usage</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={metrics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="cpu" stroke="#3b82f6" name="CPU Usage" />
              <Line type="monotone" dataKey="memory" stroke="#22c55e" name="Memory Usage" />
              {showForecast && (
                <Line
                  type="monotone"
                  dataKey="forecast"
                  stroke="#f97316"
                  strokeDasharray="5 5"
                  name="Forecast"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showForecast}
                onChange={() => setShowForecast(!showForecast)}
              />
              <span>Show forecast line</span>
            </label>
          </div>
        </div>

        <div className="bg-yellow-200 p-4 rounded-xl shadow col-span-1">
          <h2 className="text-xl font-bold mb-1">🔔 Alerts</h2>
          <p>All systems stable</p>
        </div>

        <div className="bg-purple-100 p-4 rounded-xl shadow col-span-1">
          <h2 className="text-xl font-bold mb-1">📋 Recovery Logs</h2>
          <ul className="text-sm mt-2 space-y-1">
            {logs.length === 0 && <p>No recovery actions taken yet.</p>}
            {logs.map((log, i) => (
              <li key={i}>
                🛠 [{new Date(log.timestamp).toLocaleTimeString()}] {log.action}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 text-xs text-gray-600 italic">
        🛈 Friendly UI — no technical knowledge required. Logs are updated in real time.
      </div>
    </div>
  );
}
