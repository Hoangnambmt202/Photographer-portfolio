"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center max-w-md">
        <h2 className="text-2xl font-bold mb-3">
          Có lỗi xảy ra 😢
        </h2>

        <p className="text-muted-foreground mb-6">
          {error.message || "Không thể tải dữ liệu"}
        </p>

        <button
          onClick={() => reset()}
          className="px-4 py-2 rounded bg-black text-white"
        >
          Thử lại
        </button>
      </div>
    </div>
  );
}
