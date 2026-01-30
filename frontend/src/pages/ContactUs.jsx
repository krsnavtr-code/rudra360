import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import InquiryForm from "../components/InquiryForm";
import { getOwnerInfo } from "../api/ownerInfoApi";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Star,
  Award,
  Globe,
  ChevronRight,
  Check,
  ArrowRight,
  Building,
  Send,
} from "lucide-react";

const ContactUs = () => {
  const { darkMode } = useTheme();
  const [ownerInfo, setOwnerInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOwnerInfo = async () => {
      try {
        const data = await getOwnerInfo();
        setOwnerInfo(data);
      } catch (error) {
        console.error("Failed to fetch owner info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOwnerInfo();
  }, []);

  // Get primary owner contact info
  const getPrimaryOwner = () => {
    if (!ownerInfo?.owners?.length) return null;
    return (
      ownerInfo.owners.find((owner) => owner.isPrimary) || ownerInfo.owners[0]
    );
  };

  const primaryOwner = getPrimaryOwner();

  const services = [
    {
      icon: Award,
      title: "Corporate Awards",
      description: "Employee recognition and corporate achievement ceremonies",
      features: ["Custom Trophies", "Live Streaming", "Brand Integration"],
    },
    {
      icon: Star,
      title: "Gala Events",
      description: "Premium red carpet experiences and celebrity appearances",
      features: ["VIP Management", "Media Coverage", "Luxury Venues"],
    },
    {
      icon: Building,
      title: "Product Launches",
      description: "Innovative product unveiling experiences",
      features: ["Stage Design", "Tech Integration", "Press Events"],
    },
    {
      icon: Globe,
      title: "International Events",
      description: "Global event management and coordination",
      features: ["Multi-location", "Cultural Adaptation", "Logistics"],
    },
  ];

  const contactInfo = [
    {
      icon: Phone,
      title: "Call Us",
      details: primaryOwner
        ? [primaryOwner.callNumber, primaryOwner.whatsappNumber]
        : ["+91 98765 43210", "+1 (555) 123-4567"],
      action: primaryOwner
        ? `tel:${primaryOwner.callNumber.replace(/[^\d+]/g, "")}`
        : "tel:+919876543210",
      color: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    },
    {
      icon: Mail,
      title: "Email Us",
      details: primaryOwner
        ? [primaryOwner.email]
        : ["events@rudra360.com", "support@rudra360.com"],
      action: primaryOwner
        ? `mailto:${primaryOwner.email}`
        : "mailto:events@rudra360.com",
      color:
        "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      details:
        ownerInfo?.businessLocations?.length > 0
          ? ownerInfo.businessLocations.map(
              (loc) => `${loc.city}, ${loc.country}`,
            )
          : ["Mumbai, India", "New York, USA"],
      action: "#locations",
      color:
        "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: ownerInfo?.businessHours
        ? [ownerInfo.businessHours.weekdays, ownerInfo.businessHours.saturday]
        : ["Mon-Fri: 9AM-6PM", "Sat: 10AM-4PM"],
      action: "#",
      color:
        "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      company: "TechCorp International",
      role: "Marketing Director",
      content:
        "Rudra360 transformed our annual awards into an unforgettable experience. The attention to detail was exceptional.",
      rating: 5,
    },
    {
      name: "Michael Rodriguez",
      company: "Global Finance Ltd",
      role: "CEO",
      content:
        "Professional, creative, and flawless execution. Our product launch was a massive success thanks to their expertise.",
      rating: 5,
    },
    {
      name: "Priya Sharma",
      company: "Luxury Brands Group",
      role: "Event Manager",
      content:
        "The best event management company we've worked with. They understand luxury and deliver beyond expectations.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-600 via-orange-600 to-red-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Let's Create
              <span className="block text-amber-200">
                Something Extraordinary
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-amber-100 mb-8 max-w-3xl mx-auto">
              Connect with our event architects to begin originating your custom
              award function or corporate gala
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() =>
                  document
                    .getElementById("contact-form")
                    .scrollIntoView({ behavior: "smooth" })
                }
                className="px-8 py-4 bg-white text-amber-600 font-bold rounded-xl hover:bg-amber-50 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <Send size={20} />
                Start Your Project
              </button>
              <button
                onClick={() =>
                  document
                    .getElementById("services")
                    .scrollIntoView({ behavior: "smooth" })
                }
                className="px-8 py-4 bg-amber-700 text-white font-bold rounded-xl hover:bg-amber-800 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
              >
                Explore Services
                <ArrowRight size={20} />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-amber-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-orange-400 rounded-full opacity-20 animate-pulse"></div>
      </section>

      {/* Quick Contact Info */}
      <section className="py-12 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <motion.a
                key={index}
                href={info.action}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-amber-500 dark:hover:border-amber-400 transition-all hover:shadow-lg">
                  <div
                    className={`w-12 h-12 rounded-lg ${info.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <info.icon size={24} />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                    {info.title}
                  </h3>
                  {info.details.map((detail, idx) => (
                    <p
                      key={idx}
                      className="text-sm text-slate-600 dark:text-slate-400"
                    >
                      {detail}
                    </p>
                  ))}
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Our Event Services
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              From concept to execution, we deliver world-class event
              experiences tailored to your brand
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="h-full p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-amber-500 dark:hover:border-amber-400 transition-all hover:shadow-xl">
                  <div className="w-14 h-14 bg-amber-100 dark:bg-amber-900/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-amber-500 group-hover:text-white transition-all">
                    <service.icon size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    {service.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    {service.description}
                  </p>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400"
                      >
                        <Check size={16} className="text-amber-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact-form" className="py-20 bg-white dark:bg-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Start Your Event Journey
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              Tell us about your vision and let's create something extraordinary
              together
            </p>
          </motion.div>

          <InquiryForm
            showTitle={false}
            buttonText="Send Inquiry"
            onSuccess={(response) => {
              console.log("Inquiry submitted:", response);
            }}
          />
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              What Our Clients Say
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              Trusted by leading brands and organizations worldwide
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-xl transition-all"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className="text-amber-500 fill-amber-500"
                    />
                  ))}
                </div>
                <p className="text-slate-600 dark:text-slate-400 mb-6 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {testimonial.role}
                  </p>
                  <p className="text-sm text-amber-600 dark:text-amber-400">
                    {testimonial.company}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white dark:bg-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              Everything you need to know about working with Rudra360
            </p>
          </motion.div>

          <div className="space-y-6">
            {[
              {
                question: "How far in advance should we book your services?",
                answer:
                  "We recommend booking 3-6 months in advance for corporate events and 6-12 months for large-scale award ceremonies. However, we can accommodate urgent requests based on availability.",
              },
              {
                question: "Do you work internationally?",
                answer:
                  "Yes, we have experience organizing events globally across Asia, Europe, and North America. Our team can handle multi-location events and cultural adaptations.",
              },
              {
                question: "What is included in your event planning package?",
                answer:
                  "Our comprehensive packages include venue sourcing, vendor management, theme development, logistics coordination, technical production, and on-site event management.",
              },
              {
                question: "Can you work within our budget?",
                answer:
                  "Absolutely! We work with clients across various budget ranges and can tailor our services to meet your financial requirements while maintaining quality standards.",
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="border border-slate-200 dark:border-slate-700 rounded-xl p-6 hover:border-amber-500 dark:hover:border-amber-400 transition-all"
              >
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  {faq.question}
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
