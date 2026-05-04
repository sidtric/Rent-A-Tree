import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:         'yourorchard/images',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  } as object,
});

export const videoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:         'yourorchard/videos',
    resource_type:  'video',
    allowed_formats: ['mp4', 'mov', 'avi', 'webm'],
  } as object,
});

export const mixedStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:        'yourorchard/media',
    resource_type: 'auto',
  } as object,
});

export const uploadImage = multer({ storage: imageStorage });
export const uploadVideo = multer({ storage: videoStorage });
export const uploadMixed = multer({ storage: mixedStorage });
export default cloudinary;
