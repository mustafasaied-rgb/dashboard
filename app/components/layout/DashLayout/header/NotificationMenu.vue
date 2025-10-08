<template>
  <Dropdown
    placement="bottom-end"
    :offset="17"
    :panel-class="'flex h-[480px] w-[350px] flex-col sm:w-[361px]'"
    @open-change="onOpenChange"
  >
    <template #trigger="{ toggle }">
      <button
        class="hover:text-dark-900 relative flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        @click="toggle"
      >
        <span
          :class="{ hidden: !notifying, flex: notifying }"
          class="absolute top-0.5 right-0 z-1 h-2 w-2 rounded-full bg-orange-400"
        >
          <span
            class="absolute -z-1 inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75"
          ></span>
        </span>
        <BellIcon />
      </button>
    </template>

    <template #default="{ closeFn }">
      <div
        class="mb-3 flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-800"
      >
        <h5 class="text-lg font-semibold text-gray-800 dark:text-white/90">Notification</h5>
        <button class="text-gray-500 dark:text-gray-400" @click="closeFn">
          <CloseIcon />
        </button>
      </div>

      <ul class="custom-scrollbar flex h-auto flex-col overflow-y-auto">
        <li v-for="n in notifications" :key="n.id">
          <DropdownItem
            :to="'#'"
            @click.prevent="closeFn"
            class="flex gap-3 rounded-lg border-b border-gray-100 p-3 px-4.5 py-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5"
          >
            <span class="relative z-1 block h-10 w-full max-w-10 rounded-full">
              <img :src="n.userImage" :alt="n.userName" class="overflow-hidden rounded-full" />
              <span
                :class="n.status === 'online' ? 'bg-success-500' : 'bg-error-500'"
                class="absolute right-0 bottom-0 z-10 h-2.5 w-full max-w-2.5 rounded-full border-[1.5px] border-white dark:border-gray-900"
              ></span>
            </span>
            <span class="block">
              <span class="text-theme-sm mb-1.5 block text-gray-500 dark:text-gray-400">
                <span class="font-medium text-gray-800 dark:text-white/90">{{ n.userName }}</span>
                {{ n.action }}
                <span class="font-medium text-gray-800 dark:text-white/90">{{ n.project }}</span>
              </span>
              <span class="text-theme-xs flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <span>{{ n.type }}</span
                ><span class="h-1 w-1 rounded-full bg-gray-400"></span><span>{{ n.time }}</span>
              </span>
            </span>
          </DropdownItem>
        </li>
      </ul>

      <NuxtLink
        to="#"
        class="text-theme-sm shadow-theme-xs mt-3 flex justify-center rounded-lg border border-gray-300 bg-white p-3 font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
        @click.prevent="closeFn"
      >
        View All Notification
      </NuxtLink>
    </template>
  </Dropdown>
</template>
<script setup>
import { ref } from 'vue'

const notifying = ref(true)

const notifications = ref([
  {
    id: 1,
    userName: 'Terry Franci',
    userImage: '/images/user/user-02.jpg',
    action: 'requests permission to change',
    project: 'Project - Nganter App',
    type: 'Project',
    time: '5 min ago',
    status: 'online'
  },
  {
    id: 2,
    userName: 'Terry Franci',
    userImage: '/images/user/user-03.jpg',
    action: 'requests permission to change',
    project: 'Project - Nganter App',
    type: 'Project',
    time: '5 min ago',
    status: 'offline'
  },
  {
    id: 3,
    userName: 'Terry Franci',
    userImage: '/images/user/user-04.jpg',
    action: 'requests permission to change',
    project: 'Project - Nganter App',
    type: 'Project',
    time: '5 min ago',
    status: 'online'
  },
  {
    id: 4,
    userName: 'Terry Franci',
    userImage: '/images/user/user-05.jpg',
    action: 'requests permission to change',
    project: 'Project - Nganter App',
    type: 'Project',
    time: '5 min ago',
    status: 'online'
  },
  {
    id: 5,
    userName: 'Terry Franci',
    userImage: '/images/user/user-06.jpg',
    action: 'requests permission to change',
    project: 'Project - Nganter App',
    type: 'Project',
    time: '5 min ago',
    status: 'offline'
  },
  {
    id: 6,
    userName: 'Terry Franci',
    userImage: '/images/user/user-07.jpg',
    action: 'requests permission to change',
    project: 'Project - Nganter App',
    type: 'Project',
    time: '5 min ago',
    status: 'online'
  },
  {
    id: 7,
    userName: 'Terry Franci',
    userImage: '/images/user/user-08.jpg',
    action: 'requests permission to change',
    project: 'Project - Nganter App',
    type: 'Project',
    time: '5 min ago',
    status: 'online'
  },
  {
    id: 7,
    userName: 'Terry Franci',
    userImage: '/images/user/user-09.jpg',
    action: 'requests permission to change',
    project: 'Project - Nganter App',
    type: 'Project',
    time: '5 min ago',
    status: 'online'
  }
])
</script>
