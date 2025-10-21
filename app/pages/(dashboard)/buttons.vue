<template>
  <div class="space-y-5 sm:space-y-6">
    <PageBreadcrumb page-title="Buttons" />
    <ComponentCard title="Primary Button" class="space-y-2">
      <div class="flex flex-wrap gap-4 sm:items-center sm:justify-center">
        <Button size="sm" variant="solid"> Button Text </Button>
      </div>
      <div class="flex flex-wrap gap-4 sm:items-center sm:justify-center">
        <Button size="md" variant="solid"> Button Text </Button>
      </div>
    </ComponentCard>
    <ComponentCard title="Primary Button with Left Icon">
      <div class="flex items-center gap-5">
        <Button size="sm" variant="solid" :startIcon="BoxIcon"> Button Text </Button>
        <Button size="md" variant="solid" :startIcon="BoxIcon"> Button Text </Button>
      </div>
    </ComponentCard>
    <ComponentCard title="Primary Button with Right Icon">
      <div class="flex items-center gap-5">
        <Button size="sm" variant="solid" :endIcon="BoxIcon"> Button Text </Button>
        <Button size="md" variant="solid" :endIcon="BoxIcon"> Button Text </Button>
      </div>
    </ComponentCard>
    <ComponentCard title="Primary Button">
      <div class="flex items-center gap-5">
        <Button size="sm" variant="outline"> Button Text </Button>
        <Button size="md" variant="outline"> Button Text </Button>
      </div>
    </ComponentCard>
    <ComponentCard title="Primary Button with Left Icon">
      <div class="flex items-center gap-5">
        <Button size="sm" variant="outline" :startIcon="BoxIcon"> Button Text </Button>
        <Button size="md" variant="outline" :startIcon="BoxIcon"> Button Text </Button>
      </div>
    </ComponentCard>
    <ComponentCard title="Primary Button with Right Icon">
      <div class="flex items-center gap-5">
        <Button size="sm" variant="outline" :endIcon="BoxIcon"> Button Text </Button>
        <Button size="md" variant="outline" :endIcon="BoxIcon"> Button Text </Button>
      </div>
    </ComponentCard>
    <ComponentCard title="Primary Button with start and end  Icon slot">
      <div class="flex items-center gap-5">
        <Button size="sm" variant="outline">
          <template #start>
            <BoxIcon />
          </template>
          Button Text
        </Button>
        <Button size="sm" variant="outline">
          <template #end>
            <BoxIcon />
          </template>
          Button Text
        </Button>
      </div>
    </ComponentCard>
    <ComponentCard title="Primary Button with loading">
      <div class="flex items-center gap-5">
        <Button size="sm" variant="outline" loading> Button Text </Button>
      </div>
    </ComponentCard>
    <ComponentCard title="icon button">
      <div class="flex items-center gap-5">
        <Button rounded variant="outline" size="icon" class="bg-transparent">
          <BellIcon />
        </Button>
      </div>
    </ComponentCard>
    <ComponentCard title="none button">
      <div class="flex items-center gap-5">
        <Button variant="ghost" size="sm" class="!p-0">
          <template #start>
            <BoxIcon />
          </template>
          <span class="text-theme-sm me-1 block font-medium">Mustafa</span>
        </Button>
      </div>
    </ComponentCard>
    <ComponentCard v-for="btnV in ButtonVariant" :title="btnV">
      <div class="flex flex-wrap items-center gap-5">
        <Button v-for="btnC in ButtonColor" :variant="btnV" :color="btnC" size="sm">
          <template #start>
            <BoxIcon  />
          </template>
          <span class="text-theme-sm me-1 block font-medium">{{ btnC }}</span>
        </Button>
      </div>
    </ComponentCard>
  </div>
</template>

<script setup lang="ts">
import { BoxIcon } from '~/components/icons'

const ButtonVariant = ['solid', 'outline', 'ghost', 'link'] as const
const ButtonColor = ['primary', 'success', 'error', 'warning', 'info', 'gray', 'dark'] as const
</script>

<style></style>
