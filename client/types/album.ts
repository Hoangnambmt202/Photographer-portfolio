import { Tag, TagInput } from "./tag.types";

export interface Album {
  id: number;
  title: string;
  slug: string;
  description?: string;
  cover_image: string;
  status?: string;
  category?: {
    id: number;
    name: string;
  } | null;

  featured_photo_id?: number | null;
  tags?: Tag[];
  photo_quantity?: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface AlbumFormData
  extends Omit<Partial<Album>, "cover_image" | "tags" | "category"> {
  cover_image?: string | File | undefined;
  tags?: TagInput[];
  category?: number | null;
}

// 3. Định nghĩa AlbumBaseState (Trạng thái tĩnh)
export interface AlbumBaseState {
  albums: Album[];
  formData: AlbumFormData;
  modalMode: "add" | "edit";
  editingAlbum: Album | null;
  isModalOpen: boolean;
}
