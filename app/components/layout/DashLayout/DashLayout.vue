<template>
  <div class="min-h-screen xl:flex">
    <dash-sidebar />
    <Backdrop />
    <div
      :class="[
        'flex-1  transition-all duration-300 ease-in-out',
        'overflow-x-hidden',//disable stikey dash-header
        isExpanded || isHovered ? 'lg:ml-[290px]' : 'lg:ml-[90px]'
      ]"
    >
      <dash-header />
      <div class="mx-auto max-w-(--breakpoint-2xl) p-4 md:p-6">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import Backdrop from './Backdrop.vue'
const { isExpanded, isHovered } = useSidebar()
</script>
