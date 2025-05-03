"use client"

import useSWR from "swr"

interface SearchParams {
  name?: string
  role?: string
  status?: string
}

export function useUsers(page = 1, limit = 10, searchParams?: SearchParams) {
  // Build query string with search parameters
  let queryString = `/api/users?page=${page}&limit=${limit}`
  
  if (searchParams) {
    if (searchParams.name) queryString += `&name=${encodeURIComponent(searchParams.name)}`
    if (searchParams.role && searchParams.role !== "all") queryString += `&role=${encodeURIComponent(searchParams.role)}`
    if (searchParams.status && searchParams.status !== "all") queryString += `&status=${encodeURIComponent(searchParams.status)}`
  }

  const { data, error, isLoading, mutate } = useSWR(queryString, async (url) => {
    const res = await fetch(url)
    if (!res.ok) {
      throw new Error("Failed to fetch users")
    }
    return res.json()
  })

  return {
    users: data?.data?.users || [],
    total: data?.data?.total || 0,
    totalPages: data?.data?.totalPages || 0,
    currentPage: data?.data?.currentPage || page,
    isLoading,
    isError: error,
    mutate,
  }
}
