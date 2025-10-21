<template>
  <BaseTable
    :rows="rows"
    :headers="headers"
    headerCellVarient="bordered-b"
    variant="bordered-outer"
    :show-header="false"
    :show-pagination="false"
    :selectable="false"
  >
    <template #cell.name="{ row }">
      <div class="flex items-center gap-3">
        <div class="h-10 w-10 overflow-hidden rounded-full">
          <img :src="row.avatar" :alt="row.name" />
        </div>
        <div>
          <span class="text-theme-sm block font-medium text-gray-800 dark:text-white/90">
            {{ row.name }}
          </span>
          <span class="text-theme-xs block text-gray-500 dark:text-gray-400">
            {{ row.role }}
          </span>
        </div>
      </div>
    </template>
    <template #cell.project="{ row }">
      <p class="text-theme-sm text-gray-500 dark:text-gray-400">{{ row.project }}</p>
    </template>
    <template #cell.team="{ row }">
      <div class="flex -space-x-2">
        <div
          v-for="(member, memberIndex) in row.team"
          :key="memberIndex"
          class="h-6 w-6 overflow-hidden rounded-full border-2 border-white dark:border-gray-900"
        >
          <img :src="member" alt="team member" />
        </div>
      </div>
    </template>
    <template #cell.status="{ row }">
      <span
        :class="[
          'text-theme-xs rounded-full px-2 py-0.5 font-medium',
          {
            'bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-500':
              row.status === 'Active',
            'bg-warning-50 text-warning-700 dark:bg-warning-500/15 dark:text-warning-400':
              row.status === 'Pending',
            'bg-error-50 text-error-700 dark:bg-error-500/15 dark:text-error-500':
              row.status === 'Cancel'
          }
        ]"
      >
        {{ row.status }}
      </span>
    </template>
    <template #cell.budget="{ row }">
      <p class="text-theme-sm text-gray-500 dark:text-gray-400">{{ row.budget }}</p>
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BaseTable, { type TableHeader } from '~/components/ui/table/BaseTable.vue'

const rows = ref([
  {
    name: 'Lindsey Curtis',
    role: 'Web Designer',
    avatar: '/images/user/user-17.jpg',
    project: 'Agency Website',
    team: ['/images/user/user-22.jpg', '/images/user/user-23.jpg', '/images/user/user-24.jpg'],
    status: 'Active',
    budget: '3.9K'
  },
  {
    name: 'Kaiya George',
    role: 'Project Manager',
    avatar: '/images/user/user-18.jpg',
    project: 'Technology',
    team: ['/images/user/user-25.jpg', '/images/user/user-26.jpg'],
    status: 'Pending',
    budget: '24.9K'
  },
  {
    name: 'Zain Geidt',
    role: 'Content Writer',
    avatar: '/images/user/user-19.jpg',
    project: 'Blog Writing',
    team: ['/images/user/user-27.jpg'],
    status: 'Active',
    budget: '12.7K'
  },
  {
    name: 'Abram Schleifer',
    role: 'Digital Marketer',
    avatar: '/images/user/user-20.jpg',
    project: 'Social Media',
    team: ['/images/user/user-28.jpg', '/images/user/user-29.jpg', '/images/user/user-30.jpg'],
    status: 'Cancel',
    budget: '2.8K'
  },
  {
    name: 'Carla George',
    role: 'Front-end Developer',
    avatar: '/images/user/user-21.jpg',
    project: 'Website',
    team: ['/images/user/user-31.jpg', '/images/user/user-32.jpg', '/images/user/user-33.jpg'],
    status: 'Active',
    budget: '4.5K'
  }
])
const headers: TableHeader[] = [
  { key: 'name', title: 'User', align: 'start' },
  { key: 'role', title: 'Project Name', align: 'start' },
  { key: 'team', title: 'Team', align: 'start' },
  { key: 'status', title: 'Status', align: 'start' },
  { key: 'budget', title: 'Status', align: 'start' }
]
</script>

<style scoped>
</style>
