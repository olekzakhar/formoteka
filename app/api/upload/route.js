// app/api/upload/route.ts
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { createClient } from '@/utils/supabase/server';

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const R2_PUBLIC_URL = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || process.env.R2_PUBLIC_URL;

// POST - завантаження нового зображення
export async function POST(request) {
  try {
    // Перевіряємо автентифікацію
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file');
    const oldFileName = formData.get('oldFileName');

    if (!file) {
      return NextResponse.json(
        { error: 'Файл не знайдено' },
        { status: 400 }
      );
    }

    // Видаляємо старе зображення, якщо воно є
    if (oldFileName) {
      try {
        const deleteCommand = new DeleteObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME,
          Key: oldFileName,
        });
        await s3Client.send(deleteCommand);
        console.log('✅ Видалено старе зображення:', oldFileName);
      } catch (error) {
        console.error('❌ Помилка видалення старого зображення:', error);
        // Продовжуємо навіть якщо видалення не вдалося
      }
    }

    // Конвертуємо файл у Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Отримуємо оригінальну назву без розширення та розширення файлу
    const originalName = file.name.replace(/\.[^/.]+$/, ''); // видаляємо розширення
    const extension = file.name.split('.').pop(); // отримуємо розширення
    
    // Генеруємо унікальне ім'я: {user_id}/originalname-abc.jpg
    // R2 автоматично створює "папки" при завантаженні файлу з / в ключі
    const uniqueId = nanoid(3);
    const fileName = `${user.id}/${originalName}-${uniqueId}.${extension}`;

    // Завантажуємо в R2 (папка створюється автоматично)
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
    });

    await s3Client.send(command);

    console.log('✅ Завантажено нове зображення:', fileName);

    // Повертаємо тільки ім'я файлу (з user_id папкою), а не повний URL
    return NextResponse.json({
      success: true,
      fileName: fileName, // Наприклад: "c8b39863-b3fe-44ef-86d8-675fe93c8189/photo-a1b.jpg"
      fileUrl: `${R2_PUBLIC_URL}/${fileName}`, // для preview
    });
  } catch (error) {
    console.error('❌ Помилка завантаження:', error);
    return NextResponse.json(
      { error: 'Помилка завантаження файлу' },
      { status: 500 }
    );
  }
}

// DELETE - видалення зображення
export async function DELETE(request) {
  try {
    // Перевіряємо автентифікацію
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { fileName } = await request.json();

    if (!fileName) {
      return NextResponse.json(
        { error: 'Ім\'я файлу не знайдено' },
        { status: 400 }
      );
    }

    // Перевіряємо що файл належить цьому користувачу
    if (!fileName.startsWith(`${user.id}/`)) {
      console.error('❌ Спроба видалити чужий файл:', fileName, 'User:', user.id);
      return NextResponse.json(
        { error: 'Forbidden: You can only delete your own files' },
        { status: 403 }
      );
    }

    const command = new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: fileName,
    });

    await s3Client.send(command);

    console.log('✅ Видалено зображення:', fileName);

    return NextResponse.json({
      success: true,
      message: 'Зображення видалено',
    });
  } catch (error) {
    console.error('❌ Помилка видалення:', error);
    return NextResponse.json(
      { error: 'Помилка видалення файлу' },
      { status: 500 }
    );
  }
}
