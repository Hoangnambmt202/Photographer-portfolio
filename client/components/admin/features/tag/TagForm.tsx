"use client";

import { useState, useEffect } from "react";
import { useTagStore } from "@/stores/tagStore";

export default function TagForm() {
  const { modalMode, editingTag, createTag, updateTag, closeModal } =
    useTagStore();

  const [name, setName] = useState("");

  useEffect(() => {
    if (modalMode === "edit" && editingTag) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(editingTag.name);
    }
  }, [editingTag, modalMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (modalMode === "add") {
      await createTag(name);
    } else if (editingTag) {
      await updateTag(editingTag.id, name);
    }

    closeModal();
  };

  return (
    <div className="fixed inset-0 bg-black/70  flex items-center justify-center">
      <form className="bg-white p-6 rounded w-96" onSubmit={handleSubmit}>
        <h2 className="text-lg font-semibold mb-4">
          {modalMode === "add" ? "Thêm Tag" : "Sửa Tag"}
        </h2>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded mb-4"
          placeholder="Tên tag..."
        />

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={closeModal}
            className="px-3 py-1 border rounded"
          >
            Hủy
          </button>

          <button
            type="submit"
            className="px-4 py-1 bg-blue-600 text-white rounded"
          >
            Lưu
          </button>
        </div>
      </form>
    </div>
  );
}
