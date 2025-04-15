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
  query,
  orderBy,
  where,
  Timestamp
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
  const [historyData, setHistoryData] = useState([]);
  const [timeRange, setTimeRange] = useState("1h");
  const [showForecast, setShowForecast] = useState(true);
  const [forecastSummary, setForecastSummary] = useState({ cpu: 0, memory: 0 });

  const getStartTime = () => {
    const now = Date.now();
    switch (timeRange) {
      case "10m": return new Date(now - 10 * 60 * 1000);
      case "1h": return new Date(now - 60 * 60 * 1000);
      case "10h": return new Date(now - 10 * 60 * 60 * 1000);
      case "24h": return new Date(now - 24 * 60 * 60 * 1000);
      default: return new Date(now - 60 * 60 * 1000);
    }
  };

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

  const fetchHistory = async () => {
    const startTime = Timestamp.fromDate(getStartTime());
    const q = query(collection(db, "metrics-history"), where("timestamp", ">=", startTime), orderBy("timestamp"));
    const snapshot = await getDocs(q);
    const history = snapshot.docs.map(doc => {
      const d = doc.data();
      return {
        name: new Date(d.timestamp).toLocaleTimeString(),
        cpu: d.cpu,
        memory: d.memory
      };
    });

    // Forecasting (simple moving average)
    const recent = history.slice(-5);
    const avgCPU = recent.reduce((sum, x) => sum + x.cpu, 0) / (recent.length || 1);
    const avgMem = recent.reduce((sum, x) => sum + x.memory, 0) / (recent.length || 1);
    const lastTime = new Date();
    const forecastPoints = [1, 2, 3].map(i => ({
      name: new Date(lastTime.getTime() + i * 5 * 1000).toLocaleTimeString(),
      forecast_cpu: Math.round(avgCPU),
      forecast_memory: Math.round(avgMem)
    }));

    setForecastSummary({ cpu: Math.round(avgCPU), memory: Math.round(avgMem) });
    const extended = showForecast ? [...history, ...forecastPoints] : history;
    setHistoryData(extended);
  };

  useEffect(() => {
    fetchMetrics();
    fetchRecoveryLogs();
    fetchHistory();
    const interval = setInterval(() => {
      fetchMetrics();
      fetchRecoveryLogs();
      fetchHistory();
    }, 5000);
    return () => clearInterval(interval);
  }, [timeRange, showForecast]);

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
    fetchHistory();
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

        <div className="bg-cyan-100 p-4 rounded-xl shadow col-span-1 md:col-span-3">
          <h2 className="text-xl font-bold mb-2">📈 Historical Performance</h2>
          <div className="flex justify-between items-center mb-2">
            <div>
              <label className="mr-2 font-semibold">Filter by:</label>
              <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} className="p-1 rounded border">
                <option value="10m">Last 10 minutes</option>
                <option value="1h">Last 1 hour</option>
                <option value="10h">Last 10 hours</option>
                <option value="24h">Last 24 hours</option>
              </select>
            </div>
            <div>
              <label className="mr-2 font-semibold">Show Forecast:</label>
              <input type="checkbox" checked={showForecast} onChange={() => setShowForecast(!showForecast)} />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={historyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="cpu" stroke="#3b82f6" />
              <Line type="monotone" dataKey="memory" stroke="#22c55e" />
              {showForecast && <Line type="monotone" dataKey="forecast_cpu" stroke="#6366f1" strokeDasharray="5 5" dot={false} />}
              {showForecast && <Line type="monotone" dataKey="forecast_memory" stroke="#16a34a" strokeDasharray="5 5" dot={false} />}
            </LineChart>
          </ResponsiveContainer>
          {showForecast && (
            <div className="text-sm text-gray-700 italic mt-2">
              Forecast (next ~15s): CPU ~ {forecastSummary.cpu}% | Memory ~ {forecastSummary.memory}%
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 text-xs text-gray-600 italic">
        🛈 Hover over metrics to learn more. Friendly for non-technical users!
      </div>
    </div>
  );
}
