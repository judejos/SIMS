import { useState, useMemo } from 'react'

/**
 * useSearch — filters `data` by `query` across all `keys`.
 * Keys support dot-notation: 'user.username'
 *
 * @param {Array}  data   - full dataset
 * @param {Array}  keys   - string keys to search across
 * @returns {{ query, setQuery, filtered }}
 */
export default function useSearch(data, keys) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q || !data?.length) return data ?? []
    return data.filter(row =>
      keys.some(key => {
        const val = key.split('.').reduce((obj, k) => obj?.[k], row)
        return String(val ?? '').toLowerCase().includes(q)
      })
    )
  }, [data, query, keys])

  return { query, setQuery, filtered }
}
