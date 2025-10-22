<template>
  <div
    :class="[
      'overflow-hidden rounded-xl bg-white dark:bg-white/[0.03]',
      variant === 'bordered-both' && 'border border-gray-200 dark:border-gray-700',
      variant === 'bordered-outer' && 'border border-gray-200 dark:border-gray-700'
    ]"
  >
    <!-- Toolbar -->
    <div
      v-if="showHeader"
      :class="['flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5']"
    >
      <BaseInput
        v-if="showSearch"
        v-model="query"
        :placeholder="searchPlaceholder"
        class="max-w-[250px]"
        size="sm"
      >
        <template #start><SearchIcon /></template>
      </BaseInput>
      <div class="flex flex-wrap items-center gap-3">
        <slot name="actions" />
      </div>
    </div>

    <!-- Table -->
    <div class="custom-scrollbar max-w-full overflow-x-auto">
      <table class="min-w-full">
        <thead>
          <!-- full header override -->
          <slot name="header">
            <tr
              :class="[
                // 'border-y border-gray-100 dark:border-gray-800',
                headerCellVarient == 'default' && 'border-y border-gray-100 dark:border-gray-800',
                headerCellVarient == 'dark' && 'bg-gray-50 dark:bg-gray-900',
                headerCellVarient == 'bordered-b' &&
                  'border-b border-gray-200 dark:border-gray-700',
                variant === 'bordered-both' && 'border border-gray-200 dark:border-gray-700'
              ]"
            >
              <th
                v-if="selectable"
                :class="[
                  'w-10 px-5 py-3 sm:px-6',
                  variant === 'bordered-both' && 'border border-gray-200 dark:border-gray-700'
                ]"
              >
                <BaseCheckbox
                  :indeterminate="somePageSelected"
                  :model-value="allPageSelected"
                  @change="toggleSelectAllPage"
                />
              </th>

              <template v-for="col in normalizedHeaders" :key="col.key">
                <th
                  :style="col.width ? { width: col.width } : undefined"
                  :class="[
                    'px-5 py-3 sm:px-6',
                    col.align === 'center' && 'text-center',
                    col.align === 'end' && 'text-end',
                    col.align === 'start' && 'text-start',
                    col.class,
                    variant === 'bordered-both' && 'border border-gray-200 dark:border-gray-700'
                  ]"
                >
                  <!-- single header cell override -->
                  <slot :name="`header.${col.key}`">
                    <p class="text-theme-xs  font-medium text-gray-500 dark:text-gray-400">
                      {{ col.title }}
                    </p>
                  </slot>
                </th>
              </template>
            </tr>
          </slot>
        </thead>

        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
          <tr
            v-for="row in pagedRows"
            :key="row[rowKey]"
            @click="onRowClick(row)"
            :class="[
              'border-t border-gray-100 dark:border-gray-800',
              hoverable && 'cursor-pointer hover:bg-gray-50 dark:hover:bg-white/[0.03]',
              rowClass ? rowClass(row) : ''
            ]"
          >
            <!-- selection -->
            <td
              v-if="selectable"
              :class="[
                'px-5 py-4 sm:px-6',
                variant === 'bordered-both' && 'border border-gray-200 dark:border-gray-700'
              ]"
            >
              <BaseCheckbox :model-value="isSelected(row)" @change="toggleRow(row)" />
            </td>

            <!-- dynamic cells -->
            <template v-for="col in normalizedHeaders" :key="col.key">
              <td
                class="px-5 py-4 sm:px-6"
                :class="[
                  col.align === 'center' && 'text-center',
                  col.align === 'end' && 'text-right',
                  col.cellClass,
                  variant === 'bordered-both' && 'border border-gray-200 dark:border-gray-700'
                ]"
              >
                <!-- cell slot by key -->
                <slot :name="`cell.${col.key}`" :row="row" :value="row[col.key]" :column="col">
                  <!-- default rendering -->
                  <span class="text-theme-sm text-gray-500 dark:text-gray-400">
                    {{ col.formatter ? col.formatter(row[col.key], row) : row[col.key] }}
                  </span>
                </slot>
              </td>
            </template>
          </tr>

          <tr v-if="!pagedRows.length">
            <td
              :colspan="colspanComputed"
              class="px-5 py-10 text-center text-sm text-gray-500 dark:text-gray-400"
            >
              {{ emptyText }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Footer -->
    <div
      v-if="showPagination && displayTotal > 0"
      class="flex flex-col-reverse flex-wrap-reverse items-center justify-between gap-3 px-4 py-4 sm:flex-row sm:px-5"
    >
      <div class="flex items-center gap-2">
        <BaseSelect
          class="!w-fit"
          containerClass="w-[68px] !p-0 !m-0"
          variant="outlined"
          size="sm"
          v-model="pageSize"
          :options="pageSizeOptions.map((i) => ({ label: String(i), value: i }))"
        />
        <span class="text-sm text-gray-500 dark:text-gray-400">{{
          $t('pagination.Rows_per_page')
        }}</span>
      </div>
      <div class="fle flex items-center gap-6">
        <div class="hidden text-sm text-gray-500 sm:block dark:text-gray-400">
          {{ $t('pagination.page') }}
          <span class="font-medium text-gray-700 dark:text-gray-300">{{ page }}</span>
          {{ $t('pagination.of') }}
          <span class="font-medium text-gray-700 dark:text-gray-300">{{ totalPages }}</span>
        </div>
        <Pagination
          :page="page"
          :total="displayTotal"
          :page-size="pageSize"
          @update:page="(p: number) => (page = p)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import Pagination from '@/components/ui/Pagination.vue'

type Align = 'start' | 'center' | 'end'
export type TableHeader<Row = Record<string, any>> = {
  key: keyof Row & string
  title: string
  width?: string
  align?: Align
  class?: string
  cellClass?: string
  formatter?: (value: any, row: Row) => any
}

type Row = Record<string, any>
type HeaderCellVarient = 'default' | 'dark' | 'bordered-b'
type TableVariant = 'default' | 'bordered-both' | 'bordered-outer'

type Props = {
  rows: Row[]
  rowKey?: string
  headers: TableHeader<Row>[]
  selectable?: boolean
  searchKeys?: string[]
  pageSizeOptions?: number[]
  searchPlaceholder?: string
  emptyText?: string
  hoverable?: boolean
  variant?: TableVariant
  rowClass?: (row: Row) => string | undefined
  headerCellVarient?: HeaderCellVarient
  showHeader?: boolean
  showSearch?: boolean
  showPagination?: boolean
  /** server mode */
  server?: boolean
  total?: number

  /** NEW: optionally controlled by parent */
  page?: number
  pageSize?: number
  query?: string
}

const props = withDefaults(defineProps<Props>(), {
  selectable: true,
  searchKeys: () => [],
  pageSizeOptions: () => [10, 20, 50, 100],
  searchPlaceholder: 'Search…',
  emptyText: 'No results found',
  rowKey: 'id',
  hoverable: true,
  server: false,
  total: 0,
  headerCellVarient: 'default',
  showHeader: true,
  showSearch: true,
  showPagination: true,
  variant: 'default',

  /** defaults for controlled props (uncontrolled fallback below) */
  page: undefined,
  pageSize: undefined,
  query: undefined
})

const emit = defineEmits<{
  (e: 'update:selected', keys: (string | number)[]): void
  (e: 'row:toggle', row: Row, selected: boolean): void
  (e: 'row:click', row: Row): void
  (e: 'update:page', value: number): void
  (e: 'update:pageSize', value: number): void
  (e: 'update:query', value: string): void
}>()

/* -------- controlled/uncontrolled pattern -------- */
const _page = ref<number>(props.page ?? 1)
const _pageSize = ref<number>(props.pageSize ?? 10)
const _query = ref<string>(props.query ?? '')

/* small debounce helper for query emits */
let _qTimer: number | undefined
function emitQueryDebounced(val: string, delay = 500) {
  if (_qTimer) window.clearTimeout(_qTimer)
  _qTimer = window.setTimeout(() => emit('update:query', val), delay)
}

/** page */
const page = computed<number>({
  get: () => props.page ?? _page.value,
  set: (val) => {
    _page.value = val
    emit('update:page', val)
  }
})

/** pageSize */
const pageSize = computed<number>({
  get: () => props.pageSize ?? _pageSize.value,
  set: (val) => {
    _pageSize.value = val
    emit('update:pageSize', val)
    if (props.server) page.value = 1 // reset on server mode
  }
})

/** query */
const query = computed<string>({
  get: () => props.query ?? _query.value,
  set: (val) => {
    _query.value = val
    if (props.server) {
      page.value = 1 // reset page on new search in server mode
      emitQueryDebounced(val)
    } else {
      emit('update:query', val)
    }
  }
})

/* headers */
const normalizedHeaders = computed(() => props.headers ?? [])

/* selection */
const selectedKeys = ref<Set<string | number>>(new Set())
const isSelected = (row: Row) => selectedKeys.value.has(row[props.rowKey])
function toggleRow(row: Row) {
  const key = row[props.rowKey]
  if (selectedKeys.value.has(key)) selectedKeys.value.delete(key)
  else selectedKeys.value.add(key)
  emit('row:toggle', row, selectedKeys.value.has(key))
  emit('update:selected', Array.from(selectedKeys.value))
}

/* filtering (client mode only) */
const filteredRows = computed(() => {
  if (props.server) return props.rows
  const q = query.value.trim().toLowerCase()
  if (!q) return props.rows
  const keys = props.searchKeys.length
    ? props.searchKeys
    : normalizedHeaders.value.map((h) => h.key)
  return props.rows.filter((r) =>
    keys.some((k) =>
      String(r[k] ?? '')
        .toLowerCase()
        .includes(q)
    )
  )
})

/* totals */
const displayTotal = computed(() => (props.server ? props.total : filteredRows.value.length))

/* indices */
const fromIndex = computed(() => {
  if (!displayTotal.value) return 0
  return Math.min((page.value - 1) * pageSize.value, Math.max(0, displayTotal.value - 1))
})
const toIndex = computed(() => Math.min(page.value * pageSize.value, displayTotal.value))

/* page rows */
const pagedRows = computed(() =>
  props.server ? props.rows : filteredRows.value.slice(fromIndex.value, toIndex.value)
)

/* page-bounds guard (client only) */
const totalPages = computed(() => Math.max(1, Math.ceil(displayTotal.value / pageSize.value)))
watch([filteredRows, pageSize], () => {
  if (!props.server && page.value > totalPages.value) page.value = 1
})

/* select all on visible page */
const allPageSelected = computed(
  () =>
    pagedRows.value.length > 0 &&
    pagedRows.value.every((r) => selectedKeys.value.has(r[props.rowKey]))
)
const somePageSelected = computed(
  () =>
    pagedRows.value.some((r) => selectedKeys.value.has(r[props.rowKey])) && !allPageSelected.value
)
function toggleSelectAllPage(e: Event) {
  const checked = (e.target as HTMLInputElement).checked
  pagedRows.value.forEach((r) => {
    const k = r[props.rowKey]
    if (checked) selectedKeys.value.add(k)
    else selectedKeys.value.delete(k)
  })
  emit('update:selected', Array.from(selectedKeys.value))
}

/* row click */
function onRowClick(row: Row) {
  emit('row:click', row)
}

/* expose */
const colspanComputed = computed(() => normalizedHeaders.value.length + (props.selectable ? 1 : 0))
defineExpose({ clearSelection: () => selectedKeys.value.clear() })
</script>
