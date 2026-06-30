import { NextRequest, NextResponse } from 'next/server';
import { uploadImage } from '@/lib/cloudinary';
import { withApiHandler, apiSuccess } from '@/lib/api-utils';

const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const POST = withApiHandler(
  async (request: NextRequest) => {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'smartmart';

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF images are allowed' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds 5MB limit' },
        { status: 400 }
      );
    }

    const result = await uploadImage(file, folder);
    return apiSuccess(result);
  },
  { rateLimit: { limit: 10 } }
);
