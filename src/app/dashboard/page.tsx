import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const stats = [
  {
    title: "Active Tasks",
    value: "12",
    description: "Tasks that need your attention",
  },
  {
    title: "Upcoming Appointments",
    value: "5",
    description: "Next 7 days",
  },
  {
    title: "Pending Documents",
    value: "8",
    description: "Documents awaiting review",
  },
  {
    title: "Total Clients",
    value: "24",
    description: "Active clients in your portfolio",
  },
];

const recentActivity = [
  {
    title: "New client registration",
    description: "Sarah Johnson registered as a new client",
    time: "2 hours ago",
  },
  {
    title: "Document uploaded",
    description: "Contract for 123 Main St. was uploaded",
    time: "4 hours ago",
  },
  {
    title: "Task completed",
    description: "Property inspection completed for 456 Oak Ave",
    time: "5 hours ago",
  },
  {
    title: "Appointment scheduled",
    description: "Meeting with client scheduled for tomorrow",
    time: "1 day ago",
  },
];

export default function DashboardPage() {
  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Dashboard</h1>
      
      <div style={{ 
        padding: '20px', 
        backgroundColor: '#f8f9fa',
        border: '1px solid #dee2e6',
        borderRadius: '8px',
        marginBottom: '30px'
      }}>
        <h2 style={{ margin: '0 0 15px 0' }}>Welcome to your Dashboard</h2>
        <p>You have successfully accessed the dashboard page.</p>
      </div>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{ 
          padding: '15px', 
          backgroundColor: 'white', 
          border: '1px solid #dee2e6',
          borderRadius: '8px'
        }}>
          <h3 style={{ margin: '0 0 10px 0' }}>Clients</h3>
          <p style={{ margin: '0' }}>0 active clients</p>
        </div>
        
        <div style={{ 
          padding: '15px', 
          backgroundColor: 'white', 
          border: '1px solid #dee2e6',
          borderRadius: '8px'
        }}>
          <h3 style={{ margin: '0 0 10px 0' }}>Properties</h3>
          <p style={{ margin: '0' }}>0 listed properties</p>
        </div>
        
        <div style={{ 
          padding: '15px', 
          backgroundColor: 'white', 
          border: '1px solid #dee2e6',
          borderRadius: '8px'
        }}>
          <h3 style={{ margin: '0 0 10px 0' }}>Tasks</h3>
          <p style={{ margin: '0' }}>0 pending tasks</p>
        </div>
      </div>
      
      <div style={{ textAlign: 'center' }}>
        <a 
          href="/" 
          style={{ 
            display: 'inline-block',
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            marginRight: '10px'
          }}
        >
          Back to Home
        </a>
        
        <a 
          href="/static" 
          style={{ 
            display: 'inline-block',
            padding: '8px 16px',
            backgroundColor: '#6c757d',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px'
          }}
        >
          Static Page
        </a>
      </div>
    </div>
  );
} 