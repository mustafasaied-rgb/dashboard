<template>
  <div class="w-full" ref="root">
    <label
      v-if="label"
      :for="id"
      class="ds-label"
      :class="disabled ? 'cursor-not-allowed opacity-60' : ''"
    >
      {{ label }} <span v-if="required" aria-hidden="true" class="text-error-500">*</span>
    </label>

    <!-- Dropzone shell -->
    <div
      :id="dropzoneId"
      class="ds-input ds-dropzone relative flex cursor-pointer flex-col items-center justify-center !overflow-visible border-dashed"
      :data-variant="variant"
      :data-size="size"
      :data-status="status"
      :data-disabled="disabled ? 'true' : 'false'"
      :class="{ 'is-dragover': isDragging }"
      role="region"
      tabindex="0"
      @keydown.enter.prevent="!disabled && openSystemPicker()"
      @keydown.space.prevent="!disabled && openSystemPicker()"
      @click="!disabled && openSystemPicker()"
      aria-label="Upload images"
    >
      <!-- Message -->
      <div class="dz-message m-0 w-full">
        <slot name="message">
          <div class="flex flex-col items-center gap-4 px-6 py-8 text-center lg:px-10">
            <div
              class="flex h-16 w-16 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--color-gray-100)_40%,transparent)] text-[var(--color-gray-700)] dark:bg-white/5 dark:text-[var(--color-gray-400)]"
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 29 28"
                class="fill-current"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M14.5019 3.91699c-.2167 0-.412.09192-.5489.2389L8.5736 9.5319a.833.833 0 0 0 1.0603 1.0606l4.118-4.1153V18.667c0 .4142.3358.75.75.75s.75-.3358.75-.75V6.4823l4.1134 4.1106a.75.75 0 0 0 1.0604-1.0607L15.0838 4.1938c-.1375-.1689-.3471-.2768-.5819-.2768ZM5.9163 18.667c0-.4142-.3358-.75-.75-.75s-.75.3358-.75.75v3.1667c0 1.2426 1.0074 2.25 2.25 2.25h15.6677c1.2427 0 2.25-1.0074 2.25-2.25V18.667c0-.4142-.3358-.75-.75-.75s-.75.3358-.75.75v3.1667c0 .4142-.3357.75-.75.75H6.6663a.75.75 0 0 1-.75-.75V18.667Z"
                />
              </svg>
            </div>
            <h4 class="text-theme-xl font-semibold text-[var(--ds-text)]">
              Drag & Drop files here
            </h4>
            <p class="mx-auto max-w-[320px] text-sm text-[var(--ds-ph)]">
              Drop PNG, JPG, WebP, SVG… or
              <button
                type="button"
                class="text-brand-500 font-medium underline"
                @click.stop="openSystemPicker"
              >
                browse
              </button>
            </p>
          </div>
        </slot>
      </div>

      <!-- hidden native input (for “Browse”) -->
      <input
        v-if="useNativePicker"
        ref="nativeInput"
        type="file"
        :multiple="multiple"
        :accept="accept"
        class="hidden"
        @change="onNativePicked"
      />

      <!-- previews container (Dropzone injects clones here) -->
      <div v-if="showPreviews" class="dz-previews w-full px-4 pt-0 pb-3"></div>

      <!-- preview template (hidden): Dropzone will clone this HTML -->
      <div ref="previewTplEl" style="display: none">
        <div class="dz-preview dz-file-preview">
          <div class="dz-image overflow-hidden rounded-lg">
            <img data-dz-thumbnail />
          </div>
          <div class="dz-details mt-2 flex items-center gap-2 text-sm">
            <div class="dz-filename max-w-[12rem] truncate"><span data-dz-name></span></div>
            <div class="dz-size text-[color:var(--ds-ph)]" data-dz-size></div>
          </div>
          <div
            class="dz-progress mt-2 h-1 bg-[color-mix(in_oklab,var(--color-gray-100)_60%,transparent)] dark:bg-white/10"
          >
            <span class="dz-upload bg-brand-500 block h-full w-0" data-dz-uploadprogress></span>
          </div>
          <button
            class="dz-remove mt-2 text-xs text-[var(--color-gray-500)] hover:text-[var(--color-gray-700)] dark:text-[var(--color-gray-400)]"
            data-dz-remove
          >
            Remove
          </button>
        </div>
      </div>
    </div>

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
import { onMounted, onBeforeUnmount, ref, watch, computed } from 'vue'
import Dropzone from 'dropzone'
import 'dropzone/dist/dropzone.css'

/** Same shape you used in UploadFilesWithPreview */
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

const props = withDefaults(
  defineProps<{
    modelValue: PreviewFile[]
    id?: string
    label?: string
    message?: string

    /** validation/behavior */
    accept?: string
    multiple?: boolean
    maxFilesizeMB?: number
    maxFiles?: number

    /** ui */
    useNativePicker?: boolean
    showPreviews?: boolean
    variant?: 'outlined' | 'soft' | 'plain'
    size?: 'sm' | 'md'
    status?: 'default' | 'success' | 'error'
    disabled?: boolean
    required?: boolean
  }>(),
  {
    modelValue: () => [],
    accept: 'image/*',
    multiple: true,
    maxFilesizeMB: 5,
    maxFiles: 8,
    useNativePicker: true,
    showPreviews: true,
    variant: 'outlined',
    size: 'md',
    status: 'default'
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', v: PreviewFile[]): void
  (e: 'added', file: File): void
  (e: 'removed', file: File): void
  (e: 'error', file: File | null, err: unknown): void
}>()

/** internal */
const dropzoneId = `dz-${Math.random().toString(36).slice(2)}`
const root = ref<HTMLDivElement | null>(null)
const nativeInput = ref<HTMLInputElement | null>(null)
const previewTplEl = ref<HTMLDivElement | null>(null)
const isDragging = ref(false)
let dz: Dropzone | null = null

const files = computed<PreviewFile[]>({
  get: () => props.modelValue || [],
  set: (val) => emit('update:modelValue', [...val])
})

function openSystemPicker() {
  if (props.disabled) return
  nativeInput.value?.click()
}

function onNativePicked(e: Event) {
  const picked = Array.from((e.target as HTMLInputElement).files || [])
  picked.forEach((f) => dz?.addFile(f as unknown as Dropzone.DropzoneFile))
  ;(e.target as HTMLInputElement).value = '' // allow same file twice
}

/** Helpers */
function toPreviewFile(file: Dropzone.DropzoneFile): PreviewFile {
  const src = file.type.startsWith('image/') ? URL.createObjectURL(file as unknown as File) : null
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
  try {
    if (pf.src.startsWith('blob:')) URL.revokeObjectURL(pf.src)
  } catch {}
}

onMounted(() => {
  Dropzone.autoDiscover = false

  const templateHTML = previewTplEl.value?.innerHTML.trim() || undefined
  const previewsEl = root.value?.querySelector('.dz-previews') as HTMLElement | undefined

  dz = new Dropzone(`#${dropzoneId}`, {
    // IMPORTANT: prevent uploads
    url: '/noop',
    autoProcessQueue: false,
    autoQueue: false,
    uploadMultiple: false,
    parallelUploads: 1,

    // UX/validation (kept from Dropzone)
    acceptedFiles: props.accept,
    maxFilesize: props.maxFilesizeMB,
    maxFiles: props.maxFiles,
    previewsContainer: previewsEl,
    previewTemplate: templateHTML,
    clickable: false, // we open native input ourselves

    init() {
      this.on('dragenter', () => (isDragging.value = true))
      this.on('dragleave', () => (isDragging.value = false))
      this.on('drop', () => (isDragging.value = false))

      this.on('addedfile', (file) => {
        // enforce maxFiles manually for v-model consistency
        if (props.maxFiles && files.value.length >= props.maxFiles) {
          this.removeFile(file)
          emit('error', file as unknown as File, new Error('Max files reached'))
          return
        }

        const pf = toPreviewFile(file)
        files.value = [...files.value, pf]
        emit('added', file as unknown as File)
      })

      this.on('thumbnail', (file) => {
        // Keep Dropzone’s internal preview progress UI in sync if needed
        // (No-op here; the DOM template already shows the preview)
      })

      // Simulate progress UI without uploading (just set to 100 instantly)
      this.on('addedfile', (file) => {
        if (!file.upload) return
        file.upload = file.upload || { progress: 0, bytesSent: 0, total: file.size }
        ;(file.upload as any).progress = 100
        this.emit('uploadprogress', file, 100, file.size)
        this.emit('complete', file)
      })

      this.on('removedfile', (file) => {
        const id = (file as any)?.upload?.uuid
        const toRemove = files.value.find((f) => f.id === id)
        if (toRemove) revokeIfBlob(toRemove)
        files.value = files.value.filter((f) => f.id !== id)
        emit('removed', file as unknown as File)
      })

      this.on('error', (file, err) => {
        emit('error', file as unknown as File, err)
      })
    }
  })
})

/** Keep accept/multiple in sync if props change */
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
  // cleanup blob URLs
  for (const f of files.value) revokeIfBlob(f)
  dz?.destroy()
})
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
