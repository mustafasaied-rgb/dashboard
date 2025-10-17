<template>
  <div
    class="relative flex flex-col items-center"
    @dragover.prevent="handleDragOver"
    @dragleave.prevent="handleDragLeave"
    @drop.prevent="handleDrop"
  >
    <slot name="input" v-bind="{ open: () => uploadFileInput?.click(), isDragging }">
      <button
        :disabled="isUploading"
        :class="[
          'flex aspect-square w-[120px] flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-[--primary]',
          'transition-opacity hover:opacity-70',
          inputClass,
          isDragging ? 'border-[--primary] bg-[--primary]/10' : ''
        ]"
        @click.prevent="uploadFileInput?.click()"
      >
        <div
          class="relative grid aspect-square w-[29.3px] place-items-center rounded-full bg-[--primary]"
        >
          <Icon
            v-if="isUploading"
            class="absolute w-full animate-spin !text-gray-200"
            name="uiw:loading"
          />
          <PlusIcon v-else :width="19" :height="17" :strokeWidth="2" />
        </div>
        <h4 class="text-xs font-medium text-[--secondary_text_dark]">
          {{ t('labels.add_photo') }}
        </h4>
      </button>
    </slot>

    <input
      ref="uploadFileInput"
      class="absolute z-[-1] opacity-0"
      type="file"
      :multiple="multiple"
      :accept="accept"
      :name="t('labels.upload_images')"
      @change="handleUploadFiles"
      :required="required"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

// ------------------------------
// Types
// ------------------------------
type FileType = 'img' | 'video'
interface FileObject {
  id: string
  src: string | null
  file: File
  originalFile: File
  progress: number
  isProcessing: boolean
  processingProgress: number
}
interface Props {
  modelValue: FileObject[]
  inputClass?: string
  required?: boolean
  type?: FileType
  totalFilesNo?: number
  maxFiles?: number
  isProcessed?: boolean

  // adjustable props
  accept?: string // e.g. "image/*,.svg,application/pdf"
  multiple?: boolean // single vs multiple mode
  maxSizeMB?: number // per-file cap
}
const props = withDefaults(defineProps<Props>(), {
  inputClass: '',
  required: false,
  type: 'img',
  maxFiles: 5,
  isProcessed: false,
  accept: 'image/*',
  multiple: true,
  maxSizeMB: 5
})

const emits = defineEmits<{
  (e: 'update:modelValue', value: FileObject[]): void
}>()

const uploadFileInput = ref<HTMLInputElement | null>(null)
const { t } = useI18n()
const isUploading = ref(false)
const isDragging = ref(false)

// ---- get encapsulated validations from the local script block
const { validators } = useFileValidations({
  t,
  accept: props.accept,
  maxSizeMB: props.maxSizeMB
})

// v-model
const totalFiles = computed<FileObject[]>({
  get: () => props.modelValue || [],
  set: (newVal) => emits('update:modelValue', [...newVal])
})

// Handlers
const handleUploadFiles = async (e: Event) => {
  const target = e.target as HTMLInputElement
  const files = Array.from(target.files || [])
  if (!files.length) return
  await processFiles(files)
  target.value = ''
}

const processFiles = async (incoming: File[]) => {
  const files = props.multiple ? incoming : incoming.slice(0, 1)

  const currentTotalSize = totalFiles.value.reduce((acc, f) => acc + (f.file?.size || 0), 0)
  const allFilesNo = (props.totalFilesNo ?? totalFiles.value.length) + files.length
  if (validators.maxFilesNo(allFilesNo, props.maxFiles)) return

  isUploading.value = true
  const newFiles: FileObject[] = []

  for (const file of files) {
    if (!validators.accept(file)) continue
    if (!validators.fileSize(file)) continue
    if (!validators.totalFilesSize(file, currentTotalSize)) continue

    const fileObj: FileObject = {
      id: Math.random().toString(16).slice(2),
      src: null,
      file,
      originalFile: file,
      progress: 0,
      isProcessing: false,
      processingProgress: 0
    }

    createPreview(fileObj, file)
    newFiles.push(fileObj)

    if (props.isProcessed) processInBackground(fileObj)

    if (!props.multiple) {
      totalFiles.value = [fileObj]
      isUploading.value = false
      return
    }
  }

  totalFiles.value = [...totalFiles.value, ...newFiles]
  isUploading.value = false
}

const createPreview = (fo: FileObject, file: File) => {
  fo.src = URL.createObjectURL(file)
  const reader = new FileReader()
  reader.onload = (ev) => {
    fo.src = ev.target?.result as string
    totalFiles.value = [...totalFiles.value]
  }
  reader.onerror = () => validators.showError(t('validation.file_read_error'))
  reader.readAsDataURL(file)
}

const processInBackground = async (fo: FileObject) => {
  try {
    fo.isProcessing = true
    fo.processingProgress = 10
    await new Promise((r) => setTimeout(r, 400))
    fo.processingProgress = 100
    fo.isProcessing = false
    totalFiles.value = [...totalFiles.value]
  } catch (e) {
    console.error('Processing error:', e)
    fo.isProcessing = false
  }
}

// Drag & Drop
const handleDragOver = () => (isDragging.value = true)
const handleDragLeave = () => (isDragging.value = false)
const handleDrop = async (e: DragEvent) => {
  isDragging.value = false
  const dropped = Array.from(e.dataTransfer?.files || [])
  if (!dropped.length) return
  await processFiles(dropped)
}
</script>

<!-- Encapsulated composable in SAME FILE -->
<script lang="ts">
type TFunc = (key: string, params?: Record<string, any>) => string

export function useFileValidations(opts: {
  t: TFunc
  accept: string
  maxSizeMB: number
  /** optional total-cap override (MB). Default 1024 (1GB). */
  maxTotalMB?: number
}) {
  const { t, accept, maxSizeMB, maxTotalMB = 1024 } = opts
  const MB = 1024 * 1024

  const showError = (msg: string) => {
    // Plug your Swal/toast here if you want UI feedback
    console.error(msg)
  }

  // Accept matcher for CSV like "image/*,.svg,application/pdf"
  function matchesAccept(file: File, acceptCSV: string): boolean {
    if (!acceptCSV) return true
    const tokens = acceptCSV
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean)

    if (!tokens.length) return true

    const type = file.type.toLowerCase() // e.g. "image/png"
    const ext = '.' + (file.name.split('.').pop() || '').toLowerCase() // ".png"

    return tokens.some((token) => {
      if (token.endsWith('/*')) {
        const prefix = token.slice(0, -2) // "image"
        return type.startsWith(prefix + '/')
      }
      if (token.startsWith('.')) {
        return ext === token
      }
      return type === token
    })
  }

  const validators = {
    showError,
    maxFilesNo(allFilesNo: number, maxAllowed = 5): boolean {
      if (allFilesNo > maxAllowed) {
        showError(t('validation.max_no_files', { no: maxAllowed }))
        return true
      }
      return false
    },
    accept(file: File): boolean {
      if (!matchesAccept(file, accept)) {
        showError(
          t('validation.unsupported_file_type_error', {
            types: accept
          })
        )
        return false
      }
      return true
    },
    fileSize(file: File): boolean {
      const maxBytes = (maxSizeMB ?? 5) * MB
      if (file.size > maxBytes) {
        showError(
          t('validation.single_file_size_exceeded', {
            size: `${maxSizeMB}MB`
          })
        )
        return false
      }
      return true
    },
    totalFilesSize(file: File, currentTotal: number): boolean {
      const cap = (maxTotalMB ?? 1024) * MB
      if (currentTotal + file.size > cap) {
        showError(t('validation.total_file_size_exceeded', { size: `${maxTotalMB}GB` }))
        return false
      }
      return true
    }
  }

  return { validators }
}
</script>

<style scoped>
button {
  transition: opacity 0.2s;
}
</style>
