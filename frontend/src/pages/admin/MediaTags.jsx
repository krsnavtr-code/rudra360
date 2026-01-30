import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  Search,
  Plus,
  Tag,
  MoreVertical,
  Trash2,
  Edit3,
  Hash,
  ChevronLeft,
  ChevronRight,
  X,
  Filter,
} from "lucide-react";
import {
  getMediaTags,
  createMediaTag,
  updateMediaTag,
  deleteMediaTag,
} from "../../api/mediaTagApi";
import { motion, AnimatePresence } from "framer-motion";

const MediaTags = () => {
  const [tags, setTags] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTag, setEditingTag] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isActive: true,
  });

  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  const fetchTags = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
      };
      const response = await getMediaTags(params);
      const tagsData = response?.data?.tags || response?.data || [];
      setTags(Array.isArray(tagsData) ? tagsData : []);
      setTotalCount(response?.total || tagsData.length || 0);
    } catch (error) {
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
        toast.success("Categorization updated");
      } else {
        await createMediaTag(formData);
        toast.success("New tag created");
      }
      setShowModal(false);
      fetchTags();
      resetForm();
    } catch (error) {
      toast.error(error.message || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteMediaTag(id);
      toast.success("Tag removed from directory");
      fetchTags();
    } catch (error) {
      toast.error("Delete operation failed");
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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 sm:p-10 transition-colors duration-300 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.4em]">
                Asset Management
              </span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Event <span className="text-amber-500">Taxonomy</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
              Organize award functions and galleries with precision tagging.
            </p>
          </div>

          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-8 py-3.5 bg-amber-500 text-white rounded-2xl font-bold shadow-xl shadow-amber-500/20 hover:bg-amber-600 transition-all active:scale-95"
          >
            <Plus size={20} /> Create New Tag
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1 group">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors"
              size={18}
            />
            <input
              type="text"
              placeholder="Filter taxonomy..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all text-sm dark:text-slate-200 shadow-sm"
            />
          </div>

          <div className="flex items-center gap-3 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <Filter size={16} className="text-amber-500" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
              Show
            </span>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="bg-transparent text-sm font-bold text-slate-600 dark:text-slate-300 focus:outline-none cursor-pointer"
            >
              {[10, 25, 50, 100].map((val) => (
                <option key={val} value={val}>
                  {val}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden transition-all">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800">
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.1em]">
                    Label
                  </th>
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.1em]">
                    Details
                  </th>
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.1em]">
                    Impact
                  </th>
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.1em]">
                    Status
                  </th>
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.1em] text-right">
                    Control
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                <AnimatePresence mode="popLayout">
                  {tags.map((tag) => (
                    <motion.tr
                      layout
                      key={tag._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                            <Hash size={18} />
                          </div>
                          <span className="font-bold text-slate-900 dark:text-slate-100">
                            {tag.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1 italic">
                          {tag.description || "No description provided."}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-[10px] font-black uppercase">
                          {tag.mediaCount || 0} Associated Assets
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div
                          className={`w-2.5 h-2.5 rounded-full ${tag.isActive ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700"}`}
                        />
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openEditModal(tag)}
                            className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-500/10 rounded-lg transition-all"
                          >
                            <Edit3 size={18} />
                          </button>
                          <PopconfirmDelete
                            onConfirm={() => handleDelete(tag._id)}
                          />
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-8 py-6 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Page <span className="text-amber-500">{currentPage}</span> of{" "}
                {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-30 hover:bg-white dark:hover:bg-slate-800 transition-all text-slate-600 dark:text-slate-400"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-30 hover:bg-white dark:hover:bg-slate-800 transition-all text-slate-600 dark:text-slate-400"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modern Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden p-8"
            >
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                    {editingTag ? "Update" : "Define"}{" "}
                    <span className="text-amber-500 text-stroke-sm">Tag</span>
                  </h3>
                  <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">
                    Taxonomy Definition
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">
                    Tag Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Award Ceremonies"
                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">
                    Strategic Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    placeholder="Describe the category purpose..."
                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all font-semibold resize-none"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <span className="text-sm font-bold text-slate-600 dark:text-slate-300">
                    Active Status
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                  </label>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 py-4 bg-amber-500 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/20"
                  >
                    {editingTag ? "Save Changes" : "Confirm Tag"}
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

// Inline specialized component for delete confirmation to avoid standard window.confirm
const PopconfirmDelete = ({ onConfirm }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
      >
        <Trash2 size={18} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="absolute right-0 bottom-full mb-3 z-50 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl shadow-2xl w-56"
            >
              <p className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-3">
                Permanently remove this category?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex-1 py-1.5 text-[10px] font-black uppercase bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-lg"
                >
                  No
                </button>
                <button
                  onClick={() => {
                    onConfirm();
                    setIsOpen(false);
                  }}
                  className="flex-1 py-1.5 text-[10px] font-black uppercase bg-rose-500 text-white rounded-lg"
                >
                  Archive
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MediaTags;
