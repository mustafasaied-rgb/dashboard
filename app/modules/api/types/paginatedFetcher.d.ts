export type ServiceFn = (params: any) => Promise<any>

export interface PaginatedFetcherOptions {
  service: ServiceFn
  defaultPerPage?: number
  defaultIsLoading?: boolean
  filterParams?: object | import('vue').Ref<any> | (() => object)
  watch?: any[]
  rowsKey?: string
  paginationKey?: string
  isLoadMorePagination?: boolean
  immediate?: boolean
  delay?: number
}

export interface PaginatedFetcherApi {
  isLoading: import('vue').Ref<boolean>
  isLoadingMore: import('vue').Ref<boolean>
  rows: import('vue').Ref<any[]>
  selectedRows: import('vue').Ref<any[]>
  perPage: import('vue').Ref<number>
  currentPage: import('vue').Ref<number>
  totalPages: import('vue').Ref<number>
  search: import('vue').Ref<string>
  fetchData: (params?: any) => Promise<void>
  refresh: () => Promise<void>
}

// Usage examples (plain JS)

/**
 * *********** Basic usage *************
export function useUsers() {
  const service = async (params) => {
    // axios or $fetch; return an object with { data, meta: { last_page } }
    const res = await $fetch('/api/users', { params })
    return res
  }

  const {
    rows, isLoading, search, perPage, currentPage, totalPages, fetchData
  } = usePaginatedFetcher({
    service,
    filterParams: { role: 'admin', active: true }, // can also be a ref() or a getter()
    immediate: true,
  })

  return { rows, isLoading, search, perPage, currentPage, totalPages, fetchData }
}

Search + filters (no deep watch)

<script setup>
const { rows, isLoading, search, currentPage, totalPages } = useUsers()

// changing these triggers a debounced refetch:
search.value = 'john'       // triggers after 100ms
currentPage.value = 2       // triggers after `delay` (default 500ms)
</script>
 */

/**
 * *********** Load-more mode *************
  const {
        rows, isLoadingMore, currentPage
    } = usePaginatedFetcher({
      service,
      isLoadMorePagination: true,
    })

    async function loadMore() {
      currentPage.value += 1 // watcher will set isLoadingMore and append new rows
    }

    
 */

/**
 * *********** Watching extra sources (e.g., route query)*************
    const route = useRoute()
    usePaginatedFetcher({
      service,
      filterParams: () => ({ status: route.query.status || 'all' }),
      watch: [() => route.fullPath], // any change resets to page 1 and refetches
    })
 */
