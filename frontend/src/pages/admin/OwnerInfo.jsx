import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "react-hot-toast";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaWhatsapp,
  FaTelegramPlane,
  FaPlus,
  FaTrash,
  FaStar,
  FaRegStar,
  FaEdit,
  FaSave,
  FaTimes,
} from "react-icons/fa";
import {
  getOwnerInfo as getActiveInfo,
  createOrUpdateOwnerInfo,
  deleteOwner,
} from "../../api/ownerInfoApi";

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
    defaultValues: {
      owners: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "owners",
  });

  // Watch owners to display in "View Mode" and handle Primary logic
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
      console.error("Error loading owner info:", error);
      toast.error("Error loading owner information");
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
    // If not in edit mode, save immediately
    if (!isEditing) {
      saveChanges({ owners: updatedOwners });
    }
  };

  const saveChanges = async (data) => {
    try {
      const updated = await createOrUpdateOwnerInfo({
        ...data,
        id: activeInfo?._id,
      });
      setActiveInfo(updated);
      toast.success("Owner information updated successfully");
      setIsEditing(false);
      loadData(); // Refresh to ensure sync
    } catch (error) {
      console.error("Error saving owner info:", error);
      toast.error(error.message || "Error saving owner information");
    }
  };

  const handleDelete = async (index, ownerId) => {
    if (window.confirm("Are you sure you want to remove this owner?")) {
      if (ownerId) {
        try {
          await deleteOwner(ownerId);
          toast.success("Owner removed");
          loadData();
        } catch (error) {
          toast.error("Error removing owner");
        }
      } else {
        remove(index);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Accounts Information
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage contact details displayed to your users.
          </p>
        </div>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-md hover:shadow-lg"
          >
            <FaEdit /> Edit Accounts
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={() => {
                setIsEditing(false);
                loadData(); // Revert changes
              }}
              className="flex items-center gap-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 px-5 py-2.5 rounded-xl font-medium transition-all"
            >
              <FaTimes /> Cancel
            </button>
            <button
              onClick={handleSubmit(saveChanges)}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-md"
            >
              <FaSave /> Save Changes
            </button>
          </div>
        )}
      </div>

      {/* VIEW MODE: Cards Grid */}
      {!isEditing && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {watchedOwners?.map((owner, index) => (
            <div
              key={index}
              className={`relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border-2 transition-all ${
                owner.isPrimary
                  ? "border-indigo-500 ring-4 ring-indigo-500/10"
                  : "border-transparent hover:border-gray-200 dark:hover:border-gray-700"
              }`}
            >
              {/* Primary Badge */}
              {owner.isPrimary && (
                <div className="absolute top-4 right-4 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  Primary Contact
                </div>
              )}

              {/* Avatar & Name */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center text-gray-500 dark:text-gray-300 text-xl font-bold">
                  {owner.name ? owner.name.charAt(0).toUpperCase() : <FaUser />}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                    {owner.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Owner
                  </p>
                </div>
              </div>

              {/* Contact Details */}
              <div className="space-y-3">
                <ContactItem
                  icon={<FaEnvelope />}
                  label="Email"
                  value={owner.email}
                />
                <ContactItem
                  icon={<FaPhone />}
                  label="Phone"
                  value={owner.callNumber}
                />
                <ContactItem
                  icon={<FaWhatsapp />}
                  label="WhatsApp"
                  value={owner.whatsappNumber}
                />
                {owner.telegramChannel && (
                  <ContactItem
                    icon={<FaTelegramPlane />}
                    label="Telegram"
                    value={owner.telegramChannel}
                  />
                )}
              </div>
            </div>
          ))}

          {/* Empty State */}
          {watchedOwners?.length === 0 && (
            <div className="col-span-full text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700">
              <p className="text-gray-500">No Accounts added yet.</p>
            </div>
          )}
        </div>
      )}

      {/* EDIT MODE: Form List */}
      {isEditing && (
        <form onSubmit={handleSubmit(saveChanges)} className="space-y-6">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 relative group"
            >
              {/* Toolbar */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSetPrimary(index)}
                  className={`p-2 rounded-lg transition-colors ${
                    watchedOwners[index]?.isPrimary
                      ? "text-green-500 bg-green-50 dark:bg-green-900/20 font-bold"
                      : "text-gray-400 hover:text-green-500 hover:bg-gray-100 hover:font-bold"
                  }`}
                  title="Set as Primary"
                >
                  {watchedOwners[index]?.isPrimary ? "This is Primary" : "Set as Primary"}
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(index, field._id)}
                  className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  title="Remove Owner"
                >
                  <FaTrash />
                </button>
              </div>

              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
                Account Details #{index + 1}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup
                  label="Full Name"
                  icon={<FaUser />}
                  register={register}
                  name={`owners.${index}.name`}
                  error={errors.owners?.[index]?.name}
                  required="Name is required"
                />

                <InputGroup
                  label="Email Address"
                  icon={<FaEnvelope />}
                  type="email"
                  register={register}
                  name={`owners.${index}.email`}
                  error={errors.owners?.[index]?.email}
                  required="Email is required"
                  pattern={/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i}
                />

                <InputGroup
                  label="Phone Number"
                  icon={<FaPhone />}
                  type="tel"
                  register={register}
                  name={`owners.${index}.callNumber`}
                  error={errors.owners?.[index]?.callNumber}
                  required="Phone is required"
                />

                <InputGroup
                  label="WhatsApp Number"
                  icon={<FaWhatsapp />}
                  type="tel"
                  register={register}
                  name={`owners.${index}.whatsappNumber`}
                  error={errors.owners?.[index]?.whatsappNumber}
                  required="WhatsApp is required"
                />

                <div className="md:col-span-2">
                  <InputGroup
                    label="Telegram Channel (Optional)"
                    icon={<FaTelegramPlane />}
                    register={register}
                    name={`owners.${index}.telegramChannel`}
                  />
                </div>
              </div>
            </div>
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
            className="w-full py-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl text-gray-500 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all font-medium flex items-center justify-center gap-2"
          >
            <FaPlus /> Add Another Account
          </button>
        </form>
      )}
    </div>
  );
};

// --- Helper Components ---

const ContactItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 text-sm">
    <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-700/50 flex items-center justify-center text-gray-500 dark:text-gray-400">
      {icon}
    </div>
    <div className="flex flex-col">
      <span className="text-xs text-gray-400 font-medium">{label}</span>
      <span className="text-gray-700 dark:text-gray-200 font-medium truncate max-w-[150px]">
        {value || "-"}
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
  pattern,
}) => (
  <div className="w-full">
    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
        {icon}
      </div>
      <input
        type={type}
        {...register(name, {
          required,
          pattern: pattern
            ? { value: pattern, message: "Invalid format" }
            : undefined,
        })}
        className={`w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-gray-900 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${
          error
            ? "border-red-500 focus:ring-red-200"
            : "border-gray-200 dark:border-gray-700"
        }`}
        placeholder={`Enter ${label.toLowerCase()}...`}
      />
    </div>
    {error && (
      <p className="mt-1 text-xs text-red-500 font-medium">{error.message}</p>
    )}
  </div>
);

export default OwnerInfo;
