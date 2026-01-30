// backend/controllers/ownerInfo.controller.js
import mongoose from 'mongoose';
import OwnerInfo from '../models/OwnerInfo.model.js';

// @desc    Get active owner info
// @route   GET /api/owner-info
// @access  Public
export const getOwnerInfo = async (req, res) => {
    try {
        const ownerInfo = await OwnerInfo.findOne({ isActive: true })
            .select('-__v')
            .populate('owners.createdBy', 'name email')
            .lean();
        
        // If no active record exists, return empty array for owners
        if (!ownerInfo) {
            return res.status(200).json({ owners: [] });
        }
        
        res.status(200).json(ownerInfo);
    } catch (error) {
        console.error('Error in getOwnerInfo:', error);
        res.status(500).json({
            message: 'Server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// @desc    Create or update owner info
// @route   POST /api/owner-info
// @access  Private/Admin
export const createOrUpdateOwnerInfo = async (req, res) => {
    try {
        const { id, owners = [], ...otherData } = req.body;
        
        // Validate at least one owner is provided
        if (!Array.isArray(owners) || owners.length === 0) {
            return res.status(400).json({ message: 'At least one owner is required' });
        }

        // Validate that only one owner is set as primary
        const primaryOwners = owners.filter(owner => owner.isPrimary);
        if (primaryOwners.length !== 1) {
            return res.status(400).json({ message: 'Exactly one owner must be set as primary' });
        }

        const data = {
            owners: owners.map(owner => ({
                ...owner,
                createdBy: req.user.id
            })),
            ...otherData,
            createdBy: req.user.id
        };

        const options = {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true
        };

        const ownerInfo = await OwnerInfo.findByIdAndUpdate(
            id || new mongoose.Types.ObjectId(),
            { $set: data },
            { ...options, populate: 'owners.createdBy' }
        );

        // If this is a new active record, deactivate all others
        if (data.isActive) {
            await OwnerInfo.updateMany(
                { _id: { $ne: ownerInfo._id } },
                { $set: { isActive: false } }
            );
        }

        res.status(200).json(ownerInfo);
    } catch (error) {
        console.error('Error in createOrUpdateOwnerInfo:', error);
        res.status(500).json({
            message: 'Server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// @desc    Get all owner info records
// @route   GET /api/owner-info/all
// @access  Private/Admin
export const getAllOwnerInfo = async (req, res) => {
    try {
        const allInfo = await OwnerInfo.find()
            .select('-__v')
            .populate('owners.createdBy', 'name email')
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });
        res.status(200).json(allInfo);
    } catch (error) {
        console.error('Error in getAllOwnerInfo:', error);
        res.status(500).json({
            message: 'Server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// @desc    Toggle active status
// @route   PATCH /api/owner-info/:id/status
// @access  Private/Admin
export const toggleStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;

        // If activating this record, deactivate all others first
        if (isActive) {
            await OwnerInfo.updateMany(
                { _id: { $ne: id } },
                { $set: { isActive: false } }
            );
        }

        const updated = await OwnerInfo.findByIdAndUpdate(
            id,
            { $set: { isActive } },
            { new: true, populate: 'owners.createdBy' }
        );

        if (!updated) {
            return res.status(404).json({ message: 'Owner info not found' });
        }

        res.status(200).json(updated);
    } catch (error) {
        console.error('Error in toggleStatus:', error);
        res.status(500).json({
            message: 'Server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// @desc    Delete an owner from owners array
// @route   DELETE /api/owner-info/owner/:ownerId
// @access  Private/Admin
export const deleteOwner = async (req, res) => {
    try {
        const { ownerId } = req.params;
        
        // Find the owner info document that contains this owner
        const ownerInfo = await OwnerInfo.findOne({ 'owners._id': ownerId });
        
        if (!ownerInfo) {
            return res.status(404).json({ message: 'Owner not found' });
        }
        
        // Check if this is the only owner
        if (ownerInfo.owners.length <= 1) {
            return res.status(400).json({ message: 'Cannot delete the only owner' });
        }
        
        // Check if this is the primary owner
        const ownerToDelete = ownerInfo.owners.id(ownerId);
        if (ownerToDelete.isPrimary) {
            return res.status(400).json({ message: 'Cannot delete primary owner. Set another owner as primary first.' });
        }
        
        // Remove the owner
        ownerInfo.owners.pull(ownerId);
        await ownerInfo.save();
        
        res.status(200).json({ message: 'Owner deleted successfully' });
    } catch (error) {
        console.error('Error in deleteOwner:', error);
        res.status(500).json({
            message: 'Server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};