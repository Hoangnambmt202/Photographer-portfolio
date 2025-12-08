"use client";

import { useEffect } from "react";
import { useTagStore } from "@/stores/tagStore";
import TagTable from "@/components/admin/features/tag/TagTable";
import TagForm from "@/components/admin/features/tag/TagForm";

export default function TagsPage() {
  const { fetchTags, modalOpen } = useTagStore();

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  return (
    <div className="p-6">
      

      <TagTable />

      {modalOpen && <TagForm />}
    </div>
  );
}
