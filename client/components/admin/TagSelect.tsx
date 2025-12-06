"use client";

import CreatableSelect from "react-select/creatable";
import makeAnimated from "react-select/animated"; // 1. Import animation
import { MultiValue  } from "react-select";
import { useState, useEffect } from "react";
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
  const { tags: globalTags, createTag } = useTagStore();

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

  const [options, setOptions] = useState<Option[]>([]);
  const [value, setValue] = useState<Option[]>([]);
  const [isLoading, setIsLoading] = useState(false); // Thêm trạng thái loading khi tạo

  // 1. Load danh sách Tag có sẵn từ Store
  useEffect(() => {
    const validOptions = globalTags
      .map(toOption)
      .filter((item): item is Option => item !== null);
    setOptions(validOptions);
  }, [globalTags]);

  // 2. Đồng bộ Default Values (khi Edit)
  useEffect(() => {
    const validDefaults = defaultValues
      .map(toOption)
      .filter((item): item is Option => item !== null);

    // Chỉ update nếu thực sự thay đổi để tránh loop
    if (JSON.stringify(validDefaults) !== JSON.stringify(value)) {
      setValue(validDefaults);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues]);

  // --- HANDLERS ---

  // Xử lý khi chọn/xóa tag có sẵn
  const handleChange = (
    newValue: MultiValue<Option>
  ) => {
    // Ép kiểu về mảng Option chuẩn
    const selectedOptions = newValue as Option[];
    
    setValue(selectedOptions);
    
    // Bắn dữ liệu ra ngoài cho form cha
    onChange(selectedOptions.map((o) => ({ id: o.id, value: o.value })));
  };

  // Xử lý khi tạo tag mới (Enter hoặc click Create)
  const handleCreate = async (inputValue: string) => {
    setIsLoading(true);
    try {
      // 1. Gọi API tạo tag (Store)
      const newTagData = await createTag(inputValue);
      
      // 2. Convert data trả về thành Option
      const newOption = toOption(newTagData);

      if (newOption) {
        // 3. Cập nhật state nội bộ ngay lập tức để UI hiển thị
        setOptions((prev) => [...prev, newOption]); // Thêm vào danh sách gợi ý
        
        const newValue = [...value, newOption]; // Thêm vào danh sách đang chọn
        setValue(newValue);

        // 4. Bắn dữ liệu ra ngoài
        onChange(newValue.map((o) => ({ id: o.id, value: o.value })));
      }
    } catch (error) {
      console.error("Lỗi tạo tag:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CreatableSelect
      // Kích hoạt Animation
      components={animatedComponents} 
      
      isMulti
      isDisabled={isLoading}
      isLoading={isLoading}
      
      value={value}
      options={options}
      
      onChange={handleChange}
      onCreateOption={handleCreate}
      
      placeholder="Chọn hoặc nhập để tạo tag..."
      classNamePrefix="react-select"
      formatCreateLabel={(inputValue) => `Tạo tag mới: "${inputValue}"`}
      noOptionsMessage={() => "Chưa có tag nào"}

      // Custom Style để đẹp hơn với Tailwind (Optional)
      classNames={{
        control: ({ isFocused }) =>
          `!min-h-[42px] !border-gray-300 !shadow-sm !rounded-md ${
            isFocused ? "!border-blue-500 !ring-1 !ring-blue-500" : ""
          }`,
        multiValue: () => "!bg-blue-50 !rounded-md",
        multiValueLabel: () => "!text-blue-700 !font-medium",
        multiValueRemove: () => "!text-blue-500 hover:!bg-blue-100 hover:!text-blue-800",
      }}
    />
  );
}