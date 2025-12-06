// Tag type từ Database
export interface Tag {
    id: number;
    name: string;
    slug: string;
}

// Tag gửi lên từ Form (Creatable + Select)
export interface TagInput {
    id: number | null;   // null nếu tag mới
    value: string;       // tên tag nhập từ form
}
