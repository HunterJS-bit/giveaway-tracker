import { Router } from 'express';
import { requireAdmin, AuthRequest } from '../middleware/auth';
import { asyncHandler, ApiError } from '../middleware/errorHandler';
import multer from 'multer';
import { uploadImage } from '../utils/storage';

const router = Router();

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

    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = uniqueSuffix + '.webp';

    // Upload to R2 or local storage
    const fileUrl = await uploadImage(req.file.buffer, filename);

    res.status(201).json({ url: fileUrl });
}));

export default router;
