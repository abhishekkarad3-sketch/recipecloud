import { createClient } from './client';

const BUCKET_NAME = 'recipe-images';

export async function uploadRecipeImage(file: File, userId: string): Promise<string> {
  const supabase = createClient();
  
  // Create unique file name
  const timestamp = Date.now();
  const fileName = `${userId}/${timestamp}-${file.name}`;
  
  // Upload file
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });
  
  if (error) {
    throw new Error(`Failed to upload image: ${error.message}`);
  }
  
  // Get public URL
  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(data.path);
  
  return urlData.publicUrl;
}

export async function deleteRecipeImage(filePath: string): Promise<void> {
  const supabase = createClient();
  
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([filePath]);
  
  if (error) {
    throw new Error(`Failed to delete image: ${error.message}`);
  }
}

export async function ensureBucketExists(): Promise<void> {
  const supabase = createClient();
  
  try {
    // Try to list files to check if bucket exists
    await supabase.storage.from(BUCKET_NAME).list('', { limit: 1 });
  } catch {
    // Bucket doesn't exist, create it
    const { error } = await supabase.storage.createBucket(BUCKET_NAME, {
      public: true,
      fileSizeLimit: 5242880, // 5MB
    });
    
    if (error) {
      throw new Error(`Failed to create storage bucket: ${error.message}`);
    }
  }
}
