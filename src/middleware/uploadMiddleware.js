const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { cloudinary } = require("../config/cloudinary");

// Cloudinary storage for images
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "user_uploads",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const cloudinaryUpload = multer({ 
  storage: cloudinaryStorage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// In-memory storage for PDFs (resumes)
const memoryStorage = multer.memoryStorage();

const pdfFileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

const localUpload = multer({ 
  storage: memoryStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: pdfFileFilter
});

module.exports = { cloudinaryUpload, localUpload };