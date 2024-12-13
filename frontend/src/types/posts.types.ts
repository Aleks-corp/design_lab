export interface GetPost {
  _id: string;
  title: string;
  description: string;
  image: string[];
  downloadlink: string;
  filesize: string;
  favorites: string[];
  category: string[];
  kits: string[];
  upload_at: string;
  created_at: string;
  updated_at: string;
}

export interface AddPost {
  data: {
    title: string;
    description: string;
    image: string[];
    downloadlink: string;
    filesize: string;
    category: string[];
    kits: string[];
  };
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
