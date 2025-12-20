import { Tag, TagInput } from "./tag.types";

export type AlbumStatus = "active" | "archived" | "draft";

export interface AlbumFilters {
  search?: string;
  status?: AlbumStatus;
  category_id?: number;
  taken_from?:string;
  taken_to?:string;
}
export interface Album {
  id: number;
  title: string;
  slug: string;
  description?: string;
  cover_image: string;
  status: AlbumStatus;
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

export interface AlbumBaseState {
  albums: Album[];

  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;

  filters: AlbumFilters;

  formData: AlbumFormData;
  modalMode: "add" | "edit";
  editingAlbum: Album | null;
  isModalOpen: boolean;

  
}
