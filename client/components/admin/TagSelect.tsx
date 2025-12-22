"use client";

import CreatableSelect from "react-select/creatable";
import makeAnimated from "react-select/animated";
import { MultiValue } from "react-select";
import { useState, useEffect, useMemo } from "react"; // Thêm useMemo
import { useTagStore } from "@/stores/tagStore";

const animatedComponents = makeAnimated();

type DBTag = { id: number | null; value: string };
type Option = { id: number | null; value: string; label: string };

interface TagSelectProps {
  defaultValues?: DBTag[];
  onChange: (tags: DBTag[]) => void;
}

export default function TagSelect({
  defaultValues = [],
  onChange,
}: TagSelectProps) {
  const { tags: globalTags, createTag, fetchTags } = useTagStore();

  // --- LOGIC XỬ LÝ DATA AN TOÀN ---
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const toOption = (t: any): Option | null => {
    if (!t) return null;
    const label = t.name || t.value || t.label;
    if (!label) return null;
    return {
      id: t.id ?? null,
      value: label,
      label: label,
    };
  };

  const [value, setValue] = useState<Option[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // TẤT CẢ OPTIONS LUÔN ĐƯỢC TÍNH TỪ GLOBAL TAGS
  const options = useMemo(() => {
    return globalTags
      .map(toOption)
      .filter((item): item is Option => item !== null);
  }, [globalTags]);

  // 1. Đồng bộ Default Values (khi Edit)
  useEffect(() => {
    const validDefaults = defaultValues
      .map(toOption)
      .filter((item): item is Option => item !== null);

    // Chỉ update nếu thực sự thay đổi
    if (JSON.stringify(validDefaults) !== JSON.stringify(value)) {
      setValue(validDefaults);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues]);

  // 2. Load tags khi component mount
  useEffect(() => {
    if (globalTags.length === 0) {
      fetchTags();
    }
  }, [fetchTags, globalTags.length]);

  // --- HANDLERS ---

  // Xử lý khi chọn/xóa tag có sẵn
  const handleChange = (newValue: MultiValue<Option>) => {
    const selectedOptions = newValue as Option[];
    setValue(selectedOptions);
    console.log("selectedOptions", selectedOptions);
    onChange(selectedOptions.map((o) => ({ id: o.id, value: o.value })));
  };

  // Xử lý khi tạo tag mới
  const handleCreate = async (inputValue: string) => {
    setIsLoading(true);
    try {
      // 1. Gọi API tạo tag
      const newTagData = await createTag(inputValue);
      
      // 2. Convert thành Option
      const newOption = toOption(newTagData);
      
      if (newOption) {
        // 3. Thêm vào danh sách đang chọn
        const newValueArray = [...value, newOption];
        setValue(newValueArray);
        
        // 4. Bắn dữ liệu ra ngoài
        onChange(newValueArray.map((o) => ({ id: o.id, value: o.value })));
        
        // 5. Fetch tags mới - KHÔNG CẦN setOptions vì options tính từ globalTags
        await fetchTags();
      }
    } catch (error) {
      console.error("Lỗi tạo tag:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CreatableSelect
      components={animatedComponents}
      isMulti
      isDisabled={isLoading}
      isLoading={isLoading}
      value={value}
      options={options} // Luôn dùng options từ globalTags
      onChange={handleChange}
      onCreateOption={handleCreate}
      placeholder="Chọn hoặc nhập để tạo tag..."
      classNamePrefix="react-select"
      formatCreateLabel={(inputValue) => `Tạo tag mới: "${inputValue}"`}
      noOptionsMessage={() => "Chưa có tag nào"}
      // Custom Style
      classNames={{
        control: ({ isFocused }) =>
          `!min-h-[42px] !border-gray-300 !shadow-sm !rounded-md ${
            isFocused ? "!border-blue-500 !ring-1 !ring-blue-500" : ""
          }`,
        multiValue: () => "!bg-blue-50 !rounded-md",
        multiValueLabel: () => "!text-blue-700 !font-medium",
        multiValueRemove: () =>
          "!text-blue-500 hover:!bg-blue-100 hover:!text-blue-800",
      }}
    />
  );
}