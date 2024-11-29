export interface GetPost {
  id: string;
  title: string;
  description: string;
  image: string[];
  downloadlink: string;
  filesize: string;
  favorites: string[];
  filter: string[];
  kits: string[];
  created_at: string;
  updated_at: string;
}

export interface AddPost {
  title: string;
  description: string;
  image: string[];
  downloadlink: string;
  filesize: string;
  filter: string[];
  kits: string[];
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
