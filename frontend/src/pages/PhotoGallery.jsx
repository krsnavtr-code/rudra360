import { useEffect, useState, useCallback } from "react";
import { getImageUrl, getUploadedImages } from "../api/imageApi";
import { getMediaTags } from "../api/mediaTagApi";
import { FiRefreshCw, FiX, FiMaximize2 } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const PhotoGallery = () => {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchImages = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // 1. Fetch Tags & Find 'photos-page'
      const response = await getMediaTags();
      const tags = Array.isArray(response) ? response : response?.data?.tags || response?.data || [];
      const photosPageTag = tags.find((tag) => tag?.slug === "photos-page");

      if (!photosPageTag?.mediaFiles?.length) {
        setImages([]);
        return;
      }

      // 2. Fetch All Media
      const allMediaResponse = await getUploadedImages();
      const allMedia = Array.isArray(allMediaResponse) ? allMediaResponse : allMediaResponse.data || [];

      // 3. Match and Format
      const imageData = allMedia
        .filter((media) => {
          const fileName = media.url?.split("/").pop() || media.filename || media.name;
          return photosPageTag.mediaFiles.some((tagUrl) => tagUrl.includes(fileName));
        })
        .map((media) => {
          const url = media.url || getImageUrl(media.name || media.filename);
          return {
            ...media,
            id: media._id || media.id || Math.random().toString(36),
            url,
            thumbnailUrl: url, 
          };
        });

      setImages(imageData);
    } catch (error) {
      console.error("Gallery Error:", error);
      setImages([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  // Keyboard Escape to close lightbox
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setSelectedImage(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-500">
      {/* --- HEADER --- */}
      <header className="relative py-24 px-4 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-96 bg-gradient-to-b from-pink-500/10 via-indigo-500/5 to-transparent blur-3xl opacity-60" />
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-7xl font-black tracking-tight text-gray-900 dark:text-white mb-6">
              HD <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-indigo-500">Photo Gallery</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-xl max-w-2xl mx-auto font-light leading-relaxed">
              A curated visual journey through our premium collections and exclusive captures.
            </p>
          </motion.div>
        </div>
      </header>

      {/* --- CONTENT AREA --- */}
      <main className="max-w-7xl mx-auto px-6 pb-32">
        {isLoading ? (
          /* Skeleton Loader Grid */
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="w-full bg-gray-200 dark:bg-gray-800 rounded-3xl animate-pulse" style={{ height: `${Math.floor(Math.random() * (400 - 200 + 1) + 200)}px` }} />
            ))}
          </div>
        ) : images.length > 0 ? (
          /* Masonry Grid */
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            {images.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="relative group break-inside-avoid rounded-3xl overflow-hidden cursor-zoom-in bg-gray-100 dark:bg-gray-900 border border-transparent dark:border-gray-800 hover:border-pink-500/30 transition-all duration-300"
                onClick={() => setSelectedImage(item)}
              >
                <img
                  src={item.thumbnailUrl}
                  alt={item.name || "Gallery image"}
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white">
                    <FiMaximize2 size={24} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-20">
            <p className="text-gray-400 italic text-lg">No images found in the gallery collection.</p>
            <button 
              onClick={fetchImages}
              className="mt-4 text-pink-500 hover:text-pink-600 font-medium flex items-center gap-2 mx-auto"
            >
              <FiRefreshCw /> Retry Loading
            </button>
          </div>
        )}
      </main>

      {/* --- LIGHTBOX --- */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-12"
            onClick={() => setSelectedImage(null)}
          >
            {/* Close Button */}
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-8 right-8 p-4 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-[110]"
              onClick={() => setSelectedImage(null)}
            >
              <FiX size={28} />
            </motion.button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative max-w-7xl w-full max-h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage.url}
                alt="Full preview"
                className="max-w-full max-h-[90vh] rounded-xl shadow-2xl object-contain"
              />
              
              {/* Optional: Info bar at bottom of lightbox */}
              <div className="absolute -bottom-12 left-0 right-0 text-center text-white/60 text-sm">
                {selectedImage.name || 'Untitled Capture'}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PhotoGallery;