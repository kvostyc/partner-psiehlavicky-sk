import axiosInstance from '@/axios'
import { ref } from 'vue'

interface ProductStockStatus {
  id?: number
  name: string
  identifier: string
  caption?: string
  icon?: string
  color?: string
}

export function useProductStockStatus() {
  const validationErrors = ref<Record<string, string[]>>({})
  const productStockStatuses = ref<ProductStockStatus[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchAllForProduct = async (id: number) => {}
}
