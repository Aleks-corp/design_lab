export interface GetPost {
  id: string;
  name: string;
  description: string;
  favorites: string[];
  image: string;
  downloadlink: string;
  created_at: string;
  updated_at: string;
}

export interface AddPost {
  name: string;
  description: string;
  image: string;
  downloadlink: string;
}

export interface AddFavorites {
  userId: string;
  postId: string;
}

// export interface UpdatePost {
//   id: string;
//   name?: string;
//   description?: string;
//   image?: string;
//   downloadlink?: string;
//   favorites: string[];
// }
