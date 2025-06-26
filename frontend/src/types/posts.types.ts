export interface GetPost {
  _id: string;
  title: string;
  description: string | { ua: string; en: string };
  images: string[];
  filesize: string;
  favorites: string[];
  category: string[];
  kits: string[];
  upload_at: string;
}

export interface AddPost {
  title: string;
  description: string | { ua: string; en: string };
  images: string[];
  downloadlink: string;
  filesize: string;
  category: string[];
  kits: string[];
  upload_at: string;
}

export interface EditPost {
  title: string;
  description: string | { ua: string; en: string };
  images: string[];
  category: string[];
  kits: string[];
  upload_at: string;
}

export interface AddFavorites {
  userId: string;
  postId: string;
}

// export interface UpdatePost {
//   id: string;
//   name?: string;
//   description?: string;
//   image?: string[];
//   downloadlink?: string;
//   favorites: string[];
// }

export interface PostFormFieldsProps {
  titleValue: string;
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  descriptionValue: string;
  onDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  descriptionUAValue: string;
  onDescriptionUAChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  uploadAt: string;
  onUploadAtChange: (value: string) => void;
}
