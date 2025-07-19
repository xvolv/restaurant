import React, { useState } from "react";
import { Star, MessageCircle, Settings, Send, X } from "lucide-react";
import { useTheme, themes } from "../../contexts/ThemeContext";
import { CustomerFeedback } from "./types/Reservation";

interface FeedbackFormProps {
  reservationId: string;
  customerName: string;
  customerEmail: string;
  onSubmit: (feedback: Omit<CustomerFeedback, "id" | "submittedAt">) => void;
  onSkip: () => void;
  onClose: () => void;
  mode: string;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({
  reservationId,
  customerName,
  customerEmail,
  onSubmit,
  onSkip,
  onClose,
  mode,
}) => {
  const { theme } = useTheme();
  const currentTheme = themes[theme];

  const [rating, setRating] = useState(0);
  const [serviceRating, setServiceRating] = useState(0);
  const [foodRating, setFoodRating] = useState(0);
  const [comments, setComments] = useState("");
  const [preferences, setPreferences] = useState<string[]>([]);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [hoveredServiceRating, setHoveredServiceRating] = useState(0);
  const [hoveredFoodRating, setHoveredFoodRating] = useState(0);

  const preferenceOptions = [
    "Window seat",
    "Quiet area",
    "Near kitchen",
    "Vegetarian options",
    "Gluten-free options",
    "Child-friendly seating",
    "Wheelchair accessible",
    "No strong scents",
  ];

  const handlePreferenceToggle = (preference: string) => {
    setPreferences((prev) =>
      prev.includes(preference)
        ? prev.filter((p) => p !== preference)
        : [...prev, preference]
    );
  };

  const handleSubmit = () => {
    if (rating === 0) {
      alert("Please provide an overall rating before submitting.");
      return;
    }

    const feedback: Omit<CustomerFeedback, "id" | "submittedAt"> = {
      reservationId,
      customerName,
      customerEmail,
      rating,
      serviceRating: serviceRating || undefined,
      foodRating: foodRating || undefined,
      comments: comments.trim() || undefined,
      preferences: preferences.length > 0 ? preferences : undefined,
      status: "submitted",
    };

    onSubmit(feedback);
  };

  const StarRating: React.FC<{
    rating: number;
    hoveredRating: number;
    onRate: (rating: number) => void;
    onHover: (rating: number) => void;
    onLeave: () => void;
    label: string;
  }> = ({ rating, hoveredRating, onRate, onHover, onLeave, label }) => (
    <div className="flex flex-col items-center space-y-2">
      <span
        className={`text-sm font-medium ${
          mode === "dark" ? "text-gray-300" : "text-gray-700"
        }`}
      >
        {label}
      </span>
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => onRate(star)}
            onMouseEnter={() => onHover(star)}
            onMouseLeave={onLeave}
            className="transition-colors duration-200 hover:scale-110"
          >
            <Star
              className={`w-8 h-8 ${
                star <= (hoveredRating || rating)
                  ? "text-yellow-400 fill-yellow-400"
                  : mode === "dark"
                  ? "text-gray-600"
                  : "text-gray-300"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div
        className={`w-full max-w-md max-h-[90vh] overflow-y-auto ${
          mode === "dark" ? "bg-gray-800" : "bg-white"
        } rounded-2xl shadow-2xl`}
      >
        {/* Header */}
        <div
          className={`px-6 py-4 bg-gradient-to-r ${currentTheme.primary} text-white rounded-t-2xl`}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">How was your experience?</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm opacity-90 mt-1">
            Thank you for dining with us, {customerName}!
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Overall Rating */}
          <div className="text-center">
            <h3
              className={`text-lg font-semibold mb-4 ${
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
          <div className="grid grid-cols-2 gap-4">
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
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <MessageCircle
                className={`w-5 h-5 ${
                  mode === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              />
              <label
                className={`font-medium ${
                  mode === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Comments (Optional)
              </label>
            </div>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Tell us about your experience..."
              rows={3}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                mode === "dark"
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
              }`}
            />
          </div>

          {/* Preferences */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Settings
                className={`w-5 h-5 ${
                  mode === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              />
              <label
                className={`font-medium ${
                  mode === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Update Your Preferences (Optional)
              </label>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {preferenceOptions.map((preference) => (
                <button
                  key={preference}
                  onClick={() => handlePreferenceToggle(preference)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    preferences.includes(preference)
                      ? `bg-gradient-to-r ${currentTheme.secondary} text-white`
                      : mode === "dark"
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {preference}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              onClick={onSkip}
              className={`flex-1 py-3 px-4 border rounded-lg font-medium transition-colors ${
                mode === "dark"
                  ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              Skip for now
            </button>
            <button
              onClick={handleSubmit}
              className={`flex-1 py-3 px-4 bg-gradient-to-r ${currentTheme.primary} text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2`}
            >
              <Send className="w-4 h-4" />
              <span>Submit Feedback</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackForm;
