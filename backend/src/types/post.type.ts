import { ObjectId } from "mongoose";

export interface GetPost {
  _id: ObjectId;
  title: string;
  description: string;
  images: string[];
  downloadlink: string;
  filesize: string;
  favorites: ObjectId[];
  category: string[];
  kits: string[];
  upload_at: string;
}

export interface UpdatePost {
  title?: string;
  description?: string;
  category?: string[];
  kits?: string[];
  images: string[];
  upload_at?: string;
}
