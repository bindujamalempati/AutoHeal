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
import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDXjfJMxG5yPUgykTbDPcxoXm6EHceNWyQ",
  authDomain: "k8s-autopilot-6lf2f.firebaseapp.com",
  projectId: "k8s-autopilot-6lf2f",
  storageBucket: "k8s-autopilot-6lf2f.appspot.com",
  messagingSenderId: "829279917467",
  appId: "1:829279917467:web:d60f39f56cc85e34ed7d3e",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function Dashboard() {
  const [resourceData, setResourceData] = useState([]);
  const [logEntries, setLogEntries] = useState([]);
  const [dark, setDark] = useState(false);
  const [refreshTime, setRefreshTime] = useState(Date.now());

  const handleRefresh = () => {
    setRefreshTime(Date.now());
    alert("🔁 Manual Refresh Triggered");
  };

  useEffect(() => {
    const fetchMetrics = async () => {
      const snapshot = await getDocs(collection(db, "metrics", "current", "history"));
      const data = snapshot.docs.map((doc) => doc.data());
      setResourceData(data);
    };

    const fetchLogs = async () => {
      const logsRef = collection(db, "logs", "Laptop-UB-001", "entries");
      const logsQuery = query(logsRef, orderBy("timestamp", "desc"));
      const snapshot = await getDocs(logsQuery);
      const data = snapshot.docs.map((doc) => doc.data());
      setLogEntries(data);
    };

    fetchMetrics();
    fetchLogs();
  }, [refreshTime]);

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

      <div className="text-right text-sm text-gray-500 italic mb-4">
        Last manual refresh: {new Date(refreshTime).toLocaleTimeString()}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-green-200 p-4 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-1">🟢 Service Status</h2>
          <p>All systems stable</p>
        </div>

        <div className="bg-blue-200 p-4 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-1">📊 Resource Usage</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={resourceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="cpu" stroke="#3b82f6" />
              <Line type="monotone" dataKey="memory" stroke="#22c55e" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-yellow-200 p-4 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-1">🔔 Alerts</h2>
          <p>All systems stable</p>
        </div>

        <div className="bg-purple-200 p-4 rounded-xl shadow col-span-2">
          <h2 className="text-xl font-bold mb-2">📋 Recovery Logs</h2>
          <ul className="text-sm max-h-60 overflow-auto space-y-1">
            {logEntries.map((entry, idx) => (
              <li key={idx} className="border-b border-gray-300 py-1">
                <span className="font-semibold">{entry.status}</span> – {entry.message} <br />
                <span className="text-xs italic text-gray-600">
                  {new Date(entry.timestamp).toLocaleString()}
                </span>
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
