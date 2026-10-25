import { Router } from 'express';
import { requireAdmin, AuthRequest } from '../middleware/auth';
import { asyncHandler, ApiError } from '../middleware/errorHandler';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';

const router = Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer storage config
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Image upload endpoint (Admin only for now)
router.post('/', requireAdmin as any, upload.single('image'), asyncHandler(async (req: AuthRequest, res) => {
    if (!req.file) {
        throw new ApiError(400, 'No file uploaded');
    }

    // Process with sharp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = uniqueSuffix + '.webp';
    const outputPath = path.join(uploadsDir, filename);

    await sharp(req.file.buffer)
        .resize({ width: 1200, withoutEnlargement: true }) // resize large images
        .webp({ quality: 80 }) // compress into webp
        .toFile(outputPath);

    // Return full URL
    const protocol = req.protocol;
    const host = req.get('host');
    const fileUrl = `${protocol}://${host}/uploads/${filename}`;

    res.status(201).json({ url: fileUrl });
}));

export default router;
