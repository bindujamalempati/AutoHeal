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
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  getDocs,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD...yourKey",
  authDomain: "k8s-autopilot-6lf2f.firebaseapp.com",
  projectId: "k8s-autopilot-6lf2f",
  storageBucket: "k8s-autopilot-6lf2f.appspot.com",
  messagingSenderId: "829279917467",
  appId: "1:829279917467:web:xxxxxxxx"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function Dashboard() {
  const [dark, setDark] = useState(false);
  const [uptime, setUptime] = useState("");
  const [refreshTime, setRefreshTime] = useState(Date.now());
  const [metrics, setMetrics] = useState({ cpu: 0, memory: 0, healthScore: 0, alert: "Loading..." });
  const [resourceData, setResourceData] = useState([]);
  const [logs, setLogs] = useState([]);

  const fetchMetrics = async () => {
    const docRef = doc(db, "metrics", "current");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      setMetrics(data);
      setResourceData(prev => [
        ...prev.slice(-10),
        { name: new Date().toLocaleTimeString(), cpu: data.cpu, memory: data.memory },
      ]);
    }
  };

  const fetchRecoveryLogs = async () => {
    const entriesRef = collection(db, "metrics/recoveryLogs/entries");
    const snapshot = await getDocs(entriesRef);
    const logsData = snapshot.docs.map(doc => doc.data()).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    setLogs(logsData);
  };

  useEffect(() => {
    fetchMetrics();
    fetchRecoveryLogs();
    const interval = setInterval(() => {
      fetchMetrics();
      fetchRecoveryLogs();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const diff = Date.now() - start;
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setUptime(`${h}h ${m}m ${s}s`);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleManualRefresh = () => {
    setRefreshTime(Date.now());
    alert("Manual Health Scan Triggered ✅");
    fetchMetrics();
    fetchRecoveryLogs();
  };

  return (
    <div className={`min-h-screen p-6 ${dark ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">AutoHeal – Monitor. React. Recover.</h1>
        <button onClick={() => setDark(!dark)} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
          Toggle {dark ? "Light" : "Dark"} Mode
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
          <p>{metrics.alert}</p>
        </div>

        <div className="bg-purple-200 p-4 rounded-xl shadow col-span-1 md:col-span-2">
          <h2 className="text-xl font-bold mb-1">🛠️ Pod Health</h2>
          <p>Coming soon: per-container breakdown.</p>
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

        <div className="bg-red-100 p-4 rounded-xl shadow col-span-1 md:col-span-3">
          <h2 className="text-xl font-bold mb-2">🧾 Recovery Log</h2>
          <div className="max-h-40 overflow-y-auto text-sm">
            {logs.length === 0 ? <p>No recovery events yet.</p> : logs.map((log, i) => (
              <div key={i} className="mb-2 border-b pb-1">
                <p><strong>{new Date(log.timestamp).toLocaleString()}</strong> — {log.issue} → {log.recovery_action} ✅</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 text-xs text-gray-600 italic">
        🛈 Hover over metrics to learn more. Friendly for non-technical users!
      </div>
    </div>
  );
}
