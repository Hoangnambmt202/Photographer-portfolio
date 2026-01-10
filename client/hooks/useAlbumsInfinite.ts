/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import useSWRInfinite from "swr/infinite";

const PAGE_SIZE = 6;

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function useAlbumsInfinite(initialData: any[]) {
  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && previousPageData.data.length === 0) return null;

    return `http://localhost:8000/api/albums?page=${pageIndex + 1}&limit=${PAGE_SIZE}`;
  };

  const swr = useSWRInfinite(getKey, fetcher, {
    fallbackData: [{ data: initialData }],
    revalidateFirstPage: false,
    refreshInterval: 1000,
  });

  return {
    albums: swr.data?.flatMap(page => page.data) || [],
    loadMore: () => swr.setSize(swr.size + 1),
    isLoadingMore: swr.isLoading,
    isReachingEnd:
      swr.data?.[swr.data.length - 1]?.data.length < PAGE_SIZE,
  };
}
