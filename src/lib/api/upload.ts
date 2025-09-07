import { apiClient } from './client';

export interface UploadResult {
  fileId: string;
  fileName: string;
  originalName: string;
  url: string;
  publicUrl: string;
  size: number;
  mimeType: string;
  folder: string;
  uploadedAt: string;
  uploadedBy: string;
  metadata?: Record<string, any>;
}

export interface PresignedUploadUrl {
  url: string;
  method: 'PUT' | 'POST';
  fields?: Record<string, string>;
  expiresIn: number;
  expiresAt: string;
}

export interface UploadOptions {
  folder?: string;
  public?: boolean;
  compress?: boolean;
  resize?: {
    width?: number;
    height?: number;
    quality?: number;
  };
  watermark?: {
    text?: string;
    image?: string;
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
    opacity?: number;
  };
  metadata?: Record<string, any>;
}

export interface FileValidation {
  maxSize: number; // in bytes
  allowedTypes: string[];
  allowedExtensions: string[];
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
}

export class UploadService {
  // Upload image file
  static async uploadImage(file: File, options?: UploadOptions): Promise<UploadResult> {
    const formData = new FormData();
    formData.append('file', file);

    if (options) {
      if (options.folder) formData.append('folder', options.folder);
      if (options.public !== undefined) formData.append('public', options.public.toString());
      if (options.compress !== undefined) formData.append('compress', options.compress.toString());
      if (options.resize) {
        formData.append('resize', JSON.stringify(options.resize));
      }
      if (options.watermark) {
        formData.append('watermark', JSON.stringify(options.watermark));
      }
      if (options.metadata) {
        formData.append('metadata', JSON.stringify(options.metadata));
      }
    }

    const response = await apiClient.upload<UploadResult>('/upload/image', formData);
    if (!response.success) {
      throw new Error(response.error || 'Failed to upload image');
    }
    return response.data;
  }

  // Upload document file
  static async uploadDocument(file: File, options?: UploadOptions): Promise<UploadResult> {
    const formData = new FormData();
    formData.append('file', file);

    if (options) {
      if (options.folder) formData.append('folder', options.folder);
      if (options.public !== undefined) formData.append('public', options.public.toString());
      if (options.metadata) {
        formData.append('metadata', JSON.stringify(options.metadata));
      }
    }

    const response = await apiClient.upload<UploadResult>('/upload/document', formData);
    if (!response.success) {
      throw new Error(response.error || 'Failed to upload document');
    }
    return response.data;
  }

  // Upload avatar
  static async uploadAvatar(file: File, options?: UploadOptions): Promise<UploadResult> {
    const formData = new FormData();
    formData.append('file', file);

    if (options) {
      if (options.resize) {
        formData.append('resize', JSON.stringify({
          width: 200,
          height: 200,
          quality: 90,
          ...options.resize
        }));
      }
      if (options.metadata) {
        formData.append('metadata', JSON.stringify(options.metadata));
      }
    }

    const response = await apiClient.upload<UploadResult>('/upload/avatar', formData);
    if (!response.success) {
      throw new Error(response.error || 'Failed to upload avatar');
    }
    return response.data;
  }

  // Upload multiple files
  static async uploadMultipleFiles(files: File[], options?: UploadOptions): Promise<{
    uploaded: UploadResult[];
    failed: Array<{
      file: File;
      error: string;
    }>;
    totalUploaded: number;
    totalFailed: number;
  }> {
    const results = await Promise.allSettled(
      files.map(file => {
        if (file.type.startsWith('image/')) {
          return this.uploadImage(file, options);
        } else {
          return this.uploadDocument(file, options);
        }
      })
    );

    const uploaded: UploadResult[] = [];
    const failed: Array<{ file: File; error: string }> = [];

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        uploaded.push(result.value);
      } else {
        failed.push({
          file: files[index],
          error: result.reason?.message || 'Upload failed'
        });
      }
    });

    return {
      uploaded,
      failed,
      totalUploaded: uploaded.length,
      totalFailed: failed.length
    };
  }

  // Generate presigned upload URL
  static async generatePresignedUrl(fileName: string, options?: {
    folder?: string;
    expiry?: number; // in seconds
    contentType?: string;
    maxSize?: number;
  }): Promise<PresignedUploadUrl> {
    const params: Record<string, any> = { fileName };
    if (options) {
      if (options.folder) params.folder = options.folder;
      if (options.expiry) params.expiry = options.expiry;
      if (options.contentType) params.contentType = options.contentType;
      if (options.maxSize) params.maxSize = options.maxSize;
    }

    const response = await apiClient.get<PresignedUploadUrl>('/upload/presign', params);
    if (!response.success) {
      throw new Error(response.error || 'Failed to generate presigned URL');
    }
    return response.data;
  }

  // Upload file using presigned URL
  static async uploadWithPresignedUrl(presignedUrl: PresignedUploadUrl, file: File): Promise<{
    success: boolean;
    url?: string;
    error?: string;
  }> {
    try {
      const response = await fetch(presignedUrl.url, {
        method: presignedUrl.method,
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (response.ok) {
        return {
          success: true,
          url: presignedUrl.url.split('?')[0], // Remove query parameters to get the final URL
        };
      } else {
        return {
          success: false,
          error: `Upload failed with status ${response.status}`,
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed',
      };
    }
  }

  // Delete uploaded file
  static async deleteFile(fileId: string, folder?: string): Promise<void> {
    let endpoint = `/upload/${fileId}`;
    if (folder) {
      endpoint += `?folder=${encodeURIComponent(folder)}`;
    }

    const response = await apiClient.delete(endpoint);
    if (!response.success) {
      throw new Error(response.error || 'Failed to delete file');
    }
  }

  // Get file metadata
  static async getFileMetadata(fileId: string): Promise<UploadResult> {
    const response = await apiClient.get<UploadResult>(`/upload/${fileId}/metadata`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch file metadata');
    }
    return response.data;
  }

  // Get user's uploaded files
  static async getUserFiles(filters?: {
    folder?: string;
    type?: 'image' | 'document' | 'avatar';
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    files: UploadResult[];
    total: number;
    page: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  }> {
    const response = await apiClient.get<{
      files: UploadResult[];
      total: number;
      page: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    }>('/upload/files', filters);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch user files');
    }
    return response.data;
  }

  // Get upload statistics
  static async getUploadStats(filters?: {
    dateFrom?: string;
    dateTo?: string;
    folder?: string;
  }): Promise<{
    totalFiles: number;
    totalSize: number; // in bytes
    filesByType: Record<string, number>;
    filesByFolder: Record<string, number>;
    storageUsed: number;
    storageLimit: number;
    storagePercentage: number;
    recentUploads: UploadResult[];
    largestFiles: UploadResult[];
  }> {
    const response = await apiClient.get<{
      totalFiles: number;
      totalSize: number;
      filesByType: Record<string, number>;
      filesByFolder: Record<string, number>;
      storageUsed: number;
      storageLimit: number;
      storagePercentage: number;
      recentUploads: UploadResult[];
      largestFiles: UploadResult[];
    }>('/upload/stats', filters);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch upload statistics');
    }
    return response.data;
  }

  // Validate file before upload
  static validateFile(file: File, validation: FileValidation): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Check file size
    if (file.size > validation.maxSize) {
      errors.push(`File size exceeds maximum limit of ${Math.round(validation.maxSize / 1024 / 1024)}MB`);
    }

    // Check file type
    if (!validation.allowedTypes.includes(file.type)) {
      errors.push(`File type ${file.type} is not allowed. Allowed types: ${validation.allowedTypes.join(', ')}`);
    }

    // Check file extension
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (extension && !validation.allowedExtensions.includes(extension)) {
      errors.push(`File extension .${extension} is not allowed. Allowed extensions: ${validation.allowedExtensions.join(', ')}`);
    }

    // For images, check dimensions if specified
    if (file.type.startsWith('image/') && (validation.minWidth || validation.maxWidth || validation.minHeight || validation.maxHeight)) {
      // This would require loading the image, which is async
      // For now, we'll skip dimension validation on client side
      // It should be validated on the server side
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // Get file validation rules
  static async getValidationRules(type: 'image' | 'document' | 'avatar'): Promise<FileValidation> {
    const response = await apiClient.get<FileValidation>(`/upload/validation/${type}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch validation rules');
    }
    return response.data;
  }

  // Compress image before upload
  static async compressImage(file: File, options?: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    maxSizeKB?: number;
  }): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        try {
          const { maxWidth = 1920, maxHeight = 1080, quality = 0.8, maxSizeKB = 1024 } = options || {};

          let { width, height } = img;

          // Calculate new dimensions
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }

          canvas.width = width;
          canvas.height = height;

          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob((blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              reject(new Error('Failed to compress image'));
            }
          }, file.type, quality);
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }

  // Get supported file types and limits
  static async getSupportedTypes(): Promise<{
    images: FileValidation;
    documents: FileValidation;
    avatars: FileValidation;
    general: {
      maxFilesPerUpload: number;
      maxTotalSizePerUpload: number;
    };
  }> {
    const response = await apiClient.get<{
      images: FileValidation;
      documents: FileValidation;
      avatars: FileValidation;
      general: {
        maxFilesPerUpload: number;
        maxTotalSizePerUpload: number;
      };
    }>('/upload/supported-types');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch supported file types');
    }
    return response.data;
  }

  // Clean up temporary files
  static async cleanupTempFiles(): Promise<{
    cleaned: number;
    totalSize: number;
    message: string;
  }> {
    const response = await apiClient.post<{
      cleaned: number;
      totalSize: number;
      message: string;
    }>('/upload/cleanup');
    if (!response.success) {
      throw new Error(response.error || 'Failed to cleanup temporary files');
    }
    return response.data;
  }

  // Get upload progress (for large files)
  static async getUploadProgress(uploadId: string): Promise<{
    uploadId: string;
    status: 'uploading' | 'completed' | 'failed';
    progress: number; // 0-100
    uploadedBytes: number;
    totalBytes: number;
    speed?: number; // bytes per second
    estimatedTimeRemaining?: number; // in seconds
    error?: string;
  }> {
    const response = await apiClient.get<{
      uploadId: string;
      status: 'uploading' | 'completed' | 'failed';
      progress: number;
      uploadedBytes: number;
      totalBytes: number;
      speed?: number;
      estimatedTimeRemaining?: number;
      error?: string;
    }>(`/upload/progress/${uploadId}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch upload progress');
    }
    return response.data;
  }

  // Batch delete files
  static async batchDeleteFiles(fileIds: string[], folder?: string): Promise<{
    deleted: number;
    failed: number;
    results: Array<{
      fileId: string;
      success: boolean;
      error?: string;
    }>;
  }> {
    const data: any = { fileIds };
    if (folder) data.folder = folder;

    const response = await apiClient.post<{
      deleted: number;
      failed: number;
      results: Array<{
        fileId: string;
        success: boolean;
        error?: string;
      }>;
    }>('/upload/batch-delete', data);
    if (!response.success) {
      throw new Error(response.error || 'Failed to batch delete files');
    }
    return response.data;
  }

  // Move file to different folder
  static async moveFile(fileId: string, newFolder: string): Promise<UploadResult> {
    const response = await apiClient.post<UploadResult>(`/upload/${fileId}/move`, { newFolder });
    if (!response.success) {
      throw new Error(response.error || 'Failed to move file');
    }
    return response.data;
  }

  // Copy file to different folder
  static async copyFile(fileId: string, newFolder: string): Promise<UploadResult> {
    const response = await apiClient.post<UploadResult>(`/upload/${fileId}/copy`, { newFolder });
    if (!response.success) {
      throw new Error(response.error || 'Failed to copy file');
    }
    return response.data;
  }
}