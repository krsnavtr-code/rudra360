import { useState } from "react";
import ImageUploader from "./ImageUploader";
import VideoUploader from "./VideoUploader";
import { motion, AnimatePresence } from "framer-motion";
import { FaImage, FaVideo, FaInfoCircle, FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom"; // Import Link

const MediaUploader = ({
  onImageUploadSuccess,
  onVideoUploadSuccess,
  className = "",
  imageLabel = "Upload Image",
  videoLabel = "Upload Video",
  maxImageSizeMB = 10,
  maxVideoSizeMB = 200,
}) => {
  const [activeTab, setActiveTab] = useState("image");

  return (
    <div className={`flex flex-col gap-6 ${className}`}>
      {/* --- Header --- */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Upload Media
        </h2>
        <Link
          to="/admin/media-gallery"
          className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <FaArrowLeft />
          Back to Gallery
        </Link>
      </div>

      <div
        className={`bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-xl dark:shadow-none`}
      >
        {/* --- Tab Navigation --- */}
        <div className="flex border-b border-gray-200 dark:border-white/10">
          <button
            onClick={() => setActiveTab("image")}
            className={`flex-1 py-4 flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-wider transition-all relative ${
              activeTab === "image"
                ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10"
                : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5"
            }`}
          >
            <FaImage className="text-lg" /> Image Asset
            {activeTab === "image" && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 w-full h-1 bg-blue-500"
              />
            )}
          </button>

          <button
            onClick={() => setActiveTab("video")}
            className={`flex-1 py-4 flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-wider transition-all relative ${
              activeTab === "video"
                ? "text-[#F47C26] bg-orange-50 dark:bg-[#F47C26]/10"
                : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5"
            }`}
          >
            <FaVideo className="text-lg" /> Video Asset
            {activeTab === "video" && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 w-full h-1 bg-[#F47C26]"
              />
            )}
          </button>
        </div>

        {/* --- Upload Area --- */}
        <div className="p-6 relative">
          <AnimatePresence mode="wait">
            {activeTab === "image" ? (
              <motion.div
                key="image"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <ImageUploader
                  onUploadSuccess={onImageUploadSuccess}
                  label={imageLabel}
                  maxSizeMB={maxImageSizeMB}
                />
              </motion.div>
            ) : (
              <motion.div
                key="video"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <VideoUploader
                  onUploadSuccess={onVideoUploadSuccess}
                  label={videoLabel}
                  maxSizeMB={maxVideoSizeMB}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* --- Footer Info --- */}
          <div className="mt-6 flex items-start gap-3 p-4 bg-gray-50 dark:bg-black/20 rounded-xl border border-gray-100 dark:border-white/5">
            <FaInfoCircle className="text-gray-400 mt-0.5 shrink-0" />
            <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1 w-full">
              <p className="font-bold text-gray-700 dark:text-gray-300">
                {activeTab === "image"
                  ? "Image Guidelines"
                  : "Video Guidelines"}
              </p>
              {activeTab === "image" ? (
                <p>
                  Supported: JPG, PNG, WebP, GIF • Max Size:{" "}
                  <span className="text-blue-500 font-mono">
                    {maxImageSizeMB}MB
                  </span>{" "}
                  • Recommended Width: 1920px
                </p>
              ) : (
                <p>
                  Supported: MP4, WebM, MOV • Max Size:{" "}
                  <span className="text-[#F47C26] font-mono">
                    {maxVideoSizeMB}MB
                  </span>{" "}
                  • Codec: H.264
                </p>
              )}

              {/* Visual Context: Processing Pipeline */}
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-white/10 opacity-70 hover:opacity-100 transition-opacity">
                <span className="uppercase tracking-widest text-[10px] font-bold text-gray-400 mb-2 block">
                  Processing Pipeline Status
                </span>
                <div className="mt-1"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaUploader;
