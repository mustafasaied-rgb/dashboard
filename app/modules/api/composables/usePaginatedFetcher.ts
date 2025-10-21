import { ref, computed, unref, type Ref } from 'vue'
import { watchDebounced } from '~/composables/watchDebounced'
import type { PaginatedResponse } from '~/modules/api/types'
import { _toValue } from '~/utils'

export type ServiceFn<P = any, R = any> = (params: P) => Promise<PaginatedResponse<R>>

// tow extractor bound to the specific service S
type TRowFromServiceFn<S extends ServiceFn> =
  Awaited<ReturnType<S>> extends PaginatedResponse<infer R> ? R : never

export interface PaginatedFetcherOptions<S> {
  service: S
  defaultPerPage?: number
  defaultIsLoading?: boolean
  filterParams?: Record<string, any> | Ref<any> | (() => Record<string, any>)
  watch?: any[]
  rowsKey?: string
  paginationKey?: string
  isLoadMorePagination?: boolean
  immediate?: boolean
  delay?: number
  onError?: (err: any) => void
}

export interface PaginatedFetcherApi<TRow> {
  isLoading: Ref<boolean>
  isLoadingMore: Ref<boolean>
  rows: Ref<TRow[]>
  selectedRows: Ref<any[]>
  perPage: Ref<number>
  currentPage: Ref<number>
  totalPages: Ref<number>
  search: Ref<string>
  fetchData: (params?: any) => Promise<void>
  loadMore: () => void
  refresh: () => Promise<void>
}

// ---- overloads
//inferred from service
export function usePaginatedFetcher<S extends ServiceFn<any, any>>(
  options: PaginatedFetcherOptions<S>
): PaginatedFetcherApi<TRowFromServiceFn<S>>
//explicit TRow
export function usePaginatedFetcher<TRow>(
  options: PaginatedFetcherOptions<ServiceFn<any, TRow>>
): PaginatedFetcherApi<TRow>
// ---- implementation
export function usePaginatedFetcher(
  options: PaginatedFetcherOptions<any>
): PaginatedFetcherApi<any> {
  const {
    service,
    defaultPerPage = 10,
    defaultIsLoading = false,
    filterParams = {},
    watch: watchSources = [],
    // these are only used at runtime; type inference relies on PaginatedResponse
    rowsKey = 'data',
    paginationKey = 'meta',
    immediate = true,
    isLoadMorePagination = false,
    delay = 500,
    onError
  } = options

  const isLoading = ref<boolean>(defaultIsLoading)
  const isLoadingMore = ref<boolean>(false)
  const rows = ref<any[]>([]) as Ref<any[]>
  const selectedRows = ref<any[]>([])
  const perPage = ref<number>(defaultPerPage)
  const currentPage = ref<number>(1)
  const totalPages = ref<number>(1)
  const search = ref<string>('')

  const filterParamsValue = computed(() => _toValue<Record<string, any>>(filterParams) || {})

  const buildParams = () => {
    const fp = filterParamsValue.value || {}
    const picked = Object.entries(fp).reduce<Record<string, any>>((acc, [key, value]) => {
      if (value !== '' && value !== null && value !== undefined) acc[key] = value
      return acc
    }, {})
    return {
      page: currentPage.value,
      per_page: perPage.value,
      ...(search.value ? { keyword: search.value } : {}),
      ...picked
    }
  }

  const fetchData = async (queryParams?: any): Promise<void> => {
    isLoading.value = isLoadingMore.value ? false : true
    try {
      const result: PaginatedResponse<any> = await service(queryParams ?? buildParams())
      const list = (result?.[rowsKey as 'data'] ?? []) as any[]
      rows.value = isLoadingMore.value ? rows.value.concat(list) : list

      const lp = result?.[paginationKey as 'meta']?.last_page ?? 1
      totalPages.value = typeof lp === 'number' ? lp : Number(lp) || 1

      selectedRows.value = []
    } catch (error) {
      try {
        if (onError) onError(error)
        else (globalThis as any).useHandleErrorMsg?.(error)
      } catch {}
      console.error('Fetch error:', error)
    } finally {
      isLoading.value = false
      isLoadingMore.value = false
    }
  }

  const loadMore = () => {
    isLoadingMore.value = true
    currentPage.value++
    void fetchData()
  }

  watchDebounced(
    currentPage,
    () => {
      if (!isLoadMorePagination) fetchData()
    },
    { debounce: delay }
  )

  watchDebounced(
    [search, perPage, () => ({ ...filterParamsValue.value })],
    () => {
      currentPage.value = 1
      fetchData()
    },
    { debounce: 100 }
  )

  if (Array.isArray(watchSources) && watchSources.length) {
    watchDebounced(
      watchSources,
      () => {
        currentPage.value = 1
        fetchData()
      },
      { debounce: delay }
    )
  }

  if (immediate) void fetchData()

  return {
    isLoading,
    isLoadingMore,
    rows,
    selectedRows,
    perPage,
    currentPage,
    totalPages,
    search,
    fetchData,
    loadMore,
    refresh: fetchData
  }
}
