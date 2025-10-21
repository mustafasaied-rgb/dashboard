<template>
  <div class="min-h-screen xl:flex">
    <dash-sidebar />
    <Backdrop />
    <div
      :class="[
        'min-w-0 flex-1 transition-all duration-300 ease-in-out',
        // 'overflow-x-hidden',//disable stikey dash-header
        isExpanded || isHovered
          ? 'lg:ms-[var(--side-open-width)]'
          : 'lg:ms-[var(--side-close-width)]'
      ]"
    >
      <dash-header />
      <div class="mx-auto w-full max-w-(--breakpoint-2xl) overflow-x-hidden p-4 md:p-6">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import Backdrop from './Backdrop.vue'
const { isExpanded, isHovered } = useSidebar()
</script>
<style>
:root {
  --side-open-width: 290px;
  --side-close-width: 70px;
}
</style>
