import { useState, useRef } from "react";
import { toast } from "react-hot-toast";
import {
  FaCloudUploadAlt,
  FaTimes,
  FaImage,
  FaCheckCircle,
  FaSpinner,
} from "react-icons/fa";
import { api } from "../../utils/api";
import { motion, AnimatePresence } from "framer-motion";

const ImageUploader = ({
  onUploadSuccess,
  label = "Upload Image Asset",
  className = "",
  maxSizeMB = 50,
}) => {
  const [isUploading, setIsUploading] = useState(false);
    const [files, setFiles] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef(null);

    // --- File Handling Logic ---
    const processFiles = (newFiles) => {
      if (!newFiles || newFiles.length === 0) return;

      const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
      const maxSize = maxSizeMB * 1024 * 1024;
      const processedFiles = [];
      const urls = [];

      Array.from(newFiles).forEach((file) => {
        // Validate Type
        if (!validTypes.includes(file.type)) {
          toast.error(
            `Skipped ${file.name}: Invalid format. Accepted: JPG, PNG, WebP, GIF`
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

    // --- Drag & Drop Handlers ---
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

    const removeImage = (index) => {
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
            const response = await api.post("/upload/image", formData, {
              headers: { "Content-Type": "multipart/form-data" },
            });

            const data = response.data;
            const result = data.data || data;
            results.push({
              url: result.url || result.path,
              path: result.path,
              name: result.name || file.name,
              type: "image",
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
        toast.error(error.response?.data?.message || "Upload sequence failed.");
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
              ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10 scale-[1.02]"
              : "border-gray-300 dark:border-white/10 hover:border-blue-400 dark:hover:border-blue-400"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <AnimatePresence mode="popLayout">
            {previewUrls.length > 0 ? (
              // --- Preview State ---
              <div className="w-full">
                <div className="flex justify-between items-center mb-4 px-2">
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

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-64 overflow-y-auto p-2">
                  {previewUrls.map((url, index) => (
                    <motion.div
                      key={index}
                      layout="position"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="relative group bg-black/5 dark:bg-white/5 rounded-lg overflow-hidden aspect-square"
                    >
                      <img
                        src={url}
                        alt={`Preview ${index}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                        <div className="w-full">
                          <p className="text-xs text-white truncate">
                            {files[index].name}
                          </p>
                          <p className="text-xs text-white/80">
                            {(files[index].size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImage(index);
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
              // --- Idle/Empty State ---
              <motion.label
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                htmlFor="image-upload"
                className="flex flex-col items-center justify-center w-full h-64 cursor-pointer group"
              >
                <div className="w-16 h-16 mb-4 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform duration-300">
                  <FaCloudUploadAlt size={32} />
                </div>
                <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
                  {dragActive ? "Drop Asset Here" : label}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  JPG, PNG, WebP (Max {maxSizeMB}MB)
                </p>

                <input
                  ref={inputRef}
                  id="image-upload"
                  type="file"
                  className="hidden"
                  accept="image/jpeg,image/png,image/webp,image/gif"
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
                <FaImage className="text-blue-500" />
                <span>Ready for ingestion</span>
              </div>

              <button
                type="button"
                onClick={handleUpload}
                disabled={isUploading}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-white transition-all shadow-lg ${
                  isUploading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 hover:-translate-y-0.5 shadow-blue-500/30"
                }`}
              >
                {isUploading ? (
                  <>
                    <FaSpinner className="animate-spin" /> Processing...
                  </>
                ) : (
                  <>
                    <FaCheckCircle /> Upload Asset
                  </>
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Diagram Context: Only show when idle to explain the process */}
        {files.length === 0 && !isUploading && (
          <div className="mt-4 opacity-50 hover:opacity-100 transition-opacity text-center cursor-help">
            <span className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1">
              Architecture
            </span>
          </div>
        )}
      </div>
    );
};

export default ImageUploader;
