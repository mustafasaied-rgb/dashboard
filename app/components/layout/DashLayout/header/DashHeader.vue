<template>
  <header
    class="shadow-theme-sm sticky top-0 z-[999] flex w-full border-gray-200  bg-white lg:border-b dark:border-gray-800 dark:bg-gray-900"
  >
    <div class="flex grow flex-col items-center justify-between lg:flex-row lg:px-6">
      <div
        class="flex w-full items-center justify-between gap-2 border-b border-gray-200 px-3 py-3 sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-3 dark:border-gray-800"
      >
        <button
          @click="handleToggle"
          class="z-[999] flex h-10 w-10 items-center justify-center rounded-lg border-gray-200 text-gray-500 lg:h-11 lg:w-11 lg:border dark:border-gray-800 dark:text-gray-400"
          :class="[
            isMobileOpen
              ? 'bg-gray-100 lg:bg-transparent dark:bg-gray-800 dark:lg:bg-transparent'
              : ''
          ]"
        >
          <CloseMenuIcon v-if="isMobileOpen" />
          <BurgerMenuIcon class="rtl:rotate-180" v-else />
        </button>
        <HeaderLogo />
        <button
          @click="toggleApplicationMenu"
          class="z-[999] flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100 lg:hidden dark:text-gray-400 dark:hover:bg-gray-800"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M5.99902 10.4951C6.82745 10.4951 7.49902 11.1667 7.49902 11.9951V12.0051C7.49902 12.8335 6.82745 13.5051 5.99902 13.5051C5.1706 13.5051 4.49902 12.8335 4.49902 12.0051V11.9951C4.49902 11.1667 5.1706 10.4951 5.99902 10.4951ZM17.999 10.4951C18.8275 10.4951 19.499 11.1667 19.499 11.9951V12.0051C19.499 12.8335 18.8275 13.5051 17.999 13.5051C17.1706 13.5051 16.499 12.8335 16.499 12.0051V11.9951C16.499 11.1667 17.1706 10.4951 17.999 10.4951ZM13.499 11.9951C13.499 11.1667 12.8275 10.4951 11.999 10.4951C11.1706 10.4951 10.499 11.1667 10.499 11.9951V12.0051C10.499 12.8335 11.1706 13.5051 11.999 13.5051C12.8275 13.5051 13.499 12.8335 13.499 12.0051V11.9951Z"
              fill="currentColor"
            />
          </svg>
        </button>
        <!-- <SearchBar /> -->
      </div>

      <div
        :class="[isApplicationMenuOpen ? 'flex' : 'hidden']"
        class="shadow-theme-md w-full items-center justify-between gap-4 px-5 py-3 lg:flex lg:justify-end lg:px-0 lg:shadow-none"
      >
        <div class="2xsm:gap-3 flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggler />
          <!-- <NotificationMenu /> -->
        </div>
        <UserMenu />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useSidebar } from '@/composables/useSidebar'
import ThemeToggler from '~/components/common/ThemeToggler.vue'
import SearchBar from '~/components/layout/DashLayout/header/SearchBar.vue'
import HeaderLogo from '~/components/layout/DashLayout/header/HeaderLogo.vue'
import NotificationMenu from '~/components/layout/DashLayout/header/NotificationMenu.vue'
import UserMenu from '~/components/layout/DashLayout/header/UserMenu.vue'

const { toggleSidebar, toggleMobileSidebar, isMobileOpen } = useSidebar()

const handleToggle = () => {
  if (window.innerWidth >= 1024) {
    toggleSidebar()
  } else {
    toggleMobileSidebar()
  }
}

const dropdownOpen = ref(false)
const notifying = ref(false)

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
  notifying.value = false
}

const isApplicationMenuOpen = ref(false)

const toggleApplicationMenu = () => {
  isApplicationMenuOpen.value = !isApplicationMenuOpen.value
}
</script>
