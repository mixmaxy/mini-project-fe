"use client";

import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  MapPin,
  CalendarDays,
  Tag,
  Star,
  Users,
  Ticket,
} from "lucide-react";
import { eventAPI } from "@/lib/api";
import { useDebounce } from "@/hooks/useDebounce";
import { Event, EventFilters } from "@/types";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 6;

export default function HomePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("All Locations");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Debounce search term
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Get unique locations and categories from events
  const uniqueLocations = useMemo(() => {
    const locations = new Set(events.map((event) => event.location));
    return Array.from(locations).sort();
  }, [events]);

  const uniqueCategories = useMemo(() => {
    const categories = new Set(events.map((event) => event.category));
    return Array.from(categories).sort();
  }, [events]);

  // Fetch events from API
  const fetchEvents = async (filters: EventFilters) => {
    try {
      setLoading(true);
      setError(null);

      const response = await eventAPI.getEvents({
        page: filters.page || 1,
        limit: ITEMS_PER_PAGE,
        search: filters.search || undefined,
        category:
          filters.category === "All Categories" ? undefined : filters.category,
        location:
          filters.location === "All Locations" ? undefined : filters.location,
        sortBy: "date",
        sortOrder: "asc",
      });

      setEvents(response.events || []);
      setTotalPages(response.pagination?.totalPages || 1);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Failed to load events. Please try again.");
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  // Fetch events when filters change
  useEffect(() => {
    const filters: EventFilters = {
      page: currentPage,
      search: debouncedSearchTerm || undefined,
      category:
        categoryFilter === "All Categories" ? undefined : categoryFilter,
      location: locationFilter === "All Locations" ? undefined : locationFilter,
    };
    fetchEvents(filters);
  }, [debouncedSearchTerm, locationFilter, categoryFilter, currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
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

  const renderEventCard = (event: Event) => (
    <Card key={event.id} className="flex flex-col overflow-hidden">
      <div className="relative">
        <Image
          src={event.imageUrl || "/placeholder.svg"}
          alt={event.name}
          width={400}
          height={250}
          className="w-full h-48 object-cover"
        />
        {event.isFree && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-md text-xs font-medium">
            FREE
          </div>
        )}
      </div>
      <CardHeader>
        <CardTitle className="line-clamp-2">{event.name}</CardTitle>
        <CardDescription className="flex items-center gap-1">
          <CalendarDays className="size-4" />
          {formatDate(event.date)} at {event.time}
        </CardDescription>
        <CardDescription className="flex items-center gap-1">
          <MapPin className="size-4" />
          {event.location}
        </CardDescription>
        <CardDescription className="flex items-center gap-1">
          <Tag className="size-4" />
          {event.category}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
          {event.description}
        </p>
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Users className="size-4" />
            {event.bookedSeats}/{event.availableSeats} seats
          </div>
          {event.averageRating && (
            <div className="flex items-center gap-1">
              <Star className="size-4 fill-yellow-400 text-yellow-400" />
              {event.averageRating.toFixed(1)}
            </div>
          )}
        </div>
        {!event.isFree && (
          <div className="text-lg font-semibold text-primary mb-2">
            {formatPrice(event.price)}
          </div>
        )}
      </CardContent>
      <div className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link href={`/events/${event.id}`}>
            <Ticket className="size-4 mr-2" />
            View Details
          </Link>
        </Button>
      </div>
    </Card>
  );

  const renderSkeleton = () => (
    <Card className="flex flex-col overflow-hidden">
      <Skeleton className="w-full h-48" />
      <CardHeader>
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-1" />
        <Skeleton className="h-4 w-2/3 mb-1" />
        <Skeleton className="h-4 w-1/3" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-4" />
        <Skeleton className="h-6 w-1/3" />
      </CardContent>
      <div className="p-4 pt-0">
        <Skeleton className="h-10 w-full" />
      </div>
    </Card>
  );

  return (
    <div className="flex flex-col min-h-dvh">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link href="/" className="flex items-center justify-center gap-2">
          <CalendarDays className="size-6" />
          <span className="text-lg font-semibold">EventHub</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            href="/"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Browse Events
          </Link>
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
            Transactions
          </Link>
          <Link
            href="/profile"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Profile
          </Link>
        </nav>
      </header>

      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <section className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Discover Exciting Events Near You
          </h1>
          <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto">
            Find and explore a wide range of events, from tech conferences to
            local festivals.
          </p>
        </section>

        <section className="bg-card p-4 rounded-lg shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
            <div className="col-span-full md:col-span-1 lg:col-span-2">
              <label htmlFor="search" className="sr-only">
                Search events
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="search"
                  type="text"
                  placeholder="Search events by title or description..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1); // Reset to first page on search
                  }}
                  className="pl-9 w-full"
                  aria-label="Search events"
                />
              </div>
            </div>
            <div>
              <label htmlFor="location-filter" className="sr-only">
                Filter by location
              </label>
              <Select
                value={locationFilter}
                onValueChange={(value) => {
                  setLocationFilter(value);
                  setCurrentPage(1); // Reset to first page on filter change
                }}
              >
                <SelectTrigger id="location-filter" className="w-full">
                  <MapPin className="size-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Filter by location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Locations">All Locations</SelectItem>
                  {uniqueLocations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="category-filter" className="sr-only">
                Filter by category
              </label>
              <Select
                value={categoryFilter}
                onValueChange={(value) => {
                  setCategoryFilter(value);
                  setCurrentPage(1); // Reset to first page on filter change
                }}
              >
                <SelectTrigger id="category-filter" className="w-full">
                  <Tag className="size-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Categories">All Categories</SelectItem>
                  {uniqueCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-destructive text-center">{error}</p>
          </div>
        )}

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            // Show skeletons while loading
            Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
              <div key={index}>{renderSkeleton()}</div>
            ))
          ) : events.length > 0 ? (
            events.map((event) => renderEventCard(event))
          ) : (
            <div className="col-span-full text-center text-muted-foreground py-12">
              <div className="flex flex-col items-center gap-4">
                <CalendarDays className="size-12 text-muted-foreground/50" />
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    No events found
                  </h3>
                  <p className="text-sm">
                    Try adjusting your search criteria or filters.
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>

        {!loading && events.length > 0 && totalPages > 1 && (
          <section className="mt-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={() => handlePageChange(currentPage - 1)}
                    aria-disabled={currentPage === 1}
                    tabIndex={currentPage === 1 ? -1 : undefined}
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : undefined
                    }
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        isActive={page === currentPage}
                        onClick={() => handlePageChange(page)}
                        aria-label={`Go to page ${page}`}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={() => handlePageChange(currentPage + 1)}
                    aria-disabled={currentPage === totalPages}
                    tabIndex={currentPage === totalPages ? -1 : undefined}
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : undefined
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </section>
        )}
      </main>
    </div>
  );
}
