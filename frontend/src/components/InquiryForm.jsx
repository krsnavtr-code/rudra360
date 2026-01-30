// frontend/src/components/InquiryForm.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import toast from "react-hot-toast";
import { submitContactForm } from "../api/contactApi";
import {
  Send,
  MessageSquare,
  User,
  Building,
  Calendar,
  Mail,
  Phone,
} from "lucide-react";

const InquiryForm = ({ 
  showTitle = true, 
  showCompany = true, 
  showPhone = true, 
  showEventDate = true, 
  showMessage = true,
  messageRequired = false,
  buttonText = "Send Inquiry",
  buttonClassName = "",
  formClassName = "",
  onSuccess,
  compact = false
}) => {
  const { darkMode } = useTheme();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    eventType: "",
    eventDate: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await submitContactForm(formData);
      toast.success(response.message || "Your inquiry has been submitted successfully!");
      
      // Reset form after successful submission
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        eventType: "",
        eventDate: "",
        message: "",
      });

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess(response);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to submit inquiry. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const eventTypes = [
    { value: "", label: "Select Event Type" },
    { value: "corporate-awards", label: "Corporate Awards" },
    { value: "gala-dinner", label: "Gala Dinner" },
    { value: "product-launch", label: "Product Launch" },
    { value: "conference", label: "Conference" },
    { value: "wedding", label: "Wedding" },
    { value: "other", label: "Other" },
  ];

  const formPadding = compact ? "p-6" : "p-8";
  const gridCols = compact ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 ${formPadding} ${formClassName}`}
    >
      {showTitle && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">
            Get Started Today
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Fill out the form below and our event specialists will get in touch with you within 24 hours
          </p>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className={`grid ${gridCols} gap-6`}>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                placeholder="Your Name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                placeholder="your@email.com"
              />
            </div>
          </div>

          {showPhone && (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
          )}

          {showCompany && (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Company Name
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  placeholder="Your Company"
                />
              </div>
            </div>
          )}

          {showEventDate && (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Event Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="date"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Event Type *
            </label>
            <select
              name="eventType"
              value={formData.eventType}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
            >
              {eventTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {showMessage && (
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Tell us about your event {messageRequired ? "*" : "(Optional)"}
            </label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 text-slate-400" size={18} />
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required={messageRequired}
                rows={compact ? 3 : 4}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all resize-none"
                placeholder="Describe your vision, requirements, and any specific details about your event..."
              />
            </div>
          </div>
        )}

        <div className="text-center">
          <button
            type="submit"
            disabled={loading}
            className={`px-8 py-4 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto ${buttonClassName}`}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Send size={20} />
            )}
            {loading ? "Submitting..." : buttonText}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default InquiryForm;
