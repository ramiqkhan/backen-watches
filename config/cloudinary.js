import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Test Connection
const verifyCloudinaryConnection = async () => {
  try {
    const response = await cloudinary.api.ping();

    if (response.status === "ok") {
      console.log(
        `✅ Cloudinary Connected: ${process.env.CLOUDINARY_CLOUD_NAME}`
      );
    }
  } catch (error) {
    console.error("❌ Cloudinary Error:", error.message);
  }
};

verifyCloudinaryConnection();

// Multer Storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "watch-store",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [
      {
        width: 1000,
        height: 750,
        crop: "limit",
      },
    ],
  },
});

const upload = multer({ storage });

export { cloudinary, upload };