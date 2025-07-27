"use client";

import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function TestAuthPage() {
  const { user, isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Authentication Test</h1>

          {isSignedIn ? (
            <div className="space-y-4">
              <div className="bg-green-100 p-4 rounded-lg">
                <h2 className="text-lg font-semibold text-green-800">
                  ✅ Signed In
                </h2>
                <p className="text-green-700">
                  Welcome, {user?.firstName} {user?.lastName}!
                </p>
                <p className="text-sm text-green-600 mt-2">
                  Email: {user?.emailAddresses[0]?.emailAddress}
                </p>
              </div>

              <div className="space-y-2">
                <Button asChild className="w-full">
                  <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/profile">Go to Profile</Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-yellow-100 p-4 rounded-lg">
                <h2 className="text-lg font-semibold text-yellow-800">
                  ⚠️ Not Signed In
                </h2>
                <p className="text-yellow-700">
                  You need to sign in to access the platform.
                </p>
              </div>

              <div className="space-y-2">
                <Button asChild className="w-full">
                  <Link href="/sign-in">Sign In</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/sign-up">Sign Up</Link>
                </Button>
              </div>
            </div>
          )}

          <div className="mt-8 pt-4 border-t">
            <h3 className="text-sm font-semibold mb-2">Debug Info:</h3>
            <div className="text-xs text-gray-600 space-y-1">
              <p>isLoaded: {isLoaded.toString()}</p>
              <p>isSignedIn: {isSignedIn.toString()}</p>
              <p>User ID: {user?.id || "None"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
