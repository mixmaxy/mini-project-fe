"use client";

import { useRole } from "@/contexts/RoleContext";
import { useUser } from "@clerk/nextjs";
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, AlertTriangle } from "lucide-react";
import Link from "next/link";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: ("CUSTOMER" | "ORGANIZER")[];
  fallback?: ReactNode;
}

export default function RoleGuard({
  children,
  allowedRoles,
  fallback,
}: RoleGuardProps) {
  const { userRole } = useRole();
  const { isSignedIn } = useUser();

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-yellow-600" />
              Authentication Required
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              You need to be signed in to access this page.
            </p>
            <div className="flex gap-2">
              <Button asChild>
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/sign-up">Sign Up</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!allowedRoles.includes(userRole)) {
    return (
      fallback || (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="size-5 text-red-600" />
                Access Denied
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                This page is only available for {allowedRoles.join(" or ")}{" "}
                accounts.
              </p>
              <div className="space-y-2">
                <p className="text-sm font-medium">Your current role:</p>
                <div className="flex items-center gap-2">
                  {userRole === "ORGANIZER" ? (
                    <>
                      <Calendar className="size-4 text-purple-600" />
                      <span className="text-sm">Event Organizer</span>
                    </>
                  ) : (
                    <>
                      <Users className="size-4 text-blue-600" />
                      <span className="text-sm">Customer</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button asChild>
                  <Link href="/role-switch">Switch Role</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    );
  }

  return <>{children}</>;
}
