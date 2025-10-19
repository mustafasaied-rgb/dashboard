<template>
  <AdvancedBaseTable
    :rows="rows"
    :headers="headers"
    rowKey="id"
    :selectable="true"
    :searchKeys="['name', 'email', 'position', 'office', 'status']"
    @row:click="(r) => console.log('row click', r)"
    @update:selected="(keys) => (selected = keys)"
  >
    <!-- actions in toolbar -->
    <template #actions>
      <Button variant="outline" color="gray">
        Download
        <svg class="ms-1 h-4 w-4" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 3v12m0 0-4-4m4 4 4-4M5 21h14"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="round"
          />
        </svg>
      </Button>
    </template>

    <!-- header override for 'salary' -->
    <template #header.salary>
      <p
        class="text-theme-xs inline-flex items-center gap-1 font-medium text-gray-500 dark:text-gray-400"
      >
        Salary
        <svg class="h-3.5 w-3.5 opacity-60" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 12l-4-4h8l-4 4z" />
        </svg>
      </p>
    </template>

    <!-- cell: name (avatar + two lines) -->
    <template #cell.name="{ row }">
      <div class="flex items-center gap-3">
        <div class="h-10 w-10 overflow-hidden rounded-full bg-gray-200"></div>
        <div>
          <span class="text-theme-sm block font-medium text-gray-800 dark:text-white/90">{{
            row.name
          }}</span>
          <span class="text-theme-xs block text-gray-500 dark:text-gray-400">{{ row.email }}</span>
        </div>
      </div>
    </template>

    <!-- cell: status (badge) -->
    <template #cell.status="{ value }">
      <span
        :class="[
          'text-theme-xs rounded-full px-2 py-0.5 font-medium',
          value === 'Hired' &&
            'bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-500',
          value === 'Pending' &&
            'bg-warning-50 text-warning-700 dark:bg-warning-500/15 dark:text-warning-400'
        ]"
      >
        {{ value }}
      </span>
    </template>

    <!-- cell: action (icons) -->
    <template #cell.action="{ row }">
      <div class="flex items-center justify-center gap-3 text-gray-400">
        <Button
          title="Delete"
          @click.stop="$emit('delete', row)"
          variant="ghost"
          color="error"
          size="sm"
        >
          <DeleteIcon />
        </Button>
        <Button
          title="Edit"
          @click.stop="$emit('edit', row)"
          variant="ghost"
          color="primary"
          size="sm"
        >
          <EditIcon />
        </Button>
      </div>
    </template>
  </AdvancedBaseTable>
</template>

<script setup lang="ts">
import AdvancedBaseTable, { type TableHeader } from '~/components/ui/table/AdvancedBaseTable.vue'

definePageMeta({
  layout: 'dashboard'
})

const rows = ref(
  Array.from({ length: 50 }, (_, i) => ({
    id: i,
    name: `Abram Schleifer ${i}`,
    email: 'demoemail@gmail.com',
    position: 'Software Engineer',
    salary: '$89,500',
    office: 'Edinburgh',
    status: 'Hired'
  }))
)
const headers: TableHeader[] = [
  { key: 'name', title: 'User', width: '280px', align: 'start' },
  { key: 'position', title: 'Position' },
  { key: 'salary', title: 'Salary', align: 'end' },
  { key: 'office', title: 'Office' },
  { key: 'status', title: 'Status', align: 'center' },
  { key: 'action', title: 'Action', align: 'center' } // virtual column (rendered via slot)
]
const selected = ref<(string | number)[]>([])
watch(
  selected,
  (selected) => {
    console.log('selected', selected)
  },
  { deep: true }
)
</script>

<style></style>
