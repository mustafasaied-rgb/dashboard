<template>
  <Dropdown ref="dropdownRef" placement="bottom-end" :offset="17" :panel-class="'w-[260px]'">
    <template #trigger="{ open }">
      <Button variant="ghost" size="sm" color="gray" class="!flex items-center !p-0">
        <template #start>
          <Avatar class="overflow-hidden" :src="'/images/user/owner.jpg'" size="medium" />
        </template>
        <span class="text-theme-sm me-1 block font-medium"> Mustafa </span>
        <ChevronDownIcon :class="[open && 'rotate-180', 'transition-all']" />
      </Button>
    </template>

    <template #default="{ closeFn }">
      <div>
        <span class="text-theme-sm theme-text-medium block font-medium">Mustafa Saied</span>
        <span class="text-theme-xs theme-text-muted mt-0.5 block">mustafasaied749@gmail.com</span>
      </div>

      <ul class="flex flex-col gap-1 border-b border-gray-200 pt-4 pb-3 dark:border-gray-800">
        <li v-for="it in menuItems" :key="it.to">
          <DropdownItem :to="it.to">
            <component :is="it.icon" />
            {{ it.text }}
          </DropdownItem>
        </li>
      </ul>

      <DropdownItem @click="() => signOut(closeFn)" class="mt-3">
        <LogoutIcon
          class="text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300"
        />
        Sign out
      </DropdownItem>
    </template>
  </Dropdown>
</template>

<script setup>
import {
  UserCircleIcon,
  SettingsIcon,
  ChevronDownIcon,
  InfoCircleIcon
} from '~/components/icons/index'
// const dropdownRef = ref(null)
const menuItems = [
  { href: '/profile', icon: UserCircleIcon, text: 'Edit profile' },
  { href: '/chat', icon: SettingsIcon, text: 'Account settings' },
  { href: '/profile', icon: InfoCircleIcon, text: 'Support' }
]
const signOut = () => {
  console.log('Signing out...')
  // dropdownRef.value.closeFn()
}
</script>
