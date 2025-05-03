"use client"

import { useMemo } from "react"
import useSWR from "swr"

interface SearchParams {
  name?: string
  role?: string
  status?: string
}

export function useUsers(page = 1, limit = 10, searchParams?: SearchParams) {
  // Memoize the query string to prevent unnecessary re-renders
  const queryString = useMemo(() => {
    let query = `/api/users?page=${page}&limit=${limit}`
    
    if (searchParams) {
      if (searchParams.name) query += `&name=${encodeURIComponent(searchParams.name)}`
      if (searchParams.role && searchParams.role !== "all") query += `&role=${encodeURIComponent(searchParams.role)}`
      if (searchParams.status && searchParams.status !== "all") query += `&status=${encodeURIComponent(searchParams.status)}`
    }
    
    return query
  }, [page, limit, searchParams])

  // Configure SWR with optimized options
  const { data, error, isLoading, mutate } = useSWR(queryString, async (url) => {
    const res = await fetch(url)
    if (!res.ok) {
      throw new Error("Failed to fetch users")
    }
    return res.json()
  }, {
    revalidateOnFocus: false, // Prevent revalidation on window focus
    dedupingInterval: 10000, // Deduplicate requests within 10 seconds
    errorRetryCount: 3, // Retry failed requests 3 times
    shouldRetryOnError: true,
    keepPreviousData: true // Keep previous data while loading new data
  })

  // Memoize the return object to prevent unnecessary re-renders
  return useMemo(() => ({
    users: data?.data?.users || [],
    total: data?.data?.total || 0,
    totalPages: data?.data?.totalPages || 0,
    currentPage: data?.data?.currentPage || page,
    isLoading,
    isError: error,
    mutate,
  }), [data, error, isLoading, mutate, page])
}
