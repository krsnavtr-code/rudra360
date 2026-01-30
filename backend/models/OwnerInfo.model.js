import mongoose from 'mongoose';

const ownerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, match: [/\S+@\S+\.\S+/, 'is invalid'] },
    callNumber: { type: String, required: true },
    whatsappNumber: { type: String, required: true },
    telegramChannel: { type: String },
    isPrimary: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const ownerInfoSchema = new mongoose.Schema({
    owners: [ownerSchema],
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.model('OwnerInfo', ownerInfoSchema);