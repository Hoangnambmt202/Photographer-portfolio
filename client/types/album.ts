
// 1. Định nghĩa Album (Model chính từ API/Database)
export interface Album {
    id: number;
    title: string;
    slug: string;
    description?: string;
    cover_image: string; 
    status?: string;
    category_id?: number;
    created_at?: Date;
}


export interface AlbumFormData extends Omit<Partial<Album>, 'cover_image'> {
    cover_image?: string | File | undefined;
}

// 3. Định nghĩa AlbumBaseState (Trạng thái tĩnh)
export interface AlbumBaseState {
    albums: Album[];
    formData: AlbumFormData; // Sử dụng Form Data đã fix
    modalMode: "add" | "edit";
    editingAlbum: Album | null;
    isModalOpen: boolean;
}