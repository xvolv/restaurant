import React, { useState, useEffect } from "react";
import { Star, Send, X, CheckCircle } from "lucide-react";
import { CustomerFeedback, Reservation } from "./types/Reservation";

interface CustomerFeedbackPageProps {
  mode?: "light" | "dark";
  reservationId?: string; // Allow passing reservationId as prop for testing
}

const CustomerFeedbackPage: React.FC<CustomerFeedbackPageProps> = ({
  mode = "light",
  reservationId: propReservationId,
}) => {
  // Get reservationId from URL path or props
  const getReservationIdFromUrl = (): string | null => {
    if (propReservationId) return propReservationId;

    // Extract from URL like: /feedback/12345 or ?reservationId=12345
    const path = window.location.pathname;
    const pathMatch = path.match(/\/feedback\/([^\/]+)/);
    if (pathMatch) return pathMatch[1];

    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("reservationId");
  };

  const [reservationId] = useState<string | null>(getReservationIdFromUrl());

  // Form state
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [serviceRating, setServiceRating] = useState(0);
  const [hoveredServiceRating, setHoveredServiceRating] = useState(0);
  const [foodRating, setFoodRating] = useState(0);
  const [hoveredFoodRating, setHoveredFoodRating] = useState(0);
  const [comments, setComments] = useState("");

  // Preferences
  const [preferences, setPreferences] = useState({
    emailUpdates: false,
    specialOffers: false,
    eventNotifications: false,
    birthdayOffers: false,
    loyaltyProgram: false,
    newsletter: false,
    smsNotifications: false,
    reservationReminders: true,
  });

  // Page state
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load reservation data
  useEffect(() => {
    const loadReservation = async () => {
      try {
        if (!reservationId) {
          setError("Invalid feedback link - missing reservation ID");
          setLoading(false);
          return;
        }

        // In a real app, this would fetch from API
        // For now, simulate loading reservation data
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock reservation data - in production, fetch from API using reservationId
        const mockReservation: Reservation = {
          id: reservationId,
          customerName: "John Doe",
          customerPhone: "+1234567890",
          customerEmail: "john.doe@example.com",
          date: new Date().toISOString().split("T")[0],
          time: "19:00",
          guests: 4,
          status: "completed",
          tableNumber: 1,
          specialRequests: "",
          feedbackRequested: true,
        };

        setReservation(mockReservation);
        setLoading(false);
      } catch (err) {
        setError("Failed to load reservation details");
        setLoading(false);
      }
    };

    loadReservation();
  }, [reservationId]);

  // Star Rating Component
  const StarRating: React.FC<{
    rating: number;
    hoveredRating: number;
    onRate: (rating: number) => void;
    onHover: (rating: number) => void;
    onLeave: () => void;
    label: string;
  }> = ({ rating, hoveredRating, onRate, onHover, onLeave, label }) => (
    <div className="flex flex-col items-center space-y-2">
      {label && (
        <span
          className={`text-sm font-medium ${
            mode === "dark" ? "text-gray-300" : "text-gray-700"
          }`}
        >
          {label}
        </span>
      )}
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-8 h-8 cursor-pointer transition-colors ${
              star <= (hoveredRating || rating)
                ? "text-yellow-400 fill-current"
                : mode === "dark"
                ? "text-gray-600"
                : "text-gray-300"
            }`}
            onClick={() => onRate(star)}
            onMouseEnter={() => onHover(star)}
            onMouseLeave={onLeave}
          />
        ))}
      </div>
    </div>
  );

  // Handle form submission
  const handleSubmit = async () => {
    if (!reservation) return;

    // Convert preferences object to string array
    const selectedPreferences = Object.entries(preferences)
      .filter(([key, value]) => value)
      .map(([key]) =>
        key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())
      );

    const feedbackData: Omit<CustomerFeedback, "id" | "submittedAt"> = {
      reservationId: reservation.id,
      customerName: reservation.customerName,
      customerEmail: reservation.customerEmail,
      rating,
      serviceRating,
      foodRating,
      comments: comments.trim(),
      preferences: selectedPreferences,
      status: "submitted",
    };

    try {
      // In production, submit to API
      console.log("✅ Feedback submitted successfully:", feedbackData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSubmitted(true);
    } catch (err) {
      setError("Failed to submit feedback. Please try again.");
    }
  };

  // Handle skip
  const handleSkip = async () => {
    if (!reservation) return;

    try {
      // In production, record skip in API
      console.log("ℹ️ Feedback skipped for reservation:", reservation.id);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setSubmitted(true);
    } catch (err) {
      setError("Failed to process request. Please try again.");
    }
  };

  // Loading state
  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          mode === "dark" ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p
            className={`mt-4 ${
              mode === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Loading your feedback form...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          mode === "dark" ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="text-center">
          <X className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1
            className={`text-2xl font-bold mb-2 ${
              mode === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Oops! Something went wrong
          </h1>
          <p
            className={`${mode === "dark" ? "text-gray-300" : "text-gray-600"}`}
          >
            {error}
          </p>
        </div>
      </div>
    );
  }

  // Success state
  if (submitted) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          mode === "dark" ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="text-center max-w-md mx-auto p-8">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h1
            className={`text-3xl font-bold mb-4 ${
              mode === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Thank You!
          </h1>
          <p
            className={`text-lg mb-6 ${
              mode === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {rating > 0
              ? "We appreciate your feedback and will use it to improve our service."
              : "We understand you chose to skip the feedback. Thank you for dining with us!"}
          </p>
          <p
            className={`text-sm ${
              mode === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          >
            We look forward to serving you again soon!
          </p>
        </div>
      </div>
    );
  }

  // Main feedback form
  return (
    <div
      className={`min-h-screen ${
        mode === "dark" ? "bg-gray-900" : "bg-gray-50"
      } py-8 px-4`}
    >
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div
          className={`text-center mb-8 p-6 rounded-xl ${
            mode === "dark" ? "bg-gray-800" : "bg-white"
          } shadow-lg`}
        >
          <h1
            className={`text-3xl font-bold mb-2 ${
              mode === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            How was your experience?
          </h1>
          <p
            className={`${mode === "dark" ? "text-gray-300" : "text-gray-600"}`}
          >
            Thank you for dining with us, {reservation?.customerName}!
          </p>
          <p
            className={`text-sm mt-2 ${
              mode === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {new Date(reservation?.date || "").toLocaleDateString()} at{" "}
            {reservation?.time}
          </p>
        </div>

        {/* Feedback Form */}
        <div
          className={`p-6 rounded-xl shadow-lg ${
            mode === "dark" ? "bg-gray-800" : "bg-white"
          }`}
        >
          {/* Overall Rating */}
          <div className="text-center mb-8">
            <h3
              className={`text-xl font-semibold mb-4 ${
                mode === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Overall Experience
            </h3>
            <StarRating
              rating={rating}
              hoveredRating={hoveredRating}
              onRate={setRating}
              onHover={setHoveredRating}
              onLeave={() => setHoveredRating(0)}
              label=""
            />
          </div>

          {/* Service & Food Ratings */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            <StarRating
              rating={serviceRating}
              hoveredRating={hoveredServiceRating}
              onRate={setServiceRating}
              onHover={setHoveredServiceRating}
              onLeave={() => setHoveredServiceRating(0)}
              label="Service"
            />
            <StarRating
              rating={foodRating}
              hoveredRating={hoveredFoodRating}
              onRate={setFoodRating}
              onHover={setHoveredFoodRating}
              onLeave={() => setHoveredFoodRating(0)}
              label="Food"
            />
          </div>

          {/* Comments */}
          <div className="mb-8">
            <label
              className={`block text-sm font-medium mb-2 ${
                mode === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Additional Comments (Optional)
            </label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Tell us more about your experience..."
              rows={4}
              className={`w-full p-3 border rounded-lg resize-none ${
                mode === "dark"
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            />
          </div>

          {/* Preferences */}
          <div className="mb-8">
            <h4
              className={`text-lg font-semibold mb-4 ${
                mode === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Communication Preferences
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(preferences).map(([key, value]) => (
                <label
                  key={key}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) =>
                      setPreferences((prev) => ({
                        ...prev,
                        [key]: e.target.checked,
                      }))
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span
                    className={`text-sm ${
                      mode === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={handleSubmit}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <Send className="w-5 h-5" />
              <span>Submit Feedback</span>
            </button>
            <button
              onClick={handleSkip}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                mode === "dark"
                  ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-700"
              }`}
            >
              Skip
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p
            className={`text-sm ${
              mode === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Your feedback helps us improve our service. Thank you for your time!
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomerFeedbackPage;
