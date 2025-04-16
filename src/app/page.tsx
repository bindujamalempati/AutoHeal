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
import { app } from "@/utils/firebaseConfig";
import { saveAs } from "file-saver";

const db = getFirestore(app);

interface RecoveryLogEntry {
  message: string;
  timestamp: number;
}

interface MetricsData {
  cpu: number;
  memory: number;
  timestamp: number;
}

export default function Dashboard() {
  const [dark, setDark] = useState(false);
  const [refreshTime, setRefreshTime] = useState(Date.now());
  const [metricsHistory, setMetricsHistory] = useState<MetricsData[]>([]);
  const [recoveryLogs, setRecoveryLogs] = useState<RecoveryLogEntry[]>([]);

  useEffect(() => {
    const unsubMetrics = onSnapshot(collection(db, "metricsHistory"), (snapshot) => {
      const history = snapshot.docs.map((doc) => doc.data() as MetricsData);
      setMetricsHistory(history);
    });

    const unsubLogs = onSnapshot(collection(db, "recoveryLogs"), (snapshot) => {
      const logs = snapshot.docs.map((doc) => doc.data() as RecoveryLogEntry);
      setRecoveryLogs(logs);
    });

    return () => {
      unsubMetrics();
      unsubLogs();
    };
  }, []);

  const downloadLogs = () => {
    if (!recoveryLogs.length) return;

    const logText = recoveryLogs.map((log) => {
      const date = new Date(log.timestamp).toLocaleString();
      return `\u2022 ${log.message} at ${date}`;
    }).join("\n");

    const blob = new Blob([logText], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "recovery_logs.txt");
  };

  return (
    <div className={`min-h-screen p-6 ${dark ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">AutoHeal – Monitor. React. Recover.</h1>
        <button onClick={() => setDark(!dark)} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
          Toggle {dark ? "Light" : "Dark"} Mode
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
            <LineChart data={metricsHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" tickFormatter={(ts) => new Date(ts).toLocaleTimeString()} />
              <YAxis />
              <Tooltip labelFormatter={(ts) => new Date(Number(ts)).toLocaleString()} />
              <Line type="monotone" dataKey="cpu" stroke="#3b82f6" name="CPU %" />
              <Line type="monotone" dataKey="memory" stroke="#22c55e" name="Memory %" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-yellow-200 p-4 rounded-xl shadow col-span-1">
          <h2 className="text-xl font-bold mb-1">🔔 Alerts</h2>
          <p>All systems stable</p>
        </div>

        <div className="bg-purple-200 p-4 rounded-xl shadow col-span-2">
          <h2 className="text-xl font-bold mb-1">📃 Recovery Logs (History)</h2>
          <ul className="list-disc ml-5">
            {recoveryLogs.map((log, i) => (
              <li key={i}> {log.message} at {new Date(log.timestamp).toLocaleString()}</li>
            ))}
          </ul>
          <div className="text-right mt-2">
            <button
              onClick={downloadLogs}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              ⬇️ Download Logs
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 text-xs text-gray-600 italic">
        📑 Friendly UI — no technical knowledge required. Logs are updated in real time.
      </div>
    </div>
  );
}
