import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "react-hot-toast";
import {
  User,
  Mail,
  Phone,
  MessageSquare,
  Send,
  Plus,
  Trash2,
  Crown,
  Edit3,
  Save,
  X,
  CheckCircle2,
} from "lucide-react";
import {
  getOwnerInfo as getActiveInfo,
  createOrUpdateOwnerInfo,
  deleteOwner,
} from "../../api/ownerInfoApi";
import { motion, AnimatePresence } from "framer-motion";

const OwnerInfo = () => {
  const [activeInfo, setActiveInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: { owners: [] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "owners",
  });

  const watchedOwners = watch("owners");

  const loadData = async () => {
    try {
      setLoading(true);
      const active = await getActiveInfo();
      setActiveInfo(active);

      if (active?.owners?.length > 0) {
        reset({ owners: active.owners });
      } else {
        reset({
          owners: [
            {
              name: "",
              email: "",
              callNumber: "",
              whatsappNumber: "",
              telegramChannel: "",
              isPrimary: true,
            },
          ],
        });
      }
    } catch (error) {
      toast.error("Security handshake failed: Unable to load records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSetPrimary = (index) => {
    const updatedOwners = watchedOwners.map((owner, i) => ({
      ...owner,
      isPrimary: i === index,
    }));
    setValue("owners", updatedOwners);
    if (!isEditing) {
      saveChanges({ owners: updatedOwners });
    } else {
      toast.success(
        `${watchedOwners[index].name || "Account"} set as lead contact`,
      );
    }
  };

  const saveChanges = async (data) => {
    try {
      const updated = await createOrUpdateOwnerInfo({
        ...data,
        id: activeInfo?._id,
      });
      setActiveInfo(updated);
      toast.success("Infrastructure records updated");
      setIsEditing(false);
      loadData();
    } catch (error) {
      toast.error(error.message || "Credential sync failed");
    }
  };

  const handleDelete = async (index, ownerId) => {
    if (ownerId) {
      try {
        await deleteOwner(ownerId);
        toast.success("Account archived");
        loadData();
      } catch (error) {
        toast.error("Action denied");
      }
    } else {
      remove(index);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 p-6 sm:p-10 transition-colors duration-300 relative overflow-hidden">
      {/* Ambience */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.4em]">
                Corporate Identity
              </span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Business <span className="text-amber-500">Accounts</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
              Configure executive contact protocols for client-facing
              communications.
            </p>
          </div>

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-950 px-8 py-4 rounded-2xl font-bold shadow-xl transition-all active:scale-95"
            >
              <Edit3 size={18} /> Modify Directory
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setIsEditing(false);
                  loadData();
                }}
                className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-6 py-4 rounded-2xl font-bold transition-all"
              >
                <X size={18} /> Discard
              </button>
              <button
                onClick={handleSubmit(saveChanges)}
                className="flex items-center gap-2 bg-amber-500 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-amber-500/20 transition-all active:scale-95"
              >
                <Save size={18} /> Deploy Changes
              </button>
            </div>
          )}
        </div>

        {/* VIEW MODE: Cards Grid */}
        {!isEditing && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {watchedOwners?.map((owner, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`group relative bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border-2 transition-all duration-500 ${
                    owner.isPrimary
                      ? "border-amber-500 shadow-2xl shadow-amber-500/10"
                      : "border-slate-100 dark:border-slate-800 hover:border-amber-500/30"
                  }`}
                >
                  {owner.isPrimary && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-2 shadow-lg">
                      <Crown size={12} /> Lead Architect
                    </div>
                  )}

                  <div className="flex flex-col items-center text-center mb-8">
                    <div className="w-20 h-20 rounded-3xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 text-3xl font-black mb-4 group-hover:bg-amber-500 group-hover:text-white transition-all duration-500 rotate-3 group-hover:rotate-0">
                      {owner.name ? (
                        owner.name.charAt(0).toUpperCase()
                      ) : (
                        <User size={32} />
                      )}
                    </div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1 tracking-tight">
                      {owner.name || "Undefined Entity"}
                    </h3>
                    <div className="h-1 w-12 bg-amber-500/20 rounded-full"></div>
                  </div>

                  <div className="space-y-4">
                    <ContactItem
                      icon={<Mail size={16} />}
                      label="Email Protocol"
                      value={owner.email}
                    />
                    <ContactItem
                      icon={<Phone size={16} />}
                      label="Voice Line"
                      value={owner.callNumber}
                    />
                    <ContactItem
                      icon={<MessageSquare size={16} />}
                      label="Direct WhatsApp"
                      value={owner.whatsappNumber}
                    />
                    {owner.telegramChannel && (
                      <ContactItem
                        icon={<Send size={16} />}
                        label="Telegram Secure"
                        value={owner.telegramChannel}
                      />
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* EDIT MODE: Form List */}
        {isEditing && (
          <form onSubmit={handleSubmit(saveChanges)} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {fields.map((field, index) => (
                <motion.div
                  key={field.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-xl relative"
                >
                  <div className="flex justify-between items-start mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-950 dark:bg-amber-500 flex items-center justify-center text-white font-black">
                        {index + 1}
                      </div>
                      <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tight">
                        Entity Configuration
                      </h3>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleSetPrimary(index)}
                        className={`p-2 rounded-xl transition-all ${
                          watchedOwners[index]?.isPrimary
                            ? "bg-amber-500 text-white"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-amber-500"
                        }`}
                        title="Designate as Lead"
                      >
                        <Crown size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(index, field._id)}
                        className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-rose-500 rounded-xl transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <InputGroup
                      label="Official Name"
                      icon={<User size={16} />}
                      register={register}
                      name={`owners.${index}.name`}
                      error={errors.owners?.[index]?.name}
                      required="Name required"
                    />
                    <InputGroup
                      label="Email Channel"
                      icon={<Mail size={16} />}
                      type="email"
                      register={register}
                      name={`owners.${index}.email`}
                      error={errors.owners?.[index]?.email}
                      required="Email required"
                    />
                    <InputGroup
                      label="Mobile Network"
                      icon={<Phone size={16} />}
                      type="tel"
                      register={register}
                      name={`owners.${index}.callNumber`}
                      error={errors.owners?.[index]?.callNumber}
                      required="Phone required"
                    />
                    <InputGroup
                      label="Social API (WhatsApp)"
                      icon={<MessageSquare size={16} />}
                      type="tel"
                      register={register}
                      name={`owners.${index}.whatsappNumber`}
                      error={errors.owners?.[index]?.whatsappNumber}
                      required="WhatsApp required"
                    />
                    <div className="md:col-span-2">
                      <InputGroup
                        label="Telegram Handle (Optional)"
                        icon={<Send size={16} />}
                        register={register}
                        name={`owners.${index}.telegramChannel`}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}

              <button
                type="button"
                onClick={() =>
                  append({
                    name: "",
                    email: "",
                    callNumber: "",
                    whatsappNumber: "",
                    telegramChannel: "",
                    isPrimary: false,
                  })
                }
                className="h-full min-h-[300px] border-4 border-dashed border-slate-100 dark:border-slate-800 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 text-slate-400 hover:text-amber-500 hover:border-amber-500/20 hover:bg-amber-500/5 transition-all duration-500 group"
              >
                <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Plus size={32} />
                </div>
                <span className="font-black uppercase tracking-widest text-xs">
                  Append New Record
                </span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

const ContactItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-4 group/item">
    <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center text-amber-500 group-hover/item:bg-amber-500 group-hover/item:text-white transition-colors duration-300">
      {icon}
    </div>
    <div className="flex flex-col">
      <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-0.5">
        {label}
      </span>
      <span className="text-slate-700 dark:text-slate-200 font-bold text-sm truncate max-w-[180px]">
        {value || "---"}
      </span>
    </div>
  </div>
);

const InputGroup = ({
  label,
  icon,
  type = "text",
  register,
  name,
  error,
  required,
}) => (
  <div className="w-full">
    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">
      {label} {required && <span className="text-amber-500">*</span>}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-amber-500">
        {icon}
      </div>
      <input
        type={type}
        {...register(name, { required })}
        className={`w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-slate-950 border rounded-2xl focus:ring-4 focus:ring-amber-500/10 outline-none transition-all font-semibold text-slate-900 dark:text-white ${
          error
            ? "border-rose-500"
            : "border-slate-200 dark:border-slate-800 focus:border-amber-500"
        }`}
        placeholder={`Enter ${label.toLowerCase()}...`}
      />
    </div>
    {error && (
      <p className="mt-2 text-[10px] text-rose-500 font-black uppercase tracking-tighter ml-1">
        {error.message}
      </p>
    )}
  </div>
);

export default OwnerInfo;
