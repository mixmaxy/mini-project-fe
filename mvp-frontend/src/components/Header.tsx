"use client";

import Link from "next/link";
import { useUser, useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  Home,
  User,
  CreditCard,
  LogOut,
  Settings,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Header() {
  const { user, isSignedIn } = useUser();
  const { signOut } = useClerk();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Main Navigation */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <CalendarDays className="size-6" />
              <span className="text-lg font-semibold">EventHub</span>
            </Link>

            <nav className="hidden md:flex items-center gap-4">
              <Link
                href="/"
                className="text-sm font-medium hover:underline underline-offset-4"
              >
                <Home className="size-4 mr-1 inline" />
                Home
              </Link>
              <Link
                href="/"
                className="text-sm font-medium hover:underline underline-offset-4"
              >
                Browse Events
              </Link>
              {isSignedIn && (
                <>
                  <Link
                    href="/dashboard"
                    className="text-sm font-medium hover:underline underline-offset-4"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/transactions"
                    className="text-sm font-medium hover:underline underline-offset-4"
                  >
                    <CreditCard className="size-4 mr-1 inline" />
                    Transactions
                  </Link>
                </>
              )}
            </nav>
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            {isSignedIn ? (
              <>
                {/* User Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full"
                    >
                      <Avatar className="h-8 w-8 cursor-pointer">
                        <AvatarImage
                          src={user?.imageUrl}
                          alt={user?.firstName || "User"}
                        />
                        <AvatarFallback>
                          {user?.firstName?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {user?.emailAddresses[0]?.emailAddress}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer">
                        <User className="mr-2 size-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="cursor-pointer">
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/transactions" className="cursor-pointer">
                        <CreditCard className="mr-2 size-4" />
                        Transactions
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/role-switch" className="cursor-pointer">
                        <Settings className="mr-2 size-4" />
                        Switch Role
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer text-red-600"
                      onClick={handleSignOut}
                    >
                      <LogOut className="mr-2 size-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Button asChild variant="ghost" size="sm">
                  <Link href="/sign-in">Sign In</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/sign-up">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
