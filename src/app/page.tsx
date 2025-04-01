import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="text-2xl font-bold">Real Estate Terminal</div>
          <nav className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Register</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="container px-4 py-24 text-center">
          <h1 className="mb-6 text-4xl font-bold md:text-6xl">
            Streamline Your Real Estate Business
          </h1>
          <p className="mb-8 text-xl text-muted-foreground">
            Manage tasks, schedules, and client communication all in one place. Designed specifically for real estate professionals.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/register">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#features">Learn More</Link>
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="container px-4 py-24">
          <h2 className="mb-12 text-center text-3xl font-bold">Core Features</h2>
          <p className="mb-12 text-center text-xl text-muted-foreground">
            Everything you need to manage your real estate business efficiently
          </p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="p-6">
                <h3 className="mb-2 text-xl font-bold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="container px-4 py-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="text-center md:text-left">
              <p className="text-sm text-muted-foreground">
                © 2025 Real Estate Terminal. All rights reserved.
              </p>
            </div>
            <nav className="flex gap-4">
              <Link href="/terms" className="text-sm text-muted-foreground hover:underline">
                Terms
              </Link>
              <Link href="/privacy" className="text-sm text-muted-foreground hover:underline">
                Privacy
              </Link>
              <Link href="/contact" className="text-sm text-muted-foreground hover:underline">
                Contact
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    title: "Task Management",
    description: "Manage client requests, approvals, and task assignments in one place.",
  },
  {
    title: "Scheduling",
    description: "Manage your calendar, book appointments, and send confirmations.",
  },
  {
    title: "Document Management",
    description: "Generate forms, upload documents, and manage contracts.",
  },
  {
    title: "Expense Tracking",
    description: "Track expenses and mileage for better financial management.",
  },
  {
    title: "Client Management",
    description: "Maintain client profiles and set follow-up reminders.",
  },
  {
    title: "Team Collaboration",
    description: "Work together with your team and assign tasks efficiently.",
  },
];
