"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  MapPin,
  Clock,
  Users,
  Star,
  Tag,
  Ticket,
  ShoppingCart,
  ArrowLeft,
  User,
  MessageSquare,
} from "lucide-react";
import { eventAPI, reviewAPI } from "@/lib/api";
import { Event, Ticket as TicketType, Review } from "@/types";
import { toast } from "sonner";

export default function EventDetailsPage() {
  const params = useParams();
  const eventId = params.id as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTickets, setSelectedTickets] = useState<
    Record<string, number>
  >({});
  const [isPurchaseDialogOpen, setIsPurchaseDialogOpen] = useState(false);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const [eventData, reviewsData] = await Promise.all([
          eventAPI.getEvent(eventId),
          reviewAPI.getEventReviews(eventId),
        ]);

        setEvent(eventData);
        setReviews(reviewsData.reviews || []);
      } catch (err) {
        console.error("Error fetching event details:", err);
        setError("Failed to load event details. Please try again.");
        toast.error("Failed to load event details");
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEventDetails();
    }
  }, [eventId]);

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

  const handleTicketQuantityChange = (ticketId: string, quantity: number) => {
    if (quantity === 0) {
      const newSelected = { ...selectedTickets };
      delete newSelected[ticketId];
      setSelectedTickets(newSelected);
    } else {
      setSelectedTickets((prev) => ({
        ...prev,
        [ticketId]: quantity,
      }));
    }
  };

  const getTotalPrice = () => {
    if (!event?.tickets) return 0;

    return event.tickets.reduce((total, ticket) => {
      const quantity = selectedTickets[ticket.id] || 0;
      return total + ticket.price * quantity;
    }, 0);
  };

  const getTotalQuantity = () => {
    return Object.values(selectedTickets).reduce(
      (total, quantity) => total + quantity,
      0
    );
  };

  const handlePurchase = async () => {
    try {
      const items = Object.entries(selectedTickets).map(
        ([ticketId, quantity]) => ({
          ticketId,
          quantity,
        })
      );

      // TODO: Implement actual purchase logic
      toast.success("Purchase successful!");
      setIsPurchaseDialogOpen(false);
      setSelectedTickets({});
    } catch (error) {
      toast.error("Purchase failed. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Skeleton className="h-8 w-32 mb-4" />
          <Skeleton className="h-12 w-3/4 mb-4" />
          <div className="flex gap-4 mb-4">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-24" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Skeleton className="w-full h-96 mb-6" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div>
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
          <p className="text-muted-foreground mb-6">
            {error || "The event you're looking for doesn't exist."}
          </p>
          <Button asChild>
            <Link href="/">
              <ArrowLeft className="size-4 mr-2" />
              Back to Events
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/">
            <ArrowLeft className="size-4 mr-2" />
            Back to Events
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Event Image */}
          <div className="relative mb-6">
            <Image
              src={event.imageUrl || "/placeholder.svg"}
              alt={event.name}
              width={800}
              height={400}
              className="w-full h-96 object-cover rounded-lg"
            />
            {event.isFree && (
              <Badge className="absolute top-4 right-4 bg-green-500">
                FREE
              </Badge>
            )}
          </div>

          {/* Event Info */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-4">{event.name}</h1>

            <div className="flex flex-wrap gap-4 mb-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CalendarDays className="size-4" />
                {formatDate(event.date)}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="size-4" />
                {event.time}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="size-4" />
                {event.location}
              </div>
              <div className="flex items-center gap-2">
                <Tag className="size-4" />
                {event.category}
              </div>
              <div className="flex items-center gap-2">
                <Users className="size-4" />
                {event.bookedSeats}/{event.availableSeats} seats
              </div>
              {event.averageRating && (
                <div className="flex items-center gap-2">
                  <Star className="size-4 fill-yellow-400 text-yellow-400" />
                  {event.averageRating.toFixed(1)}
                </div>
              )}
            </div>

            {event.organizer && (
              <div className="flex items-center gap-2 mb-4">
                <User className="size-4" />
                <span className="text-sm text-muted-foreground">
                  Organized by {event.organizer.firstName}{" "}
                  {event.organizer.lastName}
                </span>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">About This Event</h2>
            <p className="text-muted-foreground leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* Reviews */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="size-5" />
              <h2 className="text-xl font-semibold">Reviews</h2>
              <Badge variant="secondary">{reviews.length} reviews</Badge>
            </div>

            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.slice(0, 5).map((review) => (
                  <Card key={review.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`size-4 ${
                                  i < review.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm font-medium">
                            {review.user?.firstName} {review.user?.lastName}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </CardHeader>
                    {review.comment && (
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          {review.comment}
                        </p>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">
                No reviews yet. Be the first to review this event!
              </p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ticket className="size-5" />
                Get Tickets
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {event.tickets && event.tickets.length > 0 ? (
                <>
                  {event.tickets.map((ticket) => (
                    <div key={ticket.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{ticket.type}</h3>
                          <p className="text-sm text-muted-foreground">
                            {ticket.description}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">
                            {ticket.price === 0
                              ? "FREE"
                              : formatPrice(ticket.price)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {ticket.quantity - ticket.sold} available
                          </div>
                        </div>
                      </div>

                      {ticket.price > 0 && (
                        <Select
                          value={selectedTickets[ticket.id]?.toString() || "0"}
                          onValueChange={(value) =>
                            handleTicketQuantityChange(
                              ticket.id,
                              parseInt(value)
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select quantity" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from(
                              {
                                length: Math.min(
                                  10,
                                  ticket.quantity - ticket.sold
                                ),
                              },
                              (_, i) => i + 1
                            ).map((num) => (
                              <SelectItem key={num} value={num.toString()}>
                                {num}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  ))}

                  <Separator />

                  {getTotalQuantity() > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Total ({getTotalQuantity()} tickets)</span>
                        <span className="font-semibold">
                          {formatPrice(getTotalPrice())}
                        </span>
                      </div>

                      <Dialog
                        open={isPurchaseDialogOpen}
                        onOpenChange={setIsPurchaseDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <Button className="w-full" size="lg">
                            <ShoppingCart className="size-4 mr-2" />
                            Purchase Tickets
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Confirm Purchase</DialogTitle>
                            <DialogDescription>
                              Review your ticket selection before proceeding
                              with the purchase.
                            </DialogDescription>
                          </DialogHeader>

                          <div className="space-y-4">
                            {Object.entries(selectedTickets).map(
                              ([ticketId, quantity]) => {
                                const ticket = event.tickets?.find(
                                  (t) => t.id === ticketId
                                );
                                return ticket ? (
                                  <div
                                    key={ticketId}
                                    className="flex justify-between"
                                  >
                                    <span>
                                      {ticket.type} x {quantity}
                                    </span>
                                    <span>
                                      {formatPrice(ticket.price * quantity)}
                                    </span>
                                  </div>
                                ) : null;
                              }
                            )}

                            <Separator />

                            <div className="flex justify-between font-semibold">
                              <span>Total</span>
                              <span>{formatPrice(getTotalPrice())}</span>
                            </div>
                          </div>

                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => setIsPurchaseDialogOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button onClick={handlePurchase}>
                              Confirm Purchase
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <Ticket className="size-12 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No tickets available for this event.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
