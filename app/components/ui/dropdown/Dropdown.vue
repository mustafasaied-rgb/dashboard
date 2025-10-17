<template>
  <FloatingWrapper
    v-model="internalOpen"
    :placement="placement"
    :offset="6"
    :matchWidth="true"
    :closeOnClickOutside="true"
  >
    <template #trigger="{ open, toggle, openFn, close }">
      <slot name="trigger" :open="open" :toggle="toggle" :openFn="openFn" :close="close" />
    </template>

    <template #floating="{ open, close }">
      <div
        v-show="open"
        class="shadow-theme-lg dark:bg-gray-dark rounded-2xl border border-gray-200 bg-white p-3 dark:border-gray-800"
        :class="[panelClass, sameWidth ? 'w-full' : '']"
      >
        <slot :open="open" :closeFn="close" />
      </div>
    </template>
  </FloatingWrapper>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    open?: boolean
    placement?:
      | 'bottom-start'
      | 'bottom-end'
      | 'top-start'
      | 'top-end'
      | 'right-start'
      | 'left-start'
    sameWidth?: boolean
    offset?: number // vertical gap in px
    panelClass?: string // extra classes for panel
    closeOnClickOutside?: boolean
    closeOnEsc?: boolean
  }>(),
  {
    open: undefined,
    placement: 'bottom-end',
    sameWidth: false,
    offset: 12,
    panelClass: '',
    closeOnClickOutside: true,
    closeOnEsc: true
  }
)

const emit = defineEmits<{
  (e: 'update:open', v: boolean): void
  (e: 'open-change', v: boolean): void
}>()

const internalOpen = ref(false)
</script>
<style scoped></style>
