import { Router } from 'express';
import { requireAdmin, AuthRequest } from '../middleware/auth';
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
router.post('/', requireAdmin as any, upload.single('image'), async (req: AuthRequest, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
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
    } catch (e) {
        req.log?.error(e, 'Upload error');
        res.status(500).json({ error: 'Server error during file upload' });
    }
});

export default router;
