<template>
  <div
    class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
  >
    <!-- Top toolbar -->
    <div class="flex items-center justify-between gap-3 p-4 sm:p-5">
      <div class="flex items-center gap-2">
        <label class="text-sm text-gray-500 dark:text-gray-400">Show</label>
        <BaseSelect
          containerClass="  w-[70px] !p-0 !m-0"
          variant="outlined"
          size="sm"
          v-model="pageSize"
          :options="pageSizeOptions.map((i) => ({ label: String(i), value: i }))"
        />
        <span class="text-sm text-gray-500 dark:text-gray-400">entries</span>
      </div>

      <div class="flex items-center gap-3">
        <div class="relative">
          <BaseInput v-model="query" :placeholder="searchPlaceholder" size="sm">
            <template #start>
              <SearchIcon />
            </template>
          </BaseInput>
        </div>
        <slot name="actions" />
      </div>
    </div>

    <!-- Table -->
    <div class="custom-scrollbar max-w-full overflow-x-auto">
      <table class="min-w-full">
        <thead>
          <tr class="border-y border-gray-200 dark:border-gray-700">
            <!-- Selection column -->
            <th v-if="selectable" class="w-10 px-5 py-3 sm:px-6">
              <BaseCheckbox
                :indeterminate="somePageSelected"
                @change="toggleSelectAllPage"
                :model-value="allPageSelected"
              />
            </th>

            <!-- Columns header slot (required) -->
            <slot name="thead" />
          </tr>
        </thead>

        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
          <tr
            v-for="row in pagedRows"
            :key="row[rowKey]"
            class="border-t border-gray-100 dark:border-gray-800"
          >
            <!-- Selection cell -->
            <td v-if="selectable" class="px-5 py-4 sm:px-6">
              <BaseCheckbox @change="toggleRow(row)" :model-value="isSelected(row)" />
            </td>

            <!-- Row cells (scoped slot with row) -->
            <slot name="row" :row="row" />
          </tr>

          <tr v-if="!pagedRows.length">
            <td
              :colspan="colspan"
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

type Row = Record<string, any>

type Props = {
  rows: Row[]
  /** unique key in each row */
  rowKey: string
  /** enable checkbox selection */
  selectable?: boolean
  /** fields to search inside; if empty => stringifies row */
  searchKeys?: string[]
  /** page size options */
  pageSizeOptions?: number[]
  /** initial page size */
  initialPageSize?: number
  /** header cell count for empty state colspan */
  colspan?: number
  searchPlaceholder?: string
  emptyText?: string
}

const props = withDefaults(defineProps<Props>(), {
  selectable: true,
  searchKeys: () => [],
  pageSizeOptions: () => [10, 20, 50, 100],
  initialPageSize: 10,
  colspan: 6,
  searchPlaceholder: 'Search…',
  emptyText: 'No results found'
})

const emit = defineEmits<{
  (e: 'update:selected', keys: (string | number)[]): void
  (e: 'row:toggle', row: Row, selected: boolean): void
}>()

/* search + pagination */
const query = ref('')
const page = ref(1)
const pageSize = ref(props.initialPageSize)

/* selection */
const selectedKeys = ref<Set<string | number>>(new Set())

/* filter rows */
const filteredRows = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return props.rows
  const keys = props.searchKeys
  return props.rows.filter((r) => {
    if (keys.length) {
      return keys.some((k) =>
        String(r[k] ?? '')
          .toLowerCase()
          .includes(q)
      )
    }
    return JSON.stringify(r).toLowerCase().includes(q)
  })
})

/* paginate */
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
    const key = r[props.rowKey]
    if (checked) selectedKeys.value.add(key)
    else selectedKeys.value.delete(key)
  })
  emit('update:selected', Array.from(selectedKeys.value))
}

/* expose method to clear selection if needed */
defineExpose({ clearSelection: () => selectedKeys.value.clear() })
</script>
