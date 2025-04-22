/**
 * Cloudinary configuration for next-cloudinary
 *
 * Set up your Cloudinary configuration in .env.local:
 * NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
 */

// This file serves as a central place for Cloudinary configuration
// The actual implementation uses the CldUploadWidget component from next-cloudinary
export const cloudinaryConfig = {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
};

// Export upload preset - a named group of settings for uploading to Cloudinary
export const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
