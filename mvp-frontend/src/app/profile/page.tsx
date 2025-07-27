"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { useRole } from "@/contexts/RoleContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Header from "@/components/Header";

import {
  User,
  CreditCard,
  Gift,
  Copy,
  Check,
  Edit,
  Save,
  X,
  Users,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "CUSTOMER" | "ORGANIZER";
  referralCode: string;
  pointsBalance: number;
  referralCount: number;
  totalSpent: number;
  eventsAttended: number;
  createdAt: string;
}

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const { userRole, setUserRole } = useRole();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "CUSTOMER" as "CUSTOMER" | "ORGANIZER",
  });

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      // Simulate API call - in real app, this would be a real API call
      const mockProfile: UserProfile = {
        id: user?.id || "",
        email: user?.emailAddresses[0]?.emailAddress || "",
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        role: userRole, // Use role from context
        referralCode:
          "REF" + Math.random().toString(36).substr(2, 8).toUpperCase(),
        pointsBalance: 25000,
        referralCount: 3,
        totalSpent: 1500000,
        eventsAttended: 8,
        createdAt: "2024-01-15",
      };

      setProfile(mockProfile);
      setEditForm({
        firstName: mockProfile.firstName,
        lastName: mockProfile.lastName,
        email: mockProfile.email,
        role: mockProfile.role,
      });
    } catch {
      console.error("Error fetching profile");
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, [user, userRole]);

  useEffect(() => {
    if (isLoaded && user) {
      fetchProfile();
    }
  }, [isLoaded, user, fetchProfile]);

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update role in context if changed
      if (editForm.role !== userRole) {
        setUserRole(editForm.role);
      }

      setProfile((prev) =>
        prev
          ? {
              ...prev,
              firstName: editForm.firstName,
              lastName: editForm.lastName,
              email: editForm.email,
              role: editForm.role,
            }
          : null
      );

      setEditing(false);
      toast.success("Profile updated successfully!");
    } catch {
      console.error("Error updating profile");
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const copyReferralCode = async () => {
    if (profile?.referralCode) {
      try {
        await navigator.clipboard.writeText(profile.referralCode);
        setCopied(true);
        toast.success("Referral code copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
      } catch {
        toast.error("Failed to copy referral code");
      }
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
      month: "long",
      day: "numeric",
    });
  };

  if (!isLoaded) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-64" />
            <Skeleton className="h-64 md:col-span-2" />
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
            You need to be signed in to access your profile.
          </p>
          <Button asChild>
            <Link href="/sign-in">Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground mt-2">
            Manage your account and view your activity.
          </p>
        </div>

        {loading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Skeleton className="h-64" />
              <Skeleton className="h-64 md:col-span-2" />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <User className="size-5" />
                    Profile Information
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditing(!editing)}
                  >
                    <Edit className="size-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {editing ? (
                  <form onSubmit={handleEditSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={editForm.firstName}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            firstName: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={editForm.lastName}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            lastName: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={editForm.email}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="role">Account Type</Label>
                      <Select
                        value={editForm.role}
                        onValueChange={(value: "CUSTOMER" | "ORGANIZER") =>
                          setEditForm((prev) => ({
                            ...prev,
                            role: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select account type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CUSTOMER">
                            <div className="flex items-center gap-2">
                              <Users className="size-4" />
                              Customer
                            </div>
                          </SelectItem>
                          <SelectItem value="ORGANIZER">
                            <div className="flex items-center gap-2">
                              <Calendar className="size-4" />
                              Event Organizer
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground mt-1">
                        {editForm.role === "CUSTOMER"
                          ? "Browse and book events"
                          : "Create and manage events"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" size="sm" disabled={loading}>
                        <Save className="size-4 mr-2" />
                        Save
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setEditing(false)}
                      >
                        <X className="size-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm text-muted-foreground">
                        Name
                      </Label>
                      <p className="font-medium">
                        {profile?.firstName} {profile?.lastName}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">
                        Email
                      </Label>
                      <p className="font-medium">{profile?.email}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">
                        Account Type
                      </Label>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              profile?.role === "ORGANIZER"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {profile?.role === "ORGANIZER" ? (
                              <>
                                <Calendar className="size-3 mr-1" />
                                Event Organizer
                              </>
                            ) : (
                              <>
                                <Users className="size-3 mr-1" />
                                Customer
                              </>
                            )}
                          </Badge>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link href="/role-switch">Switch Role</Link>
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">
                        Role
                      </Label>
                      <Badge
                        variant={
                          profile?.role === "ORGANIZER"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {profile?.role === "ORGANIZER"
                          ? "Event Organizer"
                          : "Customer"}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">
                        Member Since
                      </Label>
                      <p className="font-medium">
                        {profile ? formatDate(profile.createdAt) : ""}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Main Content */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="overview" className="space-y-6">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="referrals">Referrals</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Points Balance
                        </CardTitle>
                        <Gift className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {profile?.pointsBalance.toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Available for redemption
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Total Spent
                        </CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold break-words overflow-hidden">
                          {profile ? formatPrice(profile.totalSpent) : "IDR 0"}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          All time purchases
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Events Attended
                        </CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {profile?.eventsAttended}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Total events
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Referrals
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {profile?.referralCount}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Successful referrals
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Referrals Tab */}
                <TabsContent value="referrals" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Gift className="size-5" />
                        Your Referral Code
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Input
                          value={profile?.referralCode}
                          readOnly
                          className="font-mono"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={copyReferralCode}
                        >
                          {copied ? (
                            <Check className="size-4" />
                          ) : (
                            <Copy className="size-4" />
                          )}
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Share this code with friends to earn points when they
                        register!
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>How Referrals Work</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs flex items-center justify-center font-bold">
                            1
                          </div>
                          <p className="text-sm">
                            Share your referral code with friends
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs flex items-center justify-center font-bold">
                            2
                          </div>
                          <p className="text-sm">
                            They register using your code
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs flex items-center justify-center font-bold">
                            3
                          </div>
                          <p className="text-sm">You both get 10,000 points!</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs flex items-center justify-center font-bold">
                            4
                          </div>
                          <p className="text-sm">
                            Use points for discounts on events
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Activity Tab */}
                <TabsContent value="activity" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                              <Gift className="size-4 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium">
                                Earned referral points
                              </p>
                              <p className="text-sm text-muted-foreground">
                                +10,000 points from referral
                              </p>
                            </div>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            2 days ago
                          </span>
                        </div>

                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                              <Calendar className="size-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium">Attended event</p>
                              <p className="text-sm text-muted-foreground">
                                Tech Conference 2024
                              </p>
                            </div>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            1 week ago
                          </span>
                        </div>

                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                              <CreditCard className="size-4 text-purple-600" />
                            </div>
                            <div>
                              <p className="font-medium">
                                Used points discount
                              </p>
                              <p className="text-sm text-muted-foreground">
                                -5,000 points on ticket purchase
                              </p>
                            </div>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            2 weeks ago
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
