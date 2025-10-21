<template>
  <div class="w-full" ref="root">
    <label
      v-if="label"
      :for="baseId"
      class="ds-label"
      :class="disabled ? 'cursor-not-allowed opacity-60' : ''"
    >
      {{ label }} <span v-if="required" aria-hidden="true" class="text-error-500">*</span>
    </label>

    <div
      :id="baseId"
      ref="regionEl"
      class="ds-input ds-dropzone relative flex cursor-pointer flex-col items-center justify-center !overflow-visible border-dashed"
      :data-variant="variant"
      :data-size="size"
      :data-status="effectiveStatus"
      :data-disabled="disabled ? 'true' : 'false'"
      :class="{ 'is-dragover': isDragging }"
      role="region"
      tabindex="0"
      @keydown.enter.prevent="!disabled && openSystemPicker()"
      @keydown.space.prevent="!disabled && openSystemPicker()"
      @click="!disabled && openSystemPicker()"
      @blur="onBlur"
      :aria-invalid="effectiveStatus === 'error' ? 'true' : undefined"
      :aria-describedby="effectiveMessage ? describedById : undefined"
    >
      <!-- Message -->
      <div class="dz-message m-0 w-full">
        <slot name="message">
          <div class="flex flex-col items-center gap-4 px-6 py-8 text-center lg:px-10">
            <div class="flex h-16 w-16 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--color-gray-100)_40%,transparent)] text-[var(--color-gray-700)] dark:bg-white/5 dark:text-[var(--color-gray-400)]">
              <!-- icon -->
              <svg width="28" height="28" viewBox="0 0 29 28" class="fill-current" aria-hidden="true">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M14.5 3.917c-.217 0-.412.092-.549.239L8.574 9.532a.833.833 0 1 0 1.06 1.06l4.118-4.115V18.667a.75.75 0 0 0 1.5 0V6.482l4.113 4.111a.75.75 0 1 0 1.06-1.061L15.084 4.194a.75.75 0 0 0-.582-.277ZM5.916 18.667a.75.75 0 0 0-1.5 0v3.167a2.25 2.25 0 0 0 2.25 2.25h15.668a2.25 2.25 0 0 0 2.25-2.25v-3.167a.75.75 0 0 0-1.5 0v3.167a.75.75 0 0 1-.75.75H6.666a.75.75 0 0 1-.75-.75v-3.167Z"/>
              </svg>
            </div>
            <h4 class="text-theme-xl font-semibold text-[var(--ds-text)]">Drag & Drop files here</h4>
            <p class="mx-auto max-w-[320px] text-sm text-[var(--ds-ph)]">
              Drop files, or
              <button type="button" class="text-brand-500 font-medium underline" @click.stop="openSystemPicker">
                browse
              </button>
            </p>
          </div>
        </slot>
      </div>

      <!-- hidden native input -->
      <input
        v-if="useNativePicker"
        ref="nativeInput"
        type="file"
        :multiple="multiple"
        :accept="accept"
        class="hidden"
        @change="onNativePicked"
      />

      <!-- previews -->
      <div v-if="showPreviews" class="dz-previews w-full px-4 pt-0 pb-3"></div>

      <!-- preview template (hidden) -->
      <div ref="previewTplEl" style="display:none">
        <div class="dz-preview dz-file-preview">
          <div class="dz-image overflow-hidden rounded-lg">
            <img data-dz-thumbnail />
          </div>
          <div class="dz-details mt-2 flex items-center gap-2 text-sm">
            <div class="dz-filename max-w-[12rem] truncate"><span data-dz-name></span></div>
            <div class="dz-size text-[color:var(--ds-ph)]" data-dz-size></div>
          </div>
          <div class="dz-progress mt-2 h-1 bg-[color-mix(in_oklab,var(--color-gray-100)_60%,transparent)] dark:bg-white/10">
            <span class="dz-upload bg-brand-500 block h-full w-0" data-dz-uploadprogress></span>
          </div>
          <button class="dz-remove mt-2 text-xs text-[var(--color-gray-500)] hover:text-[var(--color-gray-700)] dark:text-[var(--color-gray-400)]" data-dz-remove>
            Remove
          </button>
        </div>
      </div>
    </div>

    <p
      v-if="effectiveMessage"
      :id="describedById"
      class="ds-helper"
      :class="{
        'ds-helper--error': effectiveStatus === 'error',
        'ds-helper--success': effectiveStatus === 'success',
        'ds-helper--default': effectiveStatus === 'default'
      }"
      aria-live="polite"
    >
      {{ effectiveMessage }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch, computed, getCurrentInstance } from 'vue'
import Dropzone from 'dropzone'
import 'dropzone/dist/dropzone.css'
import { useFormField } from '@/validation/useFormField'
import { ValidateOn } from '@/validation/types'

export interface PreviewFile {
  id: string
  src: string | null
  file?: File
  originalFile?: File
  progress?: number
  isProcessing?: boolean
  processingProgress?: number
  alt?: string
}

type Size = 'sm' | 'md'
type Status = 'default' | 'success' | 'error'
type Variant = 'outlined' | 'soft' | 'plain'

const props = withDefaults(defineProps<{
  name?: string
  id?: string
  modelValue: PreviewFile[]
  label?: string
  message?: string

  // validation/behavior
  accept?: string
  multiple?: boolean
  maxFilesizeMB?: number
  maxFiles?: number

  // ui
  useNativePicker?: boolean
  showPreviews?: boolean
  variant?: Variant
  size?: Size
  status?: Status
  disabled?: boolean
  required?: boolean

  // validation glue
  rules?: Array<any>
  validateOn?: ValidateOn
  realtimeMs?: number
  showSuccess?: boolean
}>(), {
  modelValue: () => [],
  accept: 'image/*',
  multiple: true,
  maxFilesizeMB: 5,
  maxFiles: 8,
  useNativePicker: true,
  showPreviews: true,
  variant: 'outlined',
  size: 'md',
  status: 'default',

  validateOn: ValidateOn.Submit,
  realtimeMs: 150,
  showSuccess: false
})

const emit = defineEmits<{
  (e:'update:modelValue', v: PreviewFile[]): void
  (e:'added', file: File): void
  (e:'removed', file: File): void
  (e:'error', file: File | null, err: unknown): void
}>()

// ids / a11y
const inst = getCurrentInstance()
const baseId = computed(() => props.id ?? `${props.name ?? 'ui-dropzone'}-${inst?.uid ?? '0'}`)
const describedById = computed(() => `${baseId.value}__desc`)

// refs
const root = ref<HTMLDivElement | null>(null)
const regionEl = ref<HTMLDivElement | null>(null)
const nativeInput = ref<HTMLInputElement | null>(null)
const previewTplEl = ref<HTMLDivElement | null>(null)
const isDragging = ref(false)
let dz: Dropzone | null = null

// model proxy
const files = computed<PreviewFile[]>({
  get: () => props.modelValue || [],
  set: (val) => emit('update:modelValue', [...val])
})

// register with form (focus the region on invalid)
const registryName = computed(() => props.name ?? baseId.value)
const field = useFormField(registryName.value, files as any, props.rules ?? [], {
  nativeEl: regionEl as unknown as any,
  validateOn: props.validateOn,
  realtimeMs: props.realtimeMs
})

const effectiveMessage = computed<string | null>(() => props.message ?? field.error.value ?? null)
const effectiveStatus = computed<Status>(() => {
  if (props.status && props.status !== 'default') return props.status
  if (effectiveMessage.value) return 'error'
  if (props.showSuccess && field.touched.value && !effectiveMessage.value) return 'success'
  return 'default'
})

function openSystemPicker() {
  if (props.disabled) return
  nativeInput.value?.click()
}
function onNativePicked(e: Event) {
  const picked = Array.from((e.target as HTMLInputElement).files || [])
  picked.forEach((f) => dz?.addFile(f as unknown as Dropzone.DropzoneFile))
  ;(e.target as HTMLInputElement).value = ''
}

function toPreviewFile(file: Dropzone.DropzoneFile): PreviewFile {
  const src = file.type?.startsWith?.('image/') ? URL.createObjectURL(file as unknown as File) : null
  return {
    id: `${file?.upload?.uuid}`,
    src,
    file: file as unknown as File,
    originalFile: file as unknown as File,
    progress: 0,
    isProcessing: false,
    alt: file.name
  }
}
function revokeIfBlob(pf?: PreviewFile) {
  if (!pf?.src) return
  try { if (pf.src.startsWith('blob:')) URL.revokeObjectURL(pf.src) } catch {}
}

onMounted(() => {
  Dropzone.autoDiscover = false
  const templateHTML = previewTplEl.value?.innerHTML.trim() || undefined
  const previewsEl = root.value?.querySelector('.dz-previews') as HTMLElement | undefined

  dz = new Dropzone(`#${baseId.value}`, {
    url: '/noop', autoProcessQueue: false, autoQueue: false,
    uploadMultiple: false, parallelUploads: 1,
    acceptedFiles: props.accept, maxFilesize: props.maxFilesizeMB, maxFiles: props.maxFiles,
    previewsContainer: previewsEl, previewTemplate: templateHTML, clickable: false,

    init() {
      this.on('dragenter', () => (isDragging.value = true))
      this.on('dragleave', () => (isDragging.value = false))
      this.on('drop', () => (isDragging.value = false))

      this.on('addedfile', (file) => {
        if (props.maxFiles && files.value.length >= props.maxFiles) {
          this.removeFile(file)
          emit('error', file as unknown as File, new Error('Max files reached'))
          field.onInputValidate()
          return
        }
        const pf = toPreviewFile(file)
        files.value = [...files.value, pf]
        emit('added', file as unknown as File)
        // no real upload; mark progress complete
        if (file.upload) { (file.upload as any).progress = 100; this.emit('uploadprogress', file, 100, file.size); this.emit('complete', file) }
        field.onInputValidate()
      })

      this.on('removedfile', (file) => {
        const id = (file as any)?.upload?.uuid
        const toRemove = files.value.find((f) => f.id === id)
        if (toRemove) revokeIfBlob(toRemove)
        files.value = files.value.filter((f) => f.id !== id)
        emit('removed', file as unknown as File)
        field.onInputValidate()
      })

      this.on('error', (file, err) => {
        emit('error', file as unknown as File, err)
        field.onInputValidate()
      })
    }
  })
})

// keep DZ options in sync
watch(
  () => [props.accept, props.multiple, props.maxFilesizeMB, props.maxFiles] as const,
  ([accept, multiple, size, max]) => {
    if (!dz) return
    dz.options.acceptedFiles = accept
    dz.options.uploadMultiple = !!multiple
    dz.options.maxFilesize = size
    dz.options.maxFiles = max
  }
)

onBeforeUnmount(() => {
  for (const f of files.value) revokeIfBlob(f)
  dz?.destroy()
})

// validation blur hook
function onBlur() { field.onBlurValidate() }
</script>

<style scoped>
@reference "~/assets/css/main.css";

.ds-dropzone {
  @apply border-[var(--ds-input-border)] bg-[color-mix(in_oklab,var(--color-gray-100)_20%,transparent)] p-6 lg:p-10;
  @apply dark:border-[var(--ds-input-border-dark)] dark:bg-[var(--ds-bg-dark)];
}
.ds-dropzone.is-dragover {
  box-shadow: 0 0 0 3px var(--ds-ring-brand);
  border-color: rgb(var(--color-brand-300));
}
</style>
