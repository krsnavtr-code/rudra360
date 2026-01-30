import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  FaSearch,
  FaEdit,
  FaTrash,
  FaTags,
  FaFilter,
  FaChevronLeft,
  FaChevronRight,
  FaPlus,
  FaTimes,
  FaHashtag,
} from "react-icons/fa";
import {
  getMediaTags,
  createMediaTag,
  updateMediaTag,
  deleteMediaTag,
} from "../../api/mediaTagApi";
import { motion, AnimatePresence } from "framer-motion";

const MediaTags = () => {
  // --- State ---
  const [tags, setTags] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTag, setEditingTag] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isActive: true,
  });

  // Pagination
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  // --- Animations ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

const fetchTags = async () => {
  try {
    setLoading(true);
    const params = {
      page: currentPage,
      limit: itemsPerPage,
      search: searchTerm,
    };

    const response = await getMediaTags(params);

    // If we have a total count but no tags, try to fetch all tags without pagination
    if (
      response?.total > 0 &&
      (!response.data?.tags || response.data.tags.length === 0)
    ) {
      const allResponse = await getMediaTags({
        ...params,
        limit: 1000,
        page: 1,
      });

      const allTags = allResponse?.data?.tags || allResponse?.data || [];
      setTags(Array.isArray(allTags) ? allTags : []);
      setTotalCount(allResponse?.total || allTags.length || 0);
    } else {
      // Normal case
      const tagsData = response?.data?.tags || response?.data || [];
      setTags(Array.isArray(tagsData) ? tagsData : []);
      setTotalCount(response?.total || tagsData.length || 0);
    }
  } catch (error) {
    console.error("Error fetching tags:", error);
    toast.error(error.message || "Failed to fetch tags");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchTags();
  }, [currentPage, itemsPerPage, searchTerm]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return toast.error("Tag name is required");

    try {
      if (editingTag) {
        await updateMediaTag(editingTag._id, formData);
        toast.success("Tag updated");
      } else {
        await createMediaTag(formData);
        toast.success("Tag created");
      }
      setShowModal(false);
      fetchTags();
      resetForm();
    } catch (error) {
      toast.error(error.message || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this tag permanently?")) {
      try {
        await deleteMediaTag(id);
        toast.success("Tag deleted");
        fetchTags();
      } catch (error) {
        toast.error("Delete failed");
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: "", description: "", isActive: true });
    setEditingTag(null);
  };

  const openEditModal = (tag) => {
    setEditingTag(tag);
    setFormData({
      name: tag.name,
      description: tag.description || "",
      isActive: tag.isActive,
    });
    setShowModal(true);
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  // --- Theme Classes ---
  const inputClass =
    "w-full px-4 py-3 bg-[#05081a] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#F47C26] focus:ring-1 focus:ring-[#F47C26] transition-all placeholder-gray-500";
  const labelClass =
    "block text-xs font-bold text-black uppercase tracking-wider mb-2";

  return (
    <div className="min-h-screen text-black p-6 relative overflow-hidden font-sans">
      {/* Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#F47C26]/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-black text-black flex items-center gap-3">
              Media <span className="text-[#F47C26]">Tags</span>
            </h1>
            <p className="text-black text-sm mt-1 ml-1">
              Organize assets with smart tagging
            </p>
          </div>

          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-[#F47C26] text-white rounded-xl text-sm font-bold shadow-lg shadow-orange-500/20 hover:bg-[#d5671f] hover:-translate-y-0.5 transition-all"
          >
            <FaPlus /> New Tag
          </button>
        </div>

        {/* Toolbar */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-2xl mb-8 flex flex-col md:flex-row gap-4 justify-between items-center shadow-lg">
          {/* Search */}
          <div className="relative w-full md:w-96">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 bg-black/20 border border-white/10 rounded-xl text-sm text-black focus:outline-none focus:border-[#F47C26] transition-colors"
            />
          </div>

          {/* Items Per Page */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-black font-medium flex items-center gap-2">
              <FaFilter className="text-[#F47C26]" /> Show:
            </span>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="bg-black/20 border border-white/10 text-black text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#F47C26] cursor-pointer"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>

        {/* Tags List */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-xl">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F47C26]"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-black uppercase tracking-wider">
                      Tag Name
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-black uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-black uppercase tracking-wider">
                      Usage
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-black uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-black uppercase tracking-wider text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <AnimatePresence>
                    {tags.length > 0 ? (
                      tags.map((tag) => (
                        <motion.tr
                          key={tag._id}
                          variants={itemVariants}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          className="group hover:bg-white/5 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-[#F47C26]/10 text-[#F47C26]">
                                <FaHashtag />
                              </div>
                              <span className="font-bold text-black group-hover:text-[#F47C26] transition-colors">
                                {tag.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-black truncate max-w-xs block">
                              {tag.description || "-"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                              {tag.mediaCount || 0} Assets
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {tag.isActive ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-500/10 text-green-400 border border-green-500/20">
                                Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-500/10 text-black border border-gray-500/20">
                                Inactive
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => openEditModal(tag)}
                                className="p-2 rounded-lg  text-black transition-colors"
                                title="Edit"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => handleDelete(tag._id)}
                                className="p-2 rounded-lg  text-black  transition-colors"
                                title="Delete"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="5"
                          className="px-6 py-12 text-center text-gray-500"
                        >
                          <FaTags className="mx-auto text-4xl mb-3 opacity-20" />
                          <p>No tags found. Create one to get started.</p>
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 bg-black/20 border-t border-white/10 flex items-center justify-between">
              <span className="text-sm text-black">
                Page <span className="text-white font-bold">{currentPage}</span>{" "}
                of <span className="text-white font-bold">{totalPages}</span>
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <FaChevronLeft />
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <FaChevronRight />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-[#0a0f2d] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                <h3 className="text-lg font-bold text-white">
                  {editingTag ? "Edit Tag" : "Create New Tag"}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-black hover:text-white transition-colors"
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <label className={labelClass}>
                    Tag Name <span className="text-[#F47C26]">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Hero Banners"
                    className={inputClass}
                    autoFocus
                  />
                </div>

                <div>
                  <label className={labelClass}>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Optional description..."
                    className={inputClass}
                  />
                </div>

                <label className="flex items-center cursor-pointer gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="relative">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div
                      className={`block w-10 h-6 rounded-full transition-colors ${
                        formData.isActive ? "bg-green-500" : "bg-gray-600"
                      }`}
                    ></div>
                    <div
                      className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                        formData.isActive ? "translate-x-4" : ""
                      }`}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-white">
                    Active Status
                  </span>
                </label>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-bold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 rounded-xl bg-[#F47C26] hover:bg-[#d5671f] text-white font-bold shadow-lg shadow-orange-500/20 transition-all"
                  >
                    {editingTag ? "Update Tag" : "Create Tag"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MediaTags;
