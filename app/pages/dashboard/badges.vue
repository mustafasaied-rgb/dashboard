<template>
  <div class="space-y-5 sm:space-y-6">
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <ComponentCard title="With Light Background">
      <div class="flex flex-wrap gap-4 sm:items-center sm:justify-center">
        <Badge v-for="color in colors" :key="color" :color="color">
          {{ color }}
        </Badge>
      </div>
    </ComponentCard>
    <ComponentCard title="With Solid Background">
      <div class="flex flex-wrap gap-4 sm:items-center sm:justify-center">
        <Badge v-for="color in colors" :key="color" :color="color" variant="solid">
          {{ color }}
        </Badge>
      </div>
    </ComponentCard>
    <ComponentCard title="Light Background with Left Icon">
      <div class="flex flex-wrap gap-4 sm:items-center sm:justify-center">
        <Badge v-for="color in colors" :key="color" :color="color" :startIcon="PlusIcon">
          {{ color }}
        </Badge>
      </div>
      <div class="flex flex-wrap gap-4 sm:items-center sm:justify-center">
        <Badge v-for="color in colors" :key="color" :color="color">
          {{ color }}
          <template #start> <PlusIcon /></template>
        </Badge>
      </div>
    </ComponentCard>
    <ComponentCard title="Solid Background with Left Icon">
      <div class="flex flex-wrap gap-4 sm:items-center sm:justify-center">
        <Badge
          v-for="color in colors"
          :key="color"
          :color="color"
          variant="solid"
          :startIcon="PlusIcon"
        >
          {{ color }}
        </Badge>
      </div>
    </ComponentCard>
    <ComponentCard title="Light Background with Right Icon">
      <div class="flex flex-wrap gap-4 sm:items-center sm:justify-center">
        <Badge v-for="color in colors" :key="color" :color="color" :endIcon="PlusIcon">
          {{ color }}
        </Badge>
      </div>
      <div class="flex flex-wrap gap-4 sm:items-center sm:justify-center">
        <Badge v-for="color in colors" :key="color" :color="color">
          {{ color }}
          <template #end> <PlusIcon /></template>
        </Badge>
      </div>
    </ComponentCard>
    <ComponentCard title="Solid Background with Right Icon">
      <div class="flex flex-wrap gap-4 sm:items-center sm:justify-center">
        <Badge
          v-for="color in colors"
          :key="color"
          :color="color"
          variant="solid"
          :endIcon="PlusIcon"
        >
          {{ color }}
        </Badge>
      </div>
    </ComponentCard>
  </div>
</template>

<script setup lang="ts">
import { PlusIcon } from '~/components/icons'

definePageMeta({
  layout: 'dashboard'
})
const colors = ['primary', 'success', 'error', 'warning', 'info', 'light', 'dark'] as const

const currentPageTitle = ref('Badges')
</script>

<style></style>
