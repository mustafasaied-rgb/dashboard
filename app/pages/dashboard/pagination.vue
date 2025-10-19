<template>
  <div class="space-y-5 sm:space-y-6">
    <PageBreadcrumb page-title="Pagination" />
    <ComponentCard title="1) Basic (numbers + “Previous/Next” labels on ≥sm)">
      <Pagination v-model:page="page" :total="200" :pageSize="10" />
    </ComponentCard>
    <ComponentCard title="2) Icons-only arrows (no text at any size)">
      <Pagination v-model:page="page" :total="200" :pageSize="10" arrowMode="icon" />
    </ComponentCard>
    <ComponentCard title="3) Text-only arrows (no icons)">
      <Pagination v-model:page="page" :total="200" :pageSize="10" arrowMode="text" />
    </ComponentCard>
    <ComponentCard title="4) Always show icon + text (no responsive hide)">
      <Pagination v-model:page="page" :total="200" :pageSize="10" arrowMode="both" />
    </ComponentCard>
    <ComponentCard title="5) Custom icons (e.g., Lucide, your SVGs)">
      <Pagination v-model:page="page" :total="200" :pageSize="10" arrowMode="icon">
        <template #prev-icon>
          <!-- your custom left icon -->
          <svg width="18" height="18" viewBox="0 0 24 24" class="fill-current rtl:scale-x-[-1]">
            <path d="M15 6l-6 6 6 6"></path>
          </svg>
        </template>

        <template #next-icon>
          <!-- your custom right icon -->
          <svg width="18" height="18" viewBox="0 0 24 24" class="fill-current rtl:scale-x-[-1]">
            <path d="M9 6l6 6-6 6"></path>
          </svg>
        </template>
      </Pagination>
    </ComponentCard>
    <ComponentCard title="6) Localized labels (slot the text)">
      <Pagination v-model:page="page" :total="200" :pageSize="10" arrowMode="both">
        <template #prev-text>السابق</template>
        <template #next-text>التالي</template>
      </Pagination>
    </ComponentCard>
    <ComponentCard title="7) Custom page pill (e.g., make current page pill bigger / add tooltip)">
      <Pagination v-model:page="page" :total="200" :pageSize="10">
        <template #page="{ value, active, go }">
          <button
            @click="go"
            :aria-current="active ? 'page' : undefined"
            class="flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition focus-visible:outline-none"
            :class="
              active
                ? 'bg-brand-500 text-white shadow-[--shadow-theme-xs]'
                : 'hover:bg-brand-500 text-gray-700 hover:text-white dark:text-gray-400 dark:hover:text-white'
            "
            :title="`Go to page ${value}`"
          >
            {{ value }}
          </button>
        </template>
      </Pagination>
    </ComponentCard>
  </div>
</template>

<script setup lang="ts">
import { BoxIcon } from '~/components/icons'
definePageMeta({
  layout: 'dashboard'
})
const page = ref(1)
// const onPageChange = (e) => {
//   console.log('onPageChange--->e', e)
// }
watch(page, (page) => console.log('page', page), { deep: true, immediate: true })
</script>

<style></style>
