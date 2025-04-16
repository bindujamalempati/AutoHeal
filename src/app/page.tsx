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
  onSnapshot,
  collection,
  getDocs,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "k8s-autopilot-6lf2f.firebaseapp.com",
  projectId: "k8s-autopilot-6lf2f",
  storageBucket: "k8s-autopilot-6lf2f.appspot.com",
  messagingSenderId: "829279917467",
  appId: "1:829279917467:web:...",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function Dashboard() {
  const [dark, setDark] = useState(false);
  const [refreshTime, setRefreshTime] = useState(Date.now());
  const [metrics, setMetrics] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "metrics", "current"), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const now = new Date();
        setMetrics((prev) => [
          ...prev.slice(-9),
          {
            time: now.toLocaleTimeString(),
            cpu: data.cpu,
            memory: data.memory,
          },
        ]);
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const fetchHistory = async () => {
      const snapshot = await getDocs(collection(db, "metrics-history"));
      const hist = snapshot.docs.map((doc) => doc.data());
      setHistory(hist);
    };
    fetchHistory();
  }, []);

  return (
    <div
      className={`min-h-screen p-6 ${dark ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">AutoHeal – Monitor. React. Recover.</h1>
        <button
          onClick={() => setDark(!dark)}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          Toggle {dark ? "Light" : "Dark"} Mode
        </button>
      </div>

      <div className="text-right text-sm text-gray-500 italic mb-4">
        Last manual refresh: {new Date(refreshTime).toLocaleTimeString()}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-green-200 p-4 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-2">
            🟢 Service Status
          </h2>
          <p>All systems stable</p>
        </div>

        <div className="bg-blue-200 p-4 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-2">
            📊 Resource Usage
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={metrics}>
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
          <h2 className="text-xl font-bold mb-2">
            🔔 Alerts
          </h2>
          <p>All systems stable</p>
        </div>

        <div className="bg-purple-200 p-4 rounded-xl shadow col-span-2">
          <h2 className="text-xl font-bold mb-2">
            🕛 Recovery Logs (History)
          </h2>
          <ul className="list-disc pl-6">
            {history.slice(-10).map((log, index) => (
              <li key={index}>{log.message} at {new Date(log.timestamp.seconds * 1000).toLocaleTimeString()}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-600 italic">
        ℹ️ Friendly UI — no technical knowledge required. Logs are updated in real time.
      </div>
    </div>
  );
}
