"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { DatePicker } from "@/components/ui/date-picker";
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
  CalendarDays,
  MapPin,
  DollarSign,
  Plus,
  ArrowLeft,
  Save,
  X,
  Ticket,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { Event } from "@/types";
import { toast } from "sonner";

const EVENT_CATEGORIES = [
  "Technology",
  "Music",
  "Sports",
  "Business",
  "Art & Culture",
  "Food & Culinary",
  "Health & Wellness",
  "Education",
  "Fashion",
  "Gaming",
  "Other",
];

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;
  const { user, isLoaded } = useUser();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showTicketDialog, setShowTicketDialog] = useState(false);

  const [event, setEvent] = useState<Event | null>(null);
  const [tickets, setTickets] = useState<
    Array<{
      type: string;
      price: number;
      quantity: number;
      description: string;
    }>
  >([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    location: "",
    date: new Date(),
    time: "",
    availableSeats: 0,
    isFree: true,
    price: 0,
  });

  const fetchEvent = useCallback(async () => {
    try {
      setLoading(true);
      // Simulate API call - in real app, this would be a real API call
      const mockEvent: Event = {
        id: eventId,
        organizerId: "1",
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
      setFormData({
        name: mockEvent.name,
        description: mockEvent.description,
        category: mockEvent.category,
        location: mockEvent.location,
        date: new Date(mockEvent.date),
        time: mockEvent.time,
        availableSeats: mockEvent.availableSeats,
        isFree: mockEvent.isFree,
        price: mockEvent.price,
      });
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

  const handleInputChange = (field: string, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.description ||
      !formData.category ||
      !formData.location ||
      !formData.time ||
      formData.availableSeats === 0
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setSaving(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Event updated successfully!");
      router.push(`/events/${eventId}`);
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error("Failed to update event. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Event deleted successfully!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event. Please try again.");
    } finally {
      setDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const addTicket = () => {
    setTickets((prev) => [
      ...prev,
      {
        type: "REGULAR",
        price: 0,
        quantity: 0,
        description: "",
      },
    ]);
    setShowTicketDialog(false);
  };

  const removeTicket = (index: number) => {
    setTickets((prev) => prev.filter((_, i) => i !== index));
  };

  const updateTicket = (index: number, field: string, value: unknown) => {
    setTickets((prev) =>
      prev.map((ticket, i) =>
        i === index ? { ...ticket, [field]: value } : ticket
      )
    );
  };

  if (!isLoaded) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-48 mb-6" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in</h1>
          <p className="text-muted-foreground mb-6">
            You need to be signed in to edit events.
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-64" />
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
        <div className="flex items-center justify-between mt-4">
          <div>
            <h1 className="text-3xl font-bold">Edit Event</h1>
            <p className="text-muted-foreground mt-2">
              Update your event details and settings.
            </p>
          </div>
          <div className="flex gap-2">
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <DialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="size-4 mr-2" />
                  Delete Event
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="size-5 text-destructive" />
                    Delete Event
                  </DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this event? This action
                    cannot be undone. All ticket purchases will be refunded.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={deleting}
                  >
                    {deleting ? "Deleting..." : "Delete Event"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="size-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Event Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter event name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Describe your event"
                  rows={4}
                  required
                />
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    handleInputChange("category", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {EVENT_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Event Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="size-5" />
                Event Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  placeholder="Enter event location"
                  required
                />
              </div>

              <div>
                <Label htmlFor="date">Date *</Label>
                <DatePicker
                  date={formData.date}
                  setDate={(date) => handleInputChange("date", date)}
                />
              </div>

              <div>
                <Label htmlFor="time">Time *</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => handleInputChange("time", e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="seats">Available Seats *</Label>
                <Input
                  id="seats"
                  type="number"
                  value={formData.availableSeats}
                  onChange={(e) =>
                    handleInputChange(
                      "availableSeats",
                      parseInt(e.target.value)
                    )
                  }
                  placeholder="Enter number of seats"
                  min="1"
                  required
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pricing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="size-5" />
              Pricing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="isFree"
                checked={formData.isFree}
                onCheckedChange={(checked) =>
                  handleInputChange("isFree", checked)
                }
              />
              <Label htmlFor="isFree">Free Event</Label>
            </div>

            {!formData.isFree && (
              <div>
                <Label htmlFor="price">Ticket Price (IDR)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    handleInputChange("price", parseInt(e.target.value))
                  }
                  placeholder="Enter ticket price"
                  min="0"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tickets */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Ticket className="size-5" />
                Ticket Types
              </CardTitle>
              <Dialog
                open={showTicketDialog}
                onOpenChange={setShowTicketDialog}
              >
                <DialogTrigger asChild>
                  <Button type="button" size="sm">
                    <Plus className="size-4 mr-2" />
                    Add Ticket Type
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Ticket Type</DialogTitle>
                    <DialogDescription>
                      Create a new ticket type for your event.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Ticket Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="REGULAR">Regular</SelectItem>
                          <SelectItem value="VIP">VIP</SelectItem>
                          <SelectItem value="EARLY_BIRD">Early Bird</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Price (IDR)</Label>
                      <Input type="number" placeholder="Enter price" />
                    </div>
                    <div>
                      <Label>Quantity</Label>
                      <Input type="number" placeholder="Enter quantity" />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea placeholder="Enter description" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setShowTicketDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={addTicket}>Add Ticket</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {tickets.length > 0 ? (
              <div className="space-y-4">
                {tickets.map((ticket, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 border rounded-lg"
                  >
                    <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <Label className="text-xs">Type</Label>
                        <Select
                          value={ticket.type}
                          onValueChange={(value) =>
                            updateTicket(index, "type", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="REGULAR">Regular</SelectItem>
                            <SelectItem value="VIP">VIP</SelectItem>
                            <SelectItem value="EARLY_BIRD">
                              Early Bird
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs">Price</Label>
                        <Input
                          type="number"
                          value={ticket.price}
                          onChange={(e) =>
                            updateTicket(
                              index,
                              "price",
                              parseInt(e.target.value)
                            )
                          }
                          placeholder="Price"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Quantity</Label>
                        <Input
                          type="number"
                          value={ticket.quantity}
                          onChange={(e) =>
                            updateTicket(
                              index,
                              "quantity",
                              parseInt(e.target.value)
                            )
                          }
                          placeholder="Quantity"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Description</Label>
                        <Input
                          value={ticket.description}
                          onChange={(e) =>
                            updateTicket(index, "description", e.target.value)
                          }
                          placeholder="Description"
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTicket(index)}
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Ticket className="size-12 mx-auto mb-4 opacity-50" />
                <p>No ticket types added yet.</p>
                <p className="text-sm">
                  Add ticket types to customize your event pricing.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href={`/events/${eventId}`}>Cancel</Link>
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <Skeleton className="size-4 mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="size-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
