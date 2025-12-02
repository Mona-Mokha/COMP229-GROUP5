import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME || 'dsecbjbd2',
  api_key: process.env.CLOUDINARY_KEY || '665578811788298',
  api_secret: process.env.CLOUDINARY_SECRET || 'Hx1BqFEOvkZQBZwewDlAKNA6MIU',
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "wearshare-uploads",   
    allowed_formats: ["jpg", "jpeg", "png", "gif"],
  },
});


export const getPublicId = (url) => {
  if (!url) return null;

  try {
    // Remove URL params
    const cleanUrl = url.split("?")[0];

    // Take the part after "upload/"
    const afterUpload = cleanUrl.split("/upload/")[1];

    if (!afterUpload) return null;
    const noVersion = afterUpload.replace(/^v\d+\//, "");
    return noVersion.replace(/\.[^/.]+$/, "");
  } catch (err) {
    console.error("Public ID extraction failed for:", url);
    return null;
  }
};

  
export { cloudinary, storage };