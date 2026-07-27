import { useEffect, useState } from 'react'
import * as api from '../services/api'

let cache = null

export function useInventory() {
  const [inventory, setInventory] = useState(cache || [])
  const [loading, setLoading] = useState(!cache)

  useEffect(() => {
    if (cache) return
    let mounted = true
    api.getInventory().then((data) => {
      if (!mounted) return
      cache = data
      setInventory(data)
      setLoading(false)
    })
    return () => { mounted = false }
  }, [])

  return { inventory, loading }
}
