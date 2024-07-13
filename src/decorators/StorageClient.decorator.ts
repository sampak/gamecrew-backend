import { createParamDecorator } from "@nestjs/common";
import { StorageClient as SupabaseStorageClient } from "@supabase/storage-js";



export const storageClient = new SupabaseStorageClient(process.env.STORAGE_URL, {
  apikey: process.env.STORAGE_KEY,
  Authorization: `Bearer ${process.env.STORAGE_KEY}`,
})

export const StorageClient = createParamDecorator(() => {
  return storageClient as SupabaseStorageClient
})