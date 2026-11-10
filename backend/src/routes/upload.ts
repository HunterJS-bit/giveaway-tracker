import { Router } from 'express';
import { requireAdmin, AuthRequest } from '../middleware/auth';
import { asyncHandler, ApiError } from '../middleware/errorHandler';
import multer from 'multer';
import { uploadImage } from '../utils/storage';

const router = Router();

// Allowed image mime types
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];

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

    if (!ALLOWED_MIME_TYPES.includes(req.file.mimetype)) {
        throw new ApiError(400, `Unsupported image type: ${req.file.mimetype}`);
    }

    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = uniqueSuffix + '.webp';

    // Public base URL of this API server (used to build absolute URLs for local uploads).
    // With `trust proxy` enabled, protocol/host respect X-Forwarded-* headers behind a proxy.
    const publicBaseUrl = process.env.PUBLIC_URL || `${req.protocol}://${req.get('host')}`;

    // Upload to R2 or local storage
    const fileUrl = await uploadImage(req.file.buffer, filename, publicBaseUrl);

    res.status(201).json({ url: fileUrl });
}));

export default router;
