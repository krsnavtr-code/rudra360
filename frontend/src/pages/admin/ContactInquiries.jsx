// frontend/src/pages/admin/ContactInquiries.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import toast from "react-hot-toast";
import { getContactInquiries, updateInquiryStatus, deleteInquiry } from "../../api/adminApi";
import {
  Mail,
  Phone,
  Building,
  Calendar,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  User,
  ChevronLeft,
  ChevronRight,
  Download,
  RefreshCw,
  MessageSquare,
  Star,
} from "lucide-react";

const ContactInquiries = () => {
  const { darkMode } = useTheme();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [eventTypeFilter, setEventTypeFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const eventTypes = [
    { value: "", label: "All Types" },
    { value: "corporate-awards", label: "Corporate Awards" },
    { value: "gala-dinner", label: "Gala Dinner" },
    { value: "product-launch", label: "Product Launch" },
    { value: "conference", label: "Conference" },
    { value: "wedding", label: "Wedding" },
    { value: "other", label: "Other" },
  ];

  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "pending", label: "Pending" },
    { value: "contacted", label: "Contacted" },
    { value: "in-progress", label: "In Progress" },
    { value: "converted", label: "Converted" },
    { value: "closed", label: "Closed" },
  ];

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    contacted: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    "in-progress": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    converted: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    closed: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
  };

  const priorityColors = {
    low: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
    medium: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
    high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  };

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        search: searchTerm,
        status: statusFilter,
        eventType: eventTypeFilter,
      };

      const response = await getContactInquiries(params);
      setInquiries(response.inquiries);
      setStats(response.stats);
      setTotalPages(response.pagination.pages);
    } catch (error) {
      toast.error("Failed to fetch inquiries");
      console.error("Error fetching inquiries:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, [currentPage, searchTerm, statusFilter, eventTypeFilter]);

  const handleStatusUpdate = async (inquiryId, newStatus) => {
    try {
      await updateInquiryStatus(inquiryId, { status: newStatus });
      toast.success("Status updated successfully");
      fetchInquiries();
    } catch (error) {
      toast.error("Failed to update status");
      console.error("Error updating status:", error);
    }
  };

  const handleDeleteInquiry = async (inquiryId) => {
    try {
      await deleteInquiry(inquiryId);
      toast.success("Inquiry deleted successfully");
      setShowDeleteConfirm(null);
      fetchInquiries();
    } catch (error) {
      toast.error("Failed to delete inquiry");
      console.error("Error deleting inquiry:", error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDaysAgo = (dateString) => {
    const days = Math.ceil((new Date() - new Date(dateString)) / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    return `${days} days ago`;
  };

  const exportToCSV = () => {
    const csvContent = [
      ["Name", "Email", "Phone", "Company", "Event Type", "Status", "Priority", "Date", "Message"],
      ...inquiries.map(inquiry => [
        inquiry.name,
        inquiry.email,
        inquiry.phone || "",
        inquiry.company || "",
        inquiry.eventType,
        inquiry.status,
        inquiry.priority,
        formatDate(inquiry.createdAt),
        inquiry.message || "",
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `inquiries_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                Contact Inquiries
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Manage and track all customer inquiries
              </p>
            </div>
            <div className="flex gap-3 mt-4 md:mt-0">
              <button
                onClick={fetchInquiries}
                className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2"
              >
                <RefreshCw size={18} />
                Refresh
              </button>
              <button
                onClick={exportToCSV}
                className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors flex items-center gap-2"
              >
                <Download size={18} />
                Export CSV
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Total</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total || 0}</p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Mail className="text-blue-600 dark:text-blue-400" size={20} />
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">This Month</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.thisMonth || 0}</p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                  <Calendar className="text-green-600 dark:text-green-400" size={20} />
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Pending</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.byStatus?.pending || 0}</p>
                </div>
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                  <Clock className="text-yellow-600 dark:text-yellow-400" size={20} />
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Converted</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.byStatus?.converted || 0}</p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                  <CheckCircle className="text-green-600 dark:text-green-400" size={20} />
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Search inquiries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <select
                value={eventTypeFilter}
                onChange={(e) => setEventTypeFilter(e.target.value)}
                className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                {eventTypes.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("");
                  setEventTypeFilter("");
                }}
                className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors flex items-center gap-2"
              >
                <Filter size={18} />
                Clear Filters
              </button>
            </div>
          </div>
        </motion.div>

        {/* Inquiries Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden"
        >
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
            </div>
          ) : inquiries.length === 0 ? (
            <div className="text-center py-12">
              <Mail className="mx-auto text-slate-400 mb-4" size={48} />
              <p className="text-slate-600 dark:text-slate-400">No inquiries found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Event
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {inquiries.map((inquiry) => (
                    <motion.tr
                      key={inquiry._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-slate-900 dark:text-white">
                            {inquiry.name}
                          </div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">
                            {inquiry.email}
                          </div>
                          {inquiry.company && (
                            <div className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
                              <Building size={12} />
                              {inquiry.company}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-900 dark:text-white capitalize">
                          {inquiry.eventType?.replace("-", " ")}
                        </div>
                        {inquiry.eventDate && (
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            {new Date(inquiry.eventDate).toLocaleDateString()}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={inquiry.status}
                          onChange={(e) => handleStatusUpdate(inquiry._id, e.target.value)}
                          className={`text-xs px-2 py-1 rounded-full font-medium border-0 cursor-pointer ${statusColors[inquiry.status]}`}
                        >
                          {statusOptions.slice(1).map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${priorityColors[inquiry.priority]}`}>
                          {inquiry.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-900 dark:text-white">
                          {getDaysAgo(inquiry.createdAt)}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {formatDate(inquiry.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedInquiry(inquiry);
                              setShowDetails(true);
                            }}
                            className="text-amber-600 hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-300"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(inquiry._id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-between mt-6"
          >
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="px-3 py-1 text-sm">
                {currentPage}
              </span>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </motion.div>
        )}

        {/* Inquiry Details Modal */}
        {showDetails && selectedInquiry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white dark:bg-slate-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Inquiry Details
                  </h2>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    <XCircle size={24} />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Customer Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                      Customer Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-slate-600 dark:text-slate-400">Name</label>
                        <p className="font-medium text-slate-900 dark:text-white">{selectedInquiry.name}</p>
                      </div>
                      <div>
                        <label className="text-sm text-slate-600 dark:text-slate-400">Email</label>
                        <p className="font-medium text-slate-900 dark:text-white">{selectedInquiry.email}</p>
                      </div>
                      {selectedInquiry.phone && (
                        <div>
                          <label className="text-sm text-slate-600 dark:text-slate-400">Phone</label>
                          <p className="font-medium text-slate-900 dark:text-white">{selectedInquiry.phone}</p>
                        </div>
                      )}
                      {selectedInquiry.company && (
                        <div>
                          <label className="text-sm text-slate-600 dark:text-slate-400">Company</label>
                          <p className="font-medium text-slate-900 dark:text-white">{selectedInquiry.company}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Event Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                      Event Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-slate-600 dark:text-slate-400">Event Type</label>
                        <p className="font-medium text-slate-900 dark:text-white capitalize">
                          {selectedInquiry.eventType?.replace("-", " ")}
                        </p>
                      </div>
                      {selectedInquiry.eventDate && (
                        <div>
                          <label className="text-sm text-slate-600 dark:text-slate-400">Event Date</label>
                          <p className="font-medium text-slate-900 dark:text-white">
                            {new Date(selectedInquiry.eventDate).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                      <div>
                        <label className="text-sm text-slate-600 dark:text-slate-400">Status</label>
                        <select
                          value={selectedInquiry.status}
                          onChange={(e) => {
                            handleStatusUpdate(selectedInquiry._id, e.target.value);
                            setSelectedInquiry({ ...selectedInquiry, status: e.target.value });
                          }}
                          className={`mt-1 text-xs px-2 py-1 rounded-full font-medium border-0 cursor-pointer ${statusColors[selectedInquiry.status]}`}
                        >
                          {statusOptions.slice(1).map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-sm text-slate-600 dark:text-slate-400">Priority</label>
                        <span className={`inline-block mt-1 text-xs px-2 py-1 rounded-full font-medium ${priorityColors[selectedInquiry.priority]}`}>
                          {selectedInquiry.priority}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  {selectedInquiry.message && (
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                        Message
                      </h3>
                      <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
                        <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                          {selectedInquiry.message}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Metadata */}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                      Additional Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <label className="text-slate-600 dark:text-slate-400">Inquiry ID</label>
                        <p className="font-mono text-slate-900 dark:text-white">{selectedInquiry._id}</p>
                      </div>
                      <div>
                        <label className="text-slate-600 dark:text-slate-400">Submitted</label>
                        <p className="text-slate-900 dark:text-white">{formatDate(selectedInquiry.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white dark:bg-slate-800 rounded-lg max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
                  <AlertCircle className="text-red-600 dark:text-red-400" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Delete Inquiry
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Are you sure you want to delete this inquiry? This action cannot be undone.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteInquiry(showDeleteConfirm)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ContactInquiries;
