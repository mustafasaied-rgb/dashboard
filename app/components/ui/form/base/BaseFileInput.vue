<template>
  <div class="w-full">
    <!-- Label -->
    <label
      v-if="label"
      :for="id"
      class="ds-label"
      :class="disabled ? 'cursor-not-allowed opacity-60' : ''"
    >
      {{ label }}
      <span v-if="required" class="text-error-500" aria-hidden="true">*</span>
    </label>

    <!-- Shell -->
    <div
      class="ds-input relative flex items-stretch gap-3 overflow-hidden"
      :data-variant="variant"
      :data-status="status"
      :data-fixedsize="size"
      :data-disabled="disabled ? 'true' : 'false'"
    >
      <!-- File input -->
      <input
        :id="id"
        ref="inputEl"
        type="file"
        :multiple="multiple"
        :disabled="disabled"
        :class="['absolute inset-0 z-10 cursor-pointer opacity-0', 'sr-only']"
        @change="onFileChange"
      />

      <!-- Upload button -->
      <button
        type="button"
        class="z-0 flex h-full shrink-0 items-center rounded-s-[calc(var(--ds-input-radius)_-_2px)] border border-[var(--ds-input-divider)] bg-[color-mix(in_oklab,var(--color-gray-100)_40%,transparent)] px-3 text-sm font-medium text-[var(--ds-text)] hover:bg-[color-mix(in_oklab,var(--color-gray-100)_60%,transparent)] focus:outline-hidden dark:border-[var(--ds-input-divider-dark)] dark:bg-white/5 dark:hover:bg-white/10"
        :disabled="disabled"
        @click="onBrowseClick"
        :aria-controls="id"
      >
        <slot name="button-label">
          {{ buttonLabel }}
        </slot>
      </button>

      <!-- File names -->
      <div
        class="flex min-w-0 flex-1 flex-wrap items-center gap-2 overflow-hidden text-sm text-[var(--ds-text)]"
      >
        <span
          v-if="!selectedFiles.length"
          class="truncate text-[var(--ds-ph)] dark:text-[var(--ds-ph-dark)]"
        >
          {{ placeholder || 'No file chosen' }}
        </span>

        <template v-else>
          <span
            v-for="(file, i) in selectedFiles"
            :key="i"
            class="inline-flex items-center gap-1 rounded-full border border-[var(--ds-input-divider)] bg-[color-mix(in_oklab,var(--color-gray-100)_40%,transparent)] px-2.5 py-0.5 text-xs dark:border-[var(--ds-input-divider-dark)] dark:bg-white/5"
          >
            <span class="max-w-[150px] truncate">{{ file.name }}</span>
            <button
              type="button"
              class="text-[var(--color-gray-500)] hover:text-[var(--color-gray-700)] dark:text-[var(--color-gray-400)] dark:hover:text-[var(--color-gray-300)]"
              aria-label="Remove"
              @click.stop="removeFile(i)"
            >
              ✕
            </button>
          </span>
        </template>
      </div>
    </div>

    <!-- Helper message -->
    <p
      v-if="message"
      class="ds-helper"
      :class="{
        'ds-helper--error': status === 'error',
        'ds-helper--success': status === 'success',
        'ds-helper--default': status === 'default'
      }"
    >
      {{ message }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

type Size = 'sm' | 'md'
type Status = 'default' | 'success' | 'error'
type Variant = 'outlined' | 'soft' | 'plain'

const props = withDefaults(
  defineProps<{
    id?: string
    modelValue?: File[]
    label?: string
    placeholder?: string
    buttonLabel?: string
    multiple?: boolean
    size?: Size
    status?: Status
    variant?: Variant
    message?: string
    disabled?: boolean
    required?: boolean
  }>(),
  {
    modelValue: () => [],
    size: 'md',
    status: 'default',
    variant: 'outlined',
    buttonLabel: 'Choose File'
  }
)

const emit = defineEmits<{ (e: 'update:modelValue', v: File[]): void }>()
const inputEl = ref<HTMLInputElement | null>(null)

const selectedFiles = computed(() => props.modelValue || [])

function onFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  const files = target.files ? Array.from(target.files) : []
  emit('update:modelValue', files)
}

function removeFile(index: number) {
  const files = [...selectedFiles.value]
  files.splice(index, 1)
  emit('update:modelValue', files)
}
function onBrowseClick() {
  if (props.disabled) return
  inputEl.value?.click()
}
 
 defineExpose({ inputEl })
export type ElExpose = { inputEl: typeof inputEl }
</script>

<style scoped>
/* optional: better cursor for upload area */
.ds-input input[type='file'] {
  cursor: pointer;
}
</style>
