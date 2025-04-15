import React from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";

const Dashboard = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome to K8s AutoPilot Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Example Cards */}
        <Card>
          <CardHeader>
            <CardTitle>Service Status</CardTitle>
            <CardDescription>Overview of your services</CardDescription>
          </CardHeader>
          <CardContent>
            <p>All services are running smoothly.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resource Usage</CardTitle>
            <CardDescription>CPU and Memory consumption</CardDescription>
          </CardHeader>
          <CardContent>
            <p>CPU: 30% | Memory: 50%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alerts</CardTitle>
            <CardDescription>Recent alerts from Alertmanager</CardDescription>
          </CardHeader>
          <CardContent>
            <p>No recent alerts.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
