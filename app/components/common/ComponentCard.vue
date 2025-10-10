<template>
  <component
    :is="collapsible ? 'details' : 'div'"
    :open="collapsible ? defaultOpen : undefined"
    :class="[
      'rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]',
      collapsible ? 'group' : ''
    ]"
  >
    <!-- Header -->
    <template v-if="collapsible">
      <summary
        class="flex cursor-pointer list-none items-start justify-between gap-3 px-6 py-5 select-none"
      >
        <div>
          <slot name="summary">
            <h3 class="text-base font-medium text-gray-800 dark:text-white/90">{{ title }}</h3>
            <p v-if="desc" class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ desc }}</p>
          </slot>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          class="h-5 w-5 shrink-0 text-gray-500 transition-transform duration-200 group-open:rotate-180 dark:text-gray-400"
        >
          <path
            fill-rule="evenodd"
            d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.25a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08z"
            clip-rule="evenodd"
          />
        </svg>
      </summary>
    </template>
    <template v-else>
      <div class="px-6 py-5">
        <h3 class="text-base font-medium text-gray-800 dark:text-white/90">{{ title }}</h3>
        <p v-if="desc" class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ desc }}</p>
      </div>
    </template>

    <!-- Body -->
    <div
      v-bind="$attrs"
      :class="['border-t border-gray-100 p-4 sm:p-6 dark:border-gray-800', $attrs.class]"
    >
      <slot />
    </div>
  </component>
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false }) // <<< key line

interface Props {
  title: string
  desc?: string
  collapsible?: boolean
  defaultOpen?: boolean
}

withDefaults(defineProps<Props>(), {
  collapsible: false,
  defaultOpen: false
})
</script>

<style scoped>
summary::-webkit-details-marker {
  display: none;
}
</style>
