"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Star, Calendar, ArrowLeft, Send, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Event } from "@/types";
import { toast } from "sonner";

export default function ReviewPage() {
  const params = useParams();
  const eventId = params.id as string;
  const { user, isLoaded } = useUser();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    title: "",
    comment: "",
    categories: {
      overall: 0,
      organization: 0,
      venue: 0,
      value: 0,
    },
  });

  const fetchEvent = useCallback(async () => {
    try {
      setLoading(true);
      // Simulate API call - in real app, this would be a real API call
      const mockEvent: Event = {
        id: eventId,
        name: "Tech Conference 2024",
        description: "Join us for the biggest tech conference of the year!",
        category: "Technology",
        location: "Jakarta Convention Center",
        date: "2024-12-15",
        time: "09:00",
        availableSeats: 500,
        bookedSeats: 150,
        price: 500000,
        isFree: false,
        status: "PUBLISHED",
        organizerId: "1",
        organizer: {
          id: "1",
          firstName: "Tech",
          lastName: "Events Inc",
        },
        averageRating: 4.5,
        totalBookings: 25,
        imageUrl: "/api/placeholder/400/300",
        createdAt: "2024-01-15",
        updatedAt: "2024-01-20",
      };

      setEvent(mockEvent);
    } catch (error) {
      console.error("Error fetching event:", error);
      toast.error("Failed to load event");
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    if (isLoaded && user && eventId) {
      fetchEvent();
    }
  }, [isLoaded, user, eventId, fetchEvent]);

  const handleRatingChange = (category: string, rating: number) => {
    if (category === "overall") {
      setReviewForm((prev) => ({ ...prev, rating }));
    } else {
      setReviewForm((prev) => ({
        ...prev,
        categories: {
          ...prev.categories,
          [category]: rating,
        },
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (reviewForm.rating === 0) {
      toast.error("Please provide an overall rating");
      return;
    }

    if (!reviewForm.title.trim()) {
      toast.error("Please provide a review title");
      return;
    }

    if (!reviewForm.comment.trim()) {
      toast.error("Please provide a review comment");
      return;
    }

    try {
      setSubmitting(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setShowSuccessDialog(true);
      toast.success("Review submitted successfully!");
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(price);
  };

  const renderStars = (
    rating: number,
    onRatingChange: (rating: number) => void
  ) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(star)}
            className={`p-1 transition-colors ${
              star <= rating ? "text-yellow-500" : "text-gray-300"
            } hover:text-yellow-500`}
          >
            <Star className="size-5 fill-current" />
          </button>
        ))}
      </div>
    );
  };

  if (!isLoaded) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64 lg:col-span-2" />
          <Skeleton className="h-64" />
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
            You need to be signed in to leave a review.
          </p>
          <Button asChild>
            <Link href="/sign-in">Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-64 lg:col-span-2" />
            <Skeleton className="h-64" />
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Event not found</h1>
          <p className="text-muted-foreground mb-6">
            The event you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <Button asChild>
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href={`/events/${eventId}`}>
            <ArrowLeft className="size-4 mr-2" />
            Back to Event
          </Link>
        </Button>
        <h1 className="text-3xl font-bold mt-4">Write a Review</h1>
        <p className="text-muted-foreground mt-2">
          Share your experience and help others discover great events.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Event Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="size-5" />
              Event Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Event Name</Label>
              <p className="font-medium">{event.name}</p>
            </div>

            <div>
              <Label className="text-sm font-medium">Date & Time</Label>
              <p className="text-sm">
                {formatDate(event.date)} at {event.time}
              </p>
            </div>

            <div>
              <Label className="text-sm font-medium">Location</Label>
              <p className="text-sm">{event.location}</p>
            </div>

            <div>
              <Label className="text-sm font-medium">Organizer</Label>
              <p className="text-sm">
                {event.organizer
                  ? `${event.organizer.firstName} ${event.organizer.lastName}`
                  : "Unknown Organizer"}
              </p>
            </div>

            <div>
              <Label className="text-sm font-medium">Price</Label>
              <p className="text-sm font-medium">
                {event.isFree ? "FREE" : formatPrice(event.price)}
              </p>
            </div>

            <div>
              <Label className="text-sm font-medium">Current Rating</Label>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`size-4 ${
                        star <= (event.averageRating || 0)
                          ? "text-yellow-500 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {(event.averageRating || 0).toFixed(1)} (
                  {event.totalBookings || 0} reviews)
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Review Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Your Review</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Overall Rating */}
                <div>
                  <Label className="text-base font-medium">
                    Overall Rating *
                  </Label>
                  <div className="mt-2">
                    {renderStars(reviewForm.rating, (rating) =>
                      handleRatingChange("overall", rating)
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Click on the stars to rate your overall experience
                  </p>
                </div>

                {/* Review Title */}
                <div>
                  <Label htmlFor="title">Review Title *</Label>
                  <Input
                    id="title"
                    value={reviewForm.title}
                    onChange={(e) =>
                      setReviewForm((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    placeholder="Summarize your experience in a few words"
                    required
                  />
                </div>

                {/* Review Comment */}
                <div>
                  <Label htmlFor="comment">Review Comment *</Label>
                  <Textarea
                    id="comment"
                    value={reviewForm.comment}
                    onChange={(e) =>
                      setReviewForm((prev) => ({
                        ...prev,
                        comment: e.target.value,
                      }))
                    }
                    placeholder="Share your detailed experience, what you liked, what could be improved..."
                    rows={6}
                    required
                  />
                </div>

                {/* Category Ratings */}
                <div>
                  <Label className="text-base font-medium">
                    Category Ratings
                  </Label>
                  <p className="text-sm text-muted-foreground mb-4">
                    Rate specific aspects of the event (optional)
                  </p>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">
                        Organization
                      </Label>
                      <div className="mt-1">
                        {renderStars(
                          reviewForm.categories.organization,
                          (rating) => handleRatingChange("organization", rating)
                        )}
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Venue</Label>
                      <div className="mt-1">
                        {renderStars(reviewForm.categories.venue, (rating) =>
                          handleRatingChange("venue", rating)
                        )}
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">
                        Value for Money
                      </Label>
                      <div className="mt-1">
                        {renderStars(reviewForm.categories.value, (rating) =>
                          handleRatingChange("value", rating)
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end gap-4 pt-4">
                  <Button type="button" variant="outline" asChild>
                    <Link href={`/events/${eventId}`}>Cancel</Link>
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Skeleton className="size-4 mr-2" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="size-4 mr-2" />
                        Submit Review
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="size-5 text-green-600" />
              Review Submitted Successfully!
            </DialogTitle>
            <DialogDescription>
              Thank you for sharing your experience. Your review will help other
              users discover great events.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button asChild>
              <Link href={`/events/${eventId}`}>Back to Event</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
