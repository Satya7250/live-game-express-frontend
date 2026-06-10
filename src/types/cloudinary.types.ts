export interface CloudinarySignatureResponse {
  timestamp: number;
  signature: string;
  apiKey: string;
  cloudName: string;
  folder: string;
}

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
}

export interface CloudinaryApiResponse {
  success: boolean;
  message: string;
  data: CloudinarySignatureResponse;
}
