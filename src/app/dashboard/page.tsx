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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button>New Task</Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.title}
                className="flex items-center justify-between border-b pb-4 last:border-0"
              >
                <div>
                  <h3 className="font-medium">{activity.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {activity.description}
                  </p>
                </div>
                <span className="text-sm text-muted-foreground">
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 