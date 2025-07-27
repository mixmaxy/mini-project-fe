"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  CalendarDays,
  Users,
  DollarSign,
  TrendingUp,
  Ticket,
  Star,
  Plus,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { dashboardAPI, eventAPI } from "@/lib/api";
import { DashboardStats, Event } from "@/types";
import { toast } from "sonner";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (isLoaded && user) {
      fetchDashboardData();
    }
  }, [isLoaded, user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // For now, we'll simulate different dashboards based on user role
      // In a real app, you'd get the role from your backend
      const isOrganizer = user?.publicMetadata?.role === "ORGANIZER";

      if (isOrganizer) {
        const [statsData, eventsData] = await Promise.all([
          dashboardAPI.getOrganizerStats(),
          eventAPI.getOrganizerEvents(),
        ]);
        setStats(statsData);
        setEvents(eventsData.events || []);
      } else {
        const statsData = await dashboardAPI.getCustomerStats();
        setStats(statsData);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (!isLoaded) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in</h1>
          <p className="text-muted-foreground mb-6">
            You need to be signed in to access the dashboard.
          </p>
          <Button asChild>
            <Link href="/sign-in">Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  const isOrganizer = user?.publicMetadata?.role === "ORGANIZER";

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user.firstName}!
          </p>
        </div>
        <div className="flex gap-2">
          {isOrganizer && (
            <Button asChild>
              <Link href="/events/create">
                <Plus className="size-4 mr-2" />
                Create Event
              </Link>
            </Button>
          )}
          <Button variant="outline" asChild>
            <Link href="/profile">
              <Settings className="size-4 mr-2" />
              Profile
            </Link>
          </Button>
        </div>
      </div>

      {/* Role Badge */}
      <div className="mb-6">
        <Badge variant={isOrganizer ? "default" : "secondary"}>
          {isOrganizer ? "Event Organizer" : "Customer"}
        </Badge>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          {isOrganizer && <TabsTrigger value="events">My Events</TabsTrigger>}
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {isOrganizer ? "Total Events" : "Events Attended"}
                    </CardTitle>
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {stats?.summary?.totalEvents || 0}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {isOrganizer ? "Total Revenue" : "Total Spent"}
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatPrice(
                        stats?.summary?.totalRevenue ||
                          stats?.summary?.totalSpent ||
                          0
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {isOrganizer ? "Tickets Sold" : "Points Balance"}
                    </CardTitle>
                    <Ticket className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {isOrganizer
                        ? stats?.summary?.totalTicketsSold || 0
                        : stats?.summary?.pointsBalance || 0}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {isOrganizer ? "Total Attendees" : "Referral Count"}
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {isOrganizer
                        ? stats?.summary?.totalAttendees || 0
                        : stats?.summary?.referralCount || 0}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts */}
              {stats?.charts && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {stats.charts.revenueByPeriod && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Revenue Trend</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={stats.charts.revenueByPeriod}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Line
                              type="monotone"
                              dataKey="revenue"
                              stroke="#8884d8"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  )}

                  {stats.charts.eventStatusDistribution && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Event Status Distribution</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={stats.charts.eventStatusDistribution}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }) =>
                                `${name} ${(percent * 100).toFixed(0)}%`
                              }
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="count"
                            >
                              {stats.charts.eventStatusDistribution.map(
                                (entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                  />
                                )
                              )}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </>
          )}
        </TabsContent>

        {/* Events Tab (Organizer Only) */}
        {isOrganizer && (
          <TabsContent value="events" className="space-y-6">
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-24" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {events.length > 0 ? (
                  events.map((event) => (
                    <Card key={event.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle>{event.name}</CardTitle>
                          <Badge
                            variant={
                              event.status === "PUBLISHED"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {event.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Date:</span>
                            <p>{formatDate(event.date)}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Location:
                            </span>
                            <p>{event.location}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Bookings:
                            </span>
                            <p>
                              {event.bookedSeats}/{event.availableSeats}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button size="sm" asChild>
                            <Link href={`/events/${event.id}`}>View</Link>
                          </Button>
                          <Button size="sm" variant="outline" asChild>
                            <Link href={`/events/${event.id}/edit`}>Edit</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <CalendarDays className="size-12 text-muted-foreground/50 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      No events yet
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Create your first event to get started.
                    </p>
                    <Button asChild>
                      <Link href="/events/create">
                        <Plus className="size-4 mr-2" />
                        Create Event
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        )}

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-6">
          <div className="text-center py-8">
            <DollarSign className="size-12 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Transaction History</h3>
            <p className="text-muted-foreground">
              Your transaction history will appear here.
            </p>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="text-center py-8">
            <TrendingUp className="size-12 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Analytics</h3>
            <p className="text-muted-foreground">
              Detailed analytics and insights will appear here.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
