import cloudinary from '../config/cloudinary.js';
import fs from 'node:fs/promises';

export const uploadImage = async (file, folder = 'uploads') => {
  if (!file || !file.path) {
    throw new Error('No file provided for upload');
  }

  try {
    const { url } = await cloudinary.uploader.upload(file.path, {
      folder,
      use_filename: true,
    });

    await fs.unlink(file.path);

    return url;
  } catch (error) {
    if (file.path) {
      await fs.unlink(file.path).catch(() => {});
    }
    throw new Error(`Failed to upload image: ${error.message}`);
  }
};
