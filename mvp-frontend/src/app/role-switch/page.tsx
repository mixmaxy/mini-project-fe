"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRole } from "@/contexts/RoleContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Header from "@/components/Header";
import {
  Users,
  Calendar,
  ArrowRight,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface RoleOption {
  id: "CUSTOMER" | "ORGANIZER";
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  color: string;
}

const roleOptions: RoleOption[] = [
  {
    id: "CUSTOMER",
    title: "Customer",
    description: "Browse and book events",
    icon: <Users className="size-8" />,
    features: [
      "Browse all available events",
      "Book tickets and make payments",
      "Write reviews and ratings",
      "Earn points and rewards",
      "Track transaction history",
      "Manage personal profile",
    ],
    color: "bg-blue-50 border-blue-200",
  },
  {
    id: "ORGANIZER",
    title: "Event Organizer",
    description: "Create and manage events",
    icon: <Calendar className="size-8" />,
    features: [
      "Create and publish events",
      "Manage event details and tickets",
      "View sales and analytics",
      "Handle bookings and attendees",
      "Create promotions and discounts",
      "Access organizer dashboard",
    ],
    color: "bg-purple-50 border-purple-200",
  },
];

export default function RoleSwitchPage() {
  const { user, isLoaded } = useUser();
  const { userRole, setUserRole } = useRole();
  const [selectedRole, setSelectedRole] = useState<"CUSTOMER" | "ORGANIZER">(
    userRole
  );
  const [loading, setLoading] = useState(false);

  const handleRoleSwitch = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update role in context
      setUserRole(selectedRole);

      toast.success(`Successfully switched to ${selectedRole} role!`);

      // Redirect to dashboard after role switch
      window.location.href = "/dashboard";
    } catch {
      toast.error("Failed to switch role. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            <Skeleton className="h-8 w-48" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton className="h-64" />
              <Skeleton className="h-64" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Please sign in</h1>
            <p className="text-muted-foreground mb-6">
              You need to be signed in to manage your account role.
            </p>
            <Button asChild>
              <Link href="/sign-in">Sign In</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Choose Your Account Type</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Select the type of account that best fits your needs. You can change
            this later in your profile settings.
          </p>
        </div>

        {/* Role Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {roleOptions.map((role) => (
            <Card
              key={role.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedRole === role.id
                  ? "ring-2 ring-primary border-primary"
                  : ""
              } ${role.color}`}
              onClick={() => setSelectedRole(role.id)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white/50">
                      {role.icon}
                    </div>
                    <div>
                      <CardTitle className="text-xl">{role.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {role.description}
                      </p>
                    </div>
                  </div>
                  {selectedRole === role.id && (
                    <CheckCircle className="size-6 text-green-600" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">What you can do:</h4>
                  <ul className="space-y-2">
                    {role.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 text-sm"
                      >
                        <div className="size-1.5 rounded-full bg-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <Button variant="outline" asChild>
            <Link href="/profile">Back to Profile</Link>
          </Button>
          <Button
            onClick={handleRoleSwitch}
            disabled={loading}
            className="min-w-[200px]"
          >
            {loading ? (
              "Switching Role..."
            ) : (
              <>
                Switch to{" "}
                {selectedRole === "CUSTOMER" ? "Customer" : "Organizer"}
                <ArrowRight className="size-4 ml-2" />
              </>
            )}
          </Button>
        </div>

        {/* Info Alert */}
        <div className="max-w-2xl mx-auto mt-8">
          <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <AlertCircle className="size-5 text-blue-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-blue-900 mb-1">
                Role Switching Information
              </p>
              <p className="text-blue-700">
                You can change your account type at any time from your profile
                settings. This will affect the features available to you and how
                you interact with the platform.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
