<template>
  <div
    class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
  >
    <!-- Toolbar -->
    <div class="flex items-center justify-between gap-3 p-4 sm:p-5">
      <div class="flex items-center gap-2">
        <label class="text-sm text-gray-500 dark:text-gray-400">Show</label>
        <BaseSelect
          containerClass="w-[70px] !p-0 !m-0"
          variant="outlined"
          size="sm"
          v-model="pageSize"
          :options="pageSizeOptions.map((i) => ({ label: String(i), value: i }))"
        />
        <span class="text-sm text-gray-500 dark:text-gray-400">entries</span>
      </div>

      <div class="flex items-center gap-3">
        <BaseInput v-model="query" :placeholder="searchPlaceholder" size="sm">
          <template #start><SearchIcon /></template>
        </BaseInput>
        <slot name="actions" />
      </div>
    </div>

    <!-- Table -->
    <div class="custom-scrollbar max-w-full overflow-x-auto">
      <table class="min-w-full">
        <thead>
          <!-- full header override -->
          <slot name="header">
            <tr class="border-y border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
              <th v-if="selectable" class="w-10 px-5 py-3 sm:px-6">
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
                    col.align === 'end' && 'text-right',
                    col.align === 'start' && 'text-start',
                    col.class
                  ]"
                >
                  <!-- single header cell override -->
                  <slot :name="`header.${col.key}`">
                    <p class="text-theme-xs font-medium text-gray-500 dark:text-gray-400">
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
            <td v-if="selectable" class="px-5 py-4 sm:px-6">
              <BaseCheckbox :model-value="isSelected(row)" @change="toggleRow(row)" />
            </td>

            <!-- dynamic cells -->
            <template v-for="col in normalizedHeaders" :key="col.key">
              <td
                class="px-5 py-4 sm:px-6"
                :class="[
                  col.align === 'center' && 'text-center',
                  col.align === 'end' && 'text-right',
                  col.cellClass
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
    <div class="flex flex-col items-center justify-between gap-3 px-4 py-4 sm:flex-row sm:px-5">
      <div class="text-sm text-gray-500 dark:text-gray-400">
        Showing
        <span class="font-medium text-gray-700 dark:text-gray-300">{{ fromIndex + 1 }}</span>
        to
        <span class="font-medium text-gray-700 dark:text-gray-300">{{ toIndex }}</span>
        of
        <span class="font-medium text-gray-700 dark:text-gray-300">{{ filteredRows.length }}</span>
        entries
      </div>

      <Pagination
        :page="page"
        :total="filteredRows.length"
        :page-size="pageSize"
        @update:page="(p: number) => (page = p)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Pagination from '@/components/ui/Pagination.vue'

type Align = 'start' | 'center' | 'end'
export type TableHeader<Row = Record<string, any>> = {
  /** field key in row */
  key: keyof Row & string
  /** text to show in header cell */
  title: string
  width?: string
  align?: Align
  /** extra classes */
  class?: string
  cellClass?: string
  /** default formatter for this cell (when no slot provided) */
  formatter?: (value: any, row: Row) => any
}

type Row = Record<string, any>

type Props = {
  rows: Row[]
  rowKey: string
  headers: TableHeader<Row>[]
  selectable?: boolean
  searchKeys?: string[]
  pageSizeOptions?: number[]
  initialPageSize?: number
  searchPlaceholder?: string
  emptyText?: string
  /** enable row hover effect */
  hoverable?: boolean
  /** optional row class resolver */
  rowClass?: (row: Row) => string | undefined
}

const props = withDefaults(defineProps<Props>(), {
  selectable: true,
  searchKeys: () => [],
  pageSizeOptions: () => [10, 20, 50, 100],
  initialPageSize: 10,
  searchPlaceholder: 'Search…',
  emptyText: 'No results found',
  hoverable: true
})

const emit = defineEmits<{
  (e: 'update:selected', keys: (string | number)[]): void
  (e: 'row:toggle', row: Row, selected: boolean): void
  (e: 'row:click', row: Row): void
}>()

/* search + pagination */
const query = ref('')
const page = ref(1)
const pageSize = ref(props.initialPageSize)

/* computed headers once */
const normalizedHeaders = computed(() => props.headers ?? [])

/* selection */
const selectedKeys = ref<Set<string | number>>(new Set())

/* filtering */
const filteredRows = computed(() => {
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

/* pagination */
const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredRows.value.length / pageSize.value))
)
watch([filteredRows, pageSize], () => {
  if (page.value > totalPages.value) page.value = 1
})

const fromIndex = computed(() =>
  Math.min((page.value - 1) * pageSize.value, Math.max(0, filteredRows.value.length - 1))
)
const toIndex = computed(() => Math.min(page.value * pageSize.value, filteredRows.value.length))

const pagedRows = computed(() => filteredRows.value.slice(fromIndex.value, toIndex.value))

/* selection helpers */
const isSelected = (row: Row) => selectedKeys.value.has(row[props.rowKey])
function toggleRow(row: Row) {
  const key = row[props.rowKey]
  if (selectedKeys.value.has(key)) selectedKeys.value.delete(key)
  else selectedKeys.value.add(key)
  emit('row:toggle', row, selectedKeys.value.has(key))
  emit('update:selected', Array.from(selectedKeys.value))
}
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

/* footer helpers */
const colspanComputed = computed(() => normalizedHeaders.value.length + (props.selectable ? 1 : 0))

/* row click */
function onRowClick(row: Row) {
  emit('row:click', row)
}

/* expose */
defineExpose({ clearSelection: () => selectedKeys.value.clear() })
</script>
