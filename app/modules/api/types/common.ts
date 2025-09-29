export interface PaginationMeta {
  total: number
  per_page: number
  current_page: number
  last_page: number
  from?: number
  to?: number
}
export interface ApiResponse<T = unknown> {
  message: string
  status: number
  data: T
}
export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  meta: PaginationMeta
}

export type Locale = 'en' | 'ar'
export type LocalizedKey<Base extends string> = `${Base}_${Locale}`
export type LocalizedPartial<B extends string> = {
  [K in `${B}_${Locale}`]?: string
}

// //for test
// type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never
// type ExpandedPaginatedUser = Expand<PaginatedResponse>
