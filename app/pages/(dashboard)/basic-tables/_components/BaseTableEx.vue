<template>
  <BaseTable
    :rows="rows"
    rowKey="id"
    :searchKeys="['name', 'email', 'project', 'office', 'status']"
    @update:selected="(keys) => (selected = keys)"
  >
    <!-- Actions (top-right) -->
    <template #actions>
      <Button variant="outline" color="gray">
        Download
        <svg class="ms-1 h-4 w-4" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 3v12m0 0-4-4m4 4 4-4M5 21h14"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </Button>
    </template>

    <!-- Header -->
    <template #thead>
      <th class="px-5 py-3 text-left sm:px-6">
        <p class="text-theme-xs font-medium text-gray-500 dark:text-gray-400">User</p>
      </th>
      <th class="px-5 py-3 text-left sm:px-6">
        <p class="text-theme-xs font-medium text-gray-500 dark:text-gray-400">Position</p>
      </th>
      <th class="px-5 py-3 text-left sm:px-6">
        <p class="text-theme-xs font-medium text-gray-500 dark:text-gray-400">Salary</p>
      </th>
      <th class="px-5 py-3 text-left sm:px-6">
        <p class="text-theme-xs font-medium text-gray-500 dark:text-gray-400">Office</p>
      </th>
      <th class="px-5 py-3 text-left sm:px-6">
        <p class="text-theme-xs font-medium text-gray-500 dark:text-gray-400">Status</p>
      </th>
      <th class="px-5 py-3 text-left sm:px-6">
        <p class="text-theme-xs font-medium text-gray-500 dark:text-gray-400">Action</p>
      </th>
    </template>

    <!-- Row -->
    <template #row="{ row }">
      <!-- User -->
      <td class="px-5 py-4 sm:px-6">
        <div class="flex items-center gap-3">
          <img :src="row.avatar" :alt="row.name" class="h-10 w-10 rounded-full object-cover" />
          <div class="min-w-[160px]">
            <span class="text-theme-sm block font-medium text-gray-800 dark:text-white/90">{{
              row.name
            }}</span>
            <span class="text-theme-xs block text-gray-500 dark:text-gray-400">{{
              row.email
            }}</span>
          </div>
        </div>
      </td>

      <!-- Position -->
      <td class="text-theme-sm px-5 py-4 text-gray-500 sm:px-6 dark:text-gray-400">
        {{ row.role }}
      </td>

      <!-- Salary -->
      <td class="text-theme-sm px-5 py-4 text-gray-500 sm:px-6 dark:text-gray-400">
        {{ row.salary }}
      </td>

      <!-- Office -->
      <td class="text-theme-sm px-5 py-4 text-gray-500 sm:px-6 dark:text-gray-400">
        {{ row.office }}
      </td>

      <!-- Status -->
      <td class="px-5 py-4 sm:px-6">
        <span
          :class="[
            'text-theme-xs rounded-full px-2 py-0.5 font-medium',
            row.status === 'Hired' &&
              'bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-500',
            row.status === 'Pending' &&
              'bg-warning-50 text-warning-700 dark:bg-warning-500/15 dark:text-warning-400'
          ]"
          >{{ row.status }}</span
        >
      </td>

      <!-- Action -->
      <td class="px-5 py-4 sm:px-6">
        <div class="flex items-center gap-3 text-gray-400">
          <Button title="Delete" variant="ghost" color="gray" size="sm">
            <DeleteIcon />
          </Button>
          <Button title="Edit" variant="ghost" color="gray" size="sm">
            <EditIcon />
          </Button>
        </div>
      </td>
    </template>
  </BaseTable>
</template>

<script setup lang="ts">

const rows = ref(
  Array.from({ length: 50 }, (_, i) => ({
    id: i,
    name: `Lindsey Curtis ${i}`,
    email: 'demoemail@gmail.com',
    role: 'Web Designer',
    avatar: '/images/user/user-17.jpg',
    project: 'Agency Website',
    team: ['/images/user/user-22.jpg', '/images/user/user-23.jpg', '/images/user/user-24.jpg'],
    status: 'Hired',
    salary: '$89,500',
    office: 'Edinburgh'
  }))
)

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
