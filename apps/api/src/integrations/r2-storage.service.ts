import { Injectable } from "@nestjs/common";

@Injectable()
export class R2StorageService {
  private readonly bucketName = process.env.R2_BUCKET_NAME || "snepr-media";
  private readonly publicUrl = process.env.R2_PUBLIC_URL || "https://media.snepr.in";

  async getPreSignedUploadUrl(folder: "hairstyles" | "salons" | "kyc", fileName: string, contentType: string) {
    const cleanName = fileName.toLowerCase().replace(/[^a-z0-9.-]+/g, "-");
    const key = `${folder}/${Date.now()}-${cleanName}`;

    // Pre-signed URL mock for client PUT
    const uploadUrl = `https://${this.bucketName}.r2.cloudflarestorage.com/${key}?signature=mock_presigned_${Date.now()}`;
    const destinationUrl = `${this.publicUrl}/${key}`;

    return {
      uploadUrl,
      destinationUrl,
      key,
      contentType,
      expiresInSeconds: 300,
    };
  }
}

