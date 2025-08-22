import { fileTypeFromBuffer } from 'file-type';
import sharp from 'sharp';
import axios from 'axios';

// Convert a Blob/File (from Next.js App Router formData) or an object with .buffer to a Node Buffer
export async function toNodeBuffer(fileOrBlob) {
    if (!fileOrBlob) throw new Error('No file provided');
    if (fileOrBlob.buffer) return fileOrBlob.buffer; // e.g., Multer-style
    if (typeof fileOrBlob.arrayBuffer === 'function') {
        const ab = await fileOrBlob.arrayBuffer();
        return Buffer.from(ab);
    }
    throw new Error('Unsupported file object: expected Blob/File or { buffer }');
}

export async function validateAndReencodeImage(fileOrBlob, name = 'image') {
    const buffer = await toNodeBuffer(fileOrBlob);
    const fileType = await fileTypeFromBuffer(buffer);

    // Accept common image types; otherwise normalize
    const supportedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/tiff', 'image/bmp'];
    if (!fileType || !supportedTypes.includes(fileType.mime)) {
        console.log(`Re-encoding ${name} to PNG format (unsupported or unknown type).`);
        return await sharp(buffer).toFormat('png').toBuffer();
    }

    // Optional: always convert to webp for size savings
    // return await sharp(buffer).webp({ quality: 80 }).toBuffer();

    return buffer;
}

export async function uploadToImgBB(buffer, name = 'image') {
    try {
        const apiKey = process.env.IMGBB_API_KEY;
        if (!apiKey) throw new Error('IMGBB_API_KEY environment variable not set.');

        // Convert buffer to base64
        const base64Image = buffer.toString('base64');

        // Make the request to ImgBB
        const response = await axios.post(
            `https://api.imgbb.com/1/upload?key=${apiKey}`,
            new URLSearchParams({ image: base64Image }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );

        return response.data.data.url; // Return the ImgBB URL
    } catch (error) {
        console.error(`Error uploading ${name} to ImgBB:`, error.response ? error.response.data : error.message);
        throw new Error(`Failed to upload ${name} to ImgBB.`);
    }
}

// Simple delay helper
export const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// Process an array of files (Blob/File or { buffer }) and return an array of hosted URLs
export async function uploadImages(files) {
    if (!files || !Array.isArray(files)) throw new Error('uploadImages expects an array of files');
    const urls = [];
    for (const file of files) {
        try {
            const name = file?.name || file?.originalname || 'image';
            const validated = await validateAndReencodeImage(file, name);
            const url = await uploadToImgBB(validated, name);
            urls.push(url);
            await delay(300); // throttle to be nice to API
        } catch (err) {
            console.error(err.message);
        }
    }
    return urls;
}

// For Next.js App Router: read files from Request.formData() (input name="files")
export async function uploadImagesFromRequest(req) {
    const form = await req.formData();
    const files = form.getAll('files');
    return await uploadImages(files);
}
