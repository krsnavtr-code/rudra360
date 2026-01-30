import { useState, useRef } from "react";
import { toast } from "react-toastify";
import {
  FaCloudUploadAlt,
  FaTimes,
  FaFilm,
  FaCheckCircle,
  FaSpinner,
  FaVideo,
} from "react-icons/fa";
import {api} from "../../utils/api"; 
import { motion, AnimatePresence } from "framer-motion";

const VideoUploader = ({
  onUploadSuccess,
  label = "Upload Video Feed",
  className = "",
  maxSizeMB = 200,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [files, setFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  // --- File Handling ---
  const processFiles = (newFiles) => {
    if (!newFiles || newFiles.length === 0) return;

    const validTypes = ["video/mp4", "video/webm", "video/quicktime"];
    const maxSize = maxSizeMB * 1024 * 1024;
    const processedFiles = [];
    const urls = [];

    Array.from(newFiles).forEach((file) => {
      // Validate Type
      if (!validTypes.includes(file.type)) {
        toast.error(
          `Skipped ${file.name}: Invalid codec. Accepted: MP4, WebM, MOV`
        );
        return;
      }

      // Validate Size
      if (file.size > maxSize) {
        toast.error(`Skipped ${file.name}: Exceeds limit of ${maxSizeMB}MB`);
        return;
      }

      // Create Preview
      const fileUrl = URL.createObjectURL(file);
      urls.push(fileUrl);
      processedFiles.push(file);
    });

    if (processedFiles.length > 0) {
      setFiles((prev) => [...prev, ...processedFiles]);
      setPreviewUrls((prev) => [...prev, ...urls]);
    }
  };

  const handleFileChange = (e) => {
    processFiles(e.target.files);
  };

  // --- Drag & Drop ---
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const removeVideo = (index) => {
    // Revoke the object URL to avoid memory leaks
    if (previewUrls[index]) URL.revokeObjectURL(previewUrls[index]);

    // Remove the file and its preview URL
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));

    // Reset file input if all files are removed
    if (files.length <= 1 && inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const clearAll = () => {
    // Revoke all object URLs
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    setFiles([]);
    setPreviewUrls([]);
    if (inputRef.current) inputRef.current.value = "";
  };

  // --- Upload Logic ---
  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error("No files selected.");
      return;
    }

    try {
      setIsUploading(true);
      const results = [];

      // Upload each file sequentially
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);

        try {
          const response = await api.post("/upload/video", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          const data = response.data;
          const result = data.data || data;
          results.push({
            url: result.url || result.path,
            path: result.path,
            name: result.name || file.name,
            type: "video",
          });

          toast.success(`Uploaded: ${file.name}`);
        } catch (error) {
          console.error(`Error uploading ${file.name}:`, error);
          toast.error(
            `Failed to upload ${file.name}: ${
              error.response?.data?.message || "Unknown error"
            }`
          );
        }
      }

      // Call success callback with all results
      if (onUploadSuccess && results.length > 0) {
        onUploadSuccess(results);
      }

      // Clear all files after successful upload
      clearAll();
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.response?.data?.message || "Transmission failed.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <motion.div
        layout="position"
        className={`relative w-full border-2 border-dashed rounded-2xl transition-all duration-300 overflow-hidden ${
          dragActive
            ? "border-[#F47C26] bg-orange-50 dark:bg-[#F47C26]/10 scale-[1.02]"
            : "border-gray-300 dark:border-white/10 hover:border-[#F47C26] dark:hover:border-[#F47C26]"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <AnimatePresence mode="popLayout">
          {previewUrls.length > 0 ? (
            // --- Preview State ---
            <div className="w-full p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {files.length} {files.length === 1 ? "file" : "files"}{" "}
                  selected
                </h3>
                <button
                  type="button"
                  onClick={clearAll}
                  className="text-xs text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                >
                  Clear all
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {previewUrls.map((url, index) => (
                  <motion.div
                    key={index}
                    layout="position"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="relative group bg-black/5 dark:bg-white/5 rounded-xl overflow-hidden aspect-video"
                  >
                    <video
                      src={url}
                      className="w-full h-full object-cover"
                      controls
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                      <div className="w-full">
                        <p className="text-xs text-white truncate">
                          {files[index].name}
                        </p>
                        <p className="text-xs text-white/80">
                          {(files[index].size / 1024 / 1024).toFixed(1)} MB
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeVideo(index);
                        }}
                        className="absolute top-1 right-1 p-1 bg-red-500/90 text-white rounded-full hover:bg-red-600 transition-colors"
                        title="Remove"
                      >
                        <FaTimes size={12} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            // --- Idle State ---
            <motion.label
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              htmlFor="video-upload"
              className="flex flex-col items-center justify-center w-full h-64 cursor-pointer group"
            >
              <div className="w-16 h-16 mb-4 rounded-full bg-orange-50 dark:bg-[#F47C26]/10 flex items-center justify-center text-[#F47C26] group-hover:scale-110 transition-transform duration-300">
                <FaVideo size={32} />
              </div>
              <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
                {dragActive ? "Initialize Stream" : label}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                MP4, WebM, MOV (Max {maxSizeMB}MB)
              </p>

              <input
                ref={inputRef}
                id="video-upload"
                type="file"
                className="hidden"
                accept="video/mp4,video/webm,video/quicktime"
                multiple
                onChange={handleFileChange}
                disabled={isUploading}
              />
            </motion.label>
          )}
        </AnimatePresence>
      </motion.div>

      {/* --- Action Bar --- */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-4 flex justify-between items-center bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-200 dark:border-white/10"
          >
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <FaFilm className="text-[#F47C26]" />
              <span>Ready for transmission</span>
            </div>

            <button
              type="button"
              onClick={handleUpload}
              disabled={isUploading}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-white transition-all shadow-lg ${
                isUploading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#F47C26] hover:bg-[#d5671f] hover:-translate-y-0.5 shadow-orange-500/30"
              }`}
            >
              {isUploading ? (
                <>
                  <FaSpinner className="animate-spin" /> Uploading...
                </>
              ) : (
                <>
                  <FaCloudUploadAlt /> Start Upload
                </>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Diagram Context: Only show when idle */}
      {files.length === 0 && !isUploading && (
        <div className="mt-4 opacity-50 hover:opacity-100 transition-opacity text-center cursor-help">
          <span className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1">
            Stream Pipeline
          </span>
        </div>
      )}
    </div>
  );
};

export default VideoUploader;
