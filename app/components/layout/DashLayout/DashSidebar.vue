<template>
  <aside
    :class="[
      'fixed top-0 left-0 z-[999] mt-16 flex h-screen flex-col border-r border-gray-200 bg-white px-5 text-gray-900 transition-all duration-300 ease-in-out lg:mt-0 dark:border-gray-800 dark:bg-gray-900',
      {
        'lg:w-[290px]': isExpanded || isMobileOpen || isHovered,
        'lg:w-[90px]': !isExpanded && !isHovered,
        'w-[290px] translate-x-0': isMobileOpen,
        '-translate-x-full': !isMobileOpen,
        'lg:translate-x-0': true
      }
    ]"
    @mouseenter="!isExpanded && (isHovered = true)"
    @mouseleave="isHovered = false"
  >
    <div :class="['flex py-8', !isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start']">
      <NuxtLink to="/">
        <!-- <img
          v-if="isExpanded || isHovered || isMobileOpen"
          class="dark:hidden"
          src="/images/logo/logo.svg"
          alt="Logo"
          width="150"
          height="40"
        />
        <img
          v-if="isExpanded || isHovered || isMobileOpen"
          class="hidden dark:block"
          src="/images/logo/logo-dark.svg"
          alt="Logo"
          width="150"
          height="40"
        /> -->
        <img   src="/images/logo/logo-icon.svg" alt="Logo" width="32" height="32" />
      </NuxtLink>
    </div>
    <div class="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
      <nav class="mb-6">
        <div class="flex flex-col gap-4">
          <div v-for="(menuGroup, groupIndex) in menuGroups" :key="groupIndex">
            <h2
              :class="[
                'mb-4 flex text-xs leading-[20px] text-gray-400 uppercase',
                !isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start'
              ]"
            >
              <template v-if="isExpanded || isHovered || isMobileOpen">
                {{ menuGroup.title }}
              </template>
              <HorizontalDots v-else />
            </h2>
            <ul class="flex flex-col gap-4">
              <MenuItem
                v-for="(item, index) in menuGroup.items"
                :key="item.name"
                :icon="item.icon"
                :name="item.name"
                :path="item.path"
                :sub-items="item.subItems"
                :is-open="isSubmenuOpen(groupIndex, index)"
                :is-active="item.path ? isActive(item.path) : false"
                :collapsed="!isExpanded && !isHovered && !isMobileOpen"
                @toggle="toggleSubmenu(groupIndex, index)"
              >
                <!-- nested submenu goes here -->
                <ul
                  v-show="
                    isSubmenuOpen(groupIndex, index) && (isExpanded || isHovered || isMobileOpen)
                  "
                  class="mt-2 ml-9 space-y-1"
                >
                  <MenuItem
                    v-for="sub in item.subItems"
                    :key="sub.name"
                    :icon="undefined"
                    :name="sub.name"
                    :path="sub.path"
                    :is-active="isActive(sub.path)"
                    :collapsed="!isExpanded && !isHovered && !isMobileOpen"
                  />
                </ul>
              </MenuItem>
            </ul>
          </div>
        </div>
      </nav>
      <SidebarWidget v-if="isExpanded || isHovered || isMobileOpen" />
    </div>
  </aside>
</template>

<script setup>
import {
  GridIcon,
  CalenderIcon,
  UserCircleIcon,
  PieChartIcon,
  HorizontalDots,
  PageIcon,
  TableIcon,
  ListIcon,
  PlugInIcon
} from '~/components/icons/index'
import SidebarWidget from './SidebarWidget.vue'

const route = useRoute()

const { isExpanded, isMobileOpen, isHovered, openSubmenu } = useSidebar()

const menuGroups = [
  {
    title: 'Menu',
    items: [
      {
        icon: GridIcon,
        name: 'Dashboard',
        subItems: [{ name: 'Ecommerce', path: '/dashboard', pro: false }]
      },
      {
        icon: CalenderIcon,
        name: 'Calendar',
        path: '/calendar'
      },
      {
        icon: UserCircleIcon,
        name: 'User Profile',
        path: '/profile'
      },

      {
        name: 'Forms',
        icon: ListIcon,
        subItems: [{ name: 'Form Elements', path: '/form-elements', pro: false }]
      },
      {
        name: 'Tables',
        icon: TableIcon,
        subItems: [{ name: 'Basic Tables', path: '/basic-tables', pro: false }]
      },
      {
        name: 'Pages',
        icon: PageIcon,
        subItems: [
          { name: 'Black Page', path: '/blank', pro: false },
          { name: '404 Page', path: '/error-404', pro: false }
        ]
      }
    ]
  },
  {
    title: 'Others',
    items: [
      {
        icon: PieChartIcon,
        name: 'Charts',
        subItems: [
          { name: 'Line Chart', path: '/line-chart', pro: false },
          { name: 'Bar Chart', path: '/bar-chart', pro: false }
        ]
      },
      {
        icon: PieChartIcon,
        name: 'Ui Elements',
        subItems: [
          { name: 'Alerts', path: '/alerts', pro: false },
          { name: 'Avatars', path: '/avatars', pro: false },
          { name: 'Badge', path: '/badge', pro: false },
          { name: 'Buttons', path: '/buttons', pro: false },
          { name: 'Images', path: '/images', pro: false },
          { name: 'Videos', path: '/videos', pro: false }
        ]
      },
      {
        icon: PlugInIcon,
        name: 'Authentication',
        subItems: [
          { name: 'Signin', path: '/signin', pro: false },
          { name: 'Signup', path: '/signup', pro: false }
        ]
      }
    ]
  }
]

const isActive = (path) => route.path === path

const toggleSubmenu = (groupIndex, itemIndex) => {
  const key = `${groupIndex}-${itemIndex}`
  openSubmenu.value = openSubmenu.value === key ? null : key
}

const isAnySubmenuRouteActive = computed(() => {
  return menuGroups.some((group) =>
    group.items.some(
      (item) => item.subItems && item.subItems.some((subItem) => isActive(subItem.path))
    )
  )
})

const isSubmenuOpen = (groupIndex, itemIndex) => {
  const key = `${groupIndex}-${itemIndex}`
  return (
    openSubmenu.value === key ||
    (isAnySubmenuRouteActive.value &&
      menuGroups[groupIndex].items[itemIndex].subItems?.some((subItem) => isActive(subItem.path)))
  )
}
</script>
