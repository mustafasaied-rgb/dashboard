<script setup lang="ts">
import { ChevronDownIcon } from '~/components/icons'

const props = defineProps<{
  icon: any
  name: string
  path?: string
  subItems?: any[]
  isOpen?: boolean
  isActive?: boolean
  collapsed?: boolean
}>()

const emit = defineEmits<{ (e: 'toggle'): void }>()
</script>

<template>
  <li>
    <!-- Parent item (button) -->
    <button
      v-if="subItems"
      type="button"
      @click="emit('toggle')"
      class="menu-item group w-full"
      :class="[
        isOpen ? 'menu-item-active' : 'menu-item-inactive',
        collapsed ? 'lg:justify-center' : 'lg:justify-start'
      ]"
      :aria-expanded="isOpen ? 'true' : 'false'"
    >
      <span :class="[isOpen ? 'menu-item-icon-active' : 'menu-item-icon-inactive']">
        <component v-if="icon" :is="icon" />
        <i v-else>*</i>
      </span>

      <span v-if="!collapsed" class="menu-item-text">{{ name }}</span>

      <ChevronDownIcon
        v-if="!collapsed"
        class="ml-auto h-5 w-5 transition-transform duration-200"
        :class="[{ 'text-brand-500 rotate-180': isOpen }]"
      />
    </button>

    <!-- Leaf item (link) -->
    <NuxtLink
      v-else
      :to="path!"
      class="menu-item group"
      :class="[isActive ? 'menu-item-active' : 'menu-item-inactive']"
    >
      <span :class="[isActive ? 'menu-item-icon-active' : 'menu-item-icon-inactive']">
        <component v-if="icon" :is="icon" />
        <i v-else>*</i>
      </span>
      <span v-if="!collapsed" class="menu-item-text">{{ name }}</span>
    </NuxtLink>

    <!-- 🔽 Submenu passed from parent (renders only for parents) -->
    <slot v-if="subItems" />
  </li>
</template>
