import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getOwnerInfo } from "../api/ownerInfoApi";
import { Trophy, Mail, Phone, Instagram, Twitter, Linkedin, ShieldCheck, Globe } from "lucide-react";

const Footer = () => {
  const [ownerInfo, setOwnerInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOwnerInfo = async () => {
      try {
        const data = await getOwnerInfo();
        const primaryOwner = data.owners?.find((owner) => owner.isPrimary) || data.owners?.[0];
        if (primaryOwner) setOwnerInfo(primaryOwner);
      } catch (error) {
        console.error("Error fetching owner info:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOwnerInfo();
  }, []);

  const formatPhoneNumber = (number) => {
    if (!number) return "";
    return number.replace(/[^\d+]/g, "");
  };

  const phoneNumber = ownerInfo?.callNumber ? formatPhoneNumber(ownerInfo.callNumber) : "";

  return (
    <footer className="relative mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition-colors duration-300 pt-20 pb-10 overflow-hidden">
      {/* Decorative Gold Glow */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-amber-500/5 dark:bg-amber-900/10 rounded-full blur-[120px] -z-10 translate-x-1/3 translate-y-1/3"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="md:col-span-4 space-y-6">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-gradient-to-tr from-amber-600 to-indigo-900 rounded-xl flex items-center justify-center text-white shadow-xl shadow-amber-500/20 transition-transform group-hover:scale-105">
                <Trophy size={24} className="text-amber-200" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  rudra<span className="text-amber-600">360</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">
                  Event Originators
                </span>
              </div>
            </Link>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
              Rudra360 is a premier event architectural firm specializing in originating high-impact 
              Award Functions, Corporate Galas, and Elite Recognition ceremonies globally.
            </p>
            
            {/* Social Icons */}
            <div className="flex items-center gap-4">
              {[
                { icon: <Instagram size={18} />, color: "hover:text-pink-500" },
                { icon: <Twitter size={18} />, color: "hover:text-blue-400" },
                { icon: <Linkedin size={18} />, color: "hover:text-blue-700" },
                { icon: <Globe size={18} />, color: "hover:text-amber-600" }
              ].map((social, idx) => (
                <a key={idx} href="#" className={`p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-400 ${social.color} transition-all border border-slate-100 dark:border-slate-800 shadow-sm`}>
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Business Links */}
          <div className="md:col-span-2">
            <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-[0.2em] mb-8">
              Expertise
            </h3>
            <ul className="space-y-4">
              {["Corporate Awards", "Technical Galas", "Cultural Events", "Hall of Fame", "Virtual Awards"].map((link) => (
                <li key={link}>
                  <Link to={`/${link.toLowerCase().replace(/\s+/g, '-')}`} className="text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 text-sm font-semibold transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support/Info */}
          <div className="md:col-span-2">
            <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-[0.2em] mb-8">
              Company
            </h3>
            <ul className="space-y-4">
              {["Portfolio", "About Us", "Contact", "Case Studies"].map((link) => (
                <li key={link}>
                  <Link to={`/${link.toLowerCase().replace(/\s+/g, '-')}`} className="text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 text-sm font-semibold transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Booking Card */}
          <div className="md:col-span-4 bg-slate-50 dark:bg-slate-900/50 p-7 rounded-[2rem] border border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-4 flex items-center gap-2">
              <ShieldCheck className="text-amber-600" size={18} />
              Book a Consultation
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              Connect with our event architects to begin originating your custom award function.
            </p>

            {loading ? (
              <div className="h-14 w-full bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse"></div>
            ) : phoneNumber ? (
              <a
                href={`tel:${phoneNumber}`}
                className="flex items-center justify-center gap-3 w-full py-4 px-6 bg-gradient-to-r from-amber-600 to-amber-700 rounded-2xl text-white font-bold shadow-lg shadow-amber-900/20 hover:shadow-amber-600/40 transition-all group"
              >
                <Phone size={18} fill="currentColor" />
                {phoneNumber}
              </a>
            ) : (
              <p className="text-xs font-bold text-slate-400 italic">Consultation hours: 9AM - 6PM</p>
            )}
            
            <p className="mt-4 text-[11px] text-center text-slate-400 font-medium uppercase tracking-tighter">
              Authorized Event Management Firm
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-100 dark:border-slate-900 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              &copy; {new Date().getFullYear()} {" "}
              <span className="text-slate-900 dark:text-white font-bold tracking-tight">rudra360.com</span>
            </p>
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-800"></div>
            <Link to="/privacy" className="text-xs text-slate-400 hover:text-amber-600 font-bold uppercase">Privacy</Link>
            <Link to="/terms" className="text-xs text-slate-400 hover:text-amber-600 font-bold uppercase">Terms</Link>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Global Operations Active
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;