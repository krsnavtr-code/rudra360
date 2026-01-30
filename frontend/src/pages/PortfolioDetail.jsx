import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Star,
  ArrowLeft,
  Share2,
  ExternalLink,
  Play,
  Image as ImageIcon,
  Heart,
  Tag,
  Clock,
  Award,
  TrendingUp,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const PortfolioDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [portfolioItem, setPortfolioItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedEvents, setRelatedEvents] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchPortfolioItem();
    fetchRelatedEvents();
  }, [id]);

  const fetchPortfolioItem = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/portfolio/public/${id}`);
      const data = await response.json();

      if (data.success) {
        setPortfolioItem(data.data);
      } else {
        navigate('/portfolio');
      }
    } catch (error) {
      console.error('Error fetching portfolio item:', error);
      navigate('/portfolio');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedEvents = async () => {
    try {
      const response = await fetch('/api/portfolio/public?limit=3');
      const data = await response.json();

      if (data.success) {
        setRelatedEvents(data.data.filter(item => item._id !== id));
      }
    } catch (error) {
      console.error('Error fetching related events:', error);
    }
  };

  const shareEvent = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: portfolioItem.title,
          text: portfolioItem.description,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(dateString));
  };

  const nextImage = () => {
    if (portfolioItem.images && portfolioItem.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % portfolioItem.images.length);
    }
  };

  const prevImage = () => {
    if (portfolioItem.images && portfolioItem.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? portfolioItem.images.length - 1 : prev - 1
      );
    }
  };

  const statusColors = {
    completed: "green",
    ongoing: "blue", 
    upcoming: "yellow",
    cancelled: "red"
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (!portfolioItem) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Event Not Found
          </h2>
          <Link
            to="/portfolio"
            className="inline-flex items-center px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Portfolio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/portfolio"
              className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Portfolio
            </Link>
            <button
              onClick={shareEvent}
              className="inline-flex items-center px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share Event
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section with Image */}
      <div className="relative">
        {portfolioItem.images && portfolioItem.images.length > 0 ? (
          <div className="relative h-96 md:h-[500px] bg-gray-100 dark:bg-gray-800">
            <img
              src={portfolioItem.images[currentImageIndex]}
              alt={portfolioItem.title}
              className="w-full h-full object-cover"
            />
            
            {/* Image Navigation */}
            {portfolioItem.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}

            {/* Image Indicators */}
            {portfolioItem.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {portfolioItem.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Featured Badge */}
            {portfolioItem.featured && (
              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center px-3 py-1 bg-purple-500 text-white text-sm font-medium rounded-full">
                  <Star className="h-4 w-4 mr-1 fill-current" />
                  Featured Event
                </span>
              </div>
            )}

            {/* Category Badge */}
            <div className="absolute bottom-4 left-4">
              <span className="inline-flex items-center px-3 py-1 bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-gray-200 text-sm font-medium rounded-full">
                {portfolioItem.category}
              </span>
            </div>
          </div>
        ) : (
          <div className="h-96 md:h-[500px] bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/30 dark:to-amber-800/30 flex items-center justify-center">
            <div className="text-center">
              <ImageIcon className="h-16 w-16 text-amber-600 dark:text-amber-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">No images available</p>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Title and Description */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {portfolioItem.title}
                </h1>
                <span className={`inline-flex items-center px-3 py-1 bg-${statusColors[portfolioItem.status]}-100 text-${statusColors[portfolioItem.status]}-800 dark:bg-${statusColors[portfolioItem.status]}-900/30 dark:text-${statusColors[portfolioItem.status]}-400 text-sm font-medium rounded-full`}>
                  {portfolioItem.status}
                </span>
              </div>
              
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                {portfolioItem.description}
              </p>
            </div>

            {/* Event Details */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Event Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Users className="h-5 w-5 mr-3 text-amber-500" />
                  <div>
                    <div className="font-medium">Client</div>
                    <div>{portfolioItem.clientName}</div>
                  </div>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Calendar className="h-5 w-5 mr-3 text-amber-500" />
                  <div>
                    <div className="font-medium">Event Date</div>
                    <div>{formatDate(portfolioItem.eventDate)}</div>
                  </div>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <MapPin className="h-5 w-5 mr-3 text-amber-500" />
                  <div>
                    <div className="font-medium">Location</div>
                    <div>{portfolioItem.location}</div>
                  </div>
                </div>
                {portfolioItem.budget && (
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <DollarSign className="h-5 w-5 mr-3 text-amber-500" />
                    <div>
                      <div className="font-medium">Budget</div>
                      <div>{formatCurrency(portfolioItem.budget)}</div>
                    </div>
                  </div>
                )}
                {portfolioItem.attendees && (
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Users className="h-5 w-5 mr-3 text-amber-500" />
                    <div>
                      <div className="font-medium">Attendees</div>
                      <div>{portfolioItem.attendees} guests</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Event Highlights */}
            {portfolioItem.highlights && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Event Highlights
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {portfolioItem.highlights}
                </p>
              </div>
            )}

            {/* Tags */}
            {portfolioItem.tags && portfolioItem.tags.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Tags
                </h2>
                <div className="flex flex-wrap gap-2">
                  {portfolioItem.tags.map((tag, index) => (
                    <span key={index} className="inline-flex items-center px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-sm rounded-full">
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Media Gallery */}
            {(portfolioItem.images?.length > 0 || portfolioItem.videos?.length > 0) && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Media Gallery
                </h2>
                
                {/* Images Grid */}
                {portfolioItem.images && portfolioItem.images.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                      Photos
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {portfolioItem.images.map((image, index) => (
                        <a
                          key={index}
                          href={image}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="relative group block aspect-square"
                        >
                          <img
                            src={image}
                            alt={`${portfolioItem.title} - Photo ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                            <ExternalLink className="h-5 w-5 text-white" />
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Videos Grid */}
                {portfolioItem.videos && portfolioItem.videos.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                      Videos
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {portfolioItem.videos.map((video, index) => (
                        <a
                          key={index}
                          href={video}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="relative group block aspect-video"
                        >
                          <div className="w-full h-full bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                            <Play className="h-12 w-12 text-red-500" />
                          </div>
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                            <ExternalLink className="h-5 w-5 text-white" />
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Testimonial */}
            {portfolioItem.testimonial && (
              <div className="bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-xl p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Client Testimonial
                </h2>
                <blockquote className="text-lg text-gray-700 dark:text-gray-300 italic mb-3">
                  "{portfolioItem.testimonial}"
                </blockquote>
                {portfolioItem.testimonialAuthor && (
                  <cite className="text-gray-600 dark:text-gray-400">
                    - {portfolioItem.testimonialAuthor}
                  </cite>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Quick Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Quick Info
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Category</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {portfolioItem.category}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Status</span>
                  <span className={`inline-flex items-center px-2 py-1 bg-${statusColors[portfolioItem.status]}-100 text-${statusColors[portfolioItem.status]}-800 dark:bg-${statusColors[portfolioItem.status]}-900/30 dark:text-${statusColors[portfolioItem.status]}-400 text-xs font-medium rounded-full`}>
                    {portfolioItem.status}
                  </span>
                </div>
                {portfolioItem.attendees && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Attendees</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {portfolioItem.attendees}
                    </span>
                  </div>
                )}
                {portfolioItem.budget && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Budget</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatCurrency(portfolioItem.budget)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={shareEvent}
                  className="w-full inline-flex items-center justify-center px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Event
                </button>
                <Link
                  to="/contact"
                  className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Contact Us
                </Link>
              </div>
            </div>

            {/* Related Events */}
            {relatedEvents.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Related Events
                </h3>
                <div className="space-y-3">
                  {relatedEvents.map((event) => (
                    <Link
                      key={event._id}
                      to={`/portfolio/${event._id}`}
                      className="block p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                        {event.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {event.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioDetail;
