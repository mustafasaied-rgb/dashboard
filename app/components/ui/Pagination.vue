<template>
  <nav
    class="flex items-center justify-between gap-2 px-6 py-4 sm:justify-normal"
    role="navigation"
    :aria-label="ariaLabel"
  >
    <!-- Previous -->
    <button
      type="button"
      :disabled="isFirstPage"
      @click="goTo(page - 1)"
      aria-label="Previous page"
      class="shadow-theme-xs flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-50 sm:px-3.5 sm:py-2.5 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
    >
      <span v-if="showPrevIcon" class="inline" aria-hidden="true">
        <slot name="prev-icon">
          <!-- default chevron-left (auto-mirrors in RTL) -->
          <svg class="fill-current rtl:scale-x-[-1]" width="20" height="20" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M2.58203 9.99868C2.58174 10.1909 2.6549 10.3833 2.80152 10.53L7.79818 15.5301C8.09097 15.8231 8.56584 15.8233 8.85883 15.5305C9.15183 15.2377 9.152 14.7629 8.85921 14.4699L5.13911 10.7472L16.6665 10.7472C17.0807 10.7472 17.4165 10.4114 17.4165 9.99715C17.4165 9.58294 17.0807 9.24715 16.6665 9.24715L5.14456 9.24715L8.85919 5.53016C9.15199 5.23717 9.15184 4.7623 8.85885 4.4695C8.56587 4.1767 8.09099 4.17685 7.79819 4.46984L2.84069 9.43049C2.68224 9.568 2.58203 9.77087 2.58203 9.99715C2.58203 9.99766 2.58203 9.99817 2.58203 9.99868Z"
            />
          </svg>
        </slot>
      </span>

      <span v-if="showPrevText" :class="arrowTextClass">
        <slot name="prev-text">{{ prevText }}</slot>
      </span>
    </button>

    <!-- Compact label (phones) -->
    <span class="block text-sm font-medium text-gray-700 sm:hidden dark:text-gray-400">
      {{ `Page ${page} of ${pageCount}` }}
    </span>

    <!-- Numeric list (≥ sm) -->
    <ul class="hidden items-center gap-0.5 sm:flex">
      <li v-for="(item, idx) in range" :key="idx">
        <!-- Ellipsis -->
        <slot v-if="isEllipsis(item)" name="ellipsis">
          <span
            class="flex h-10 w-10 items-center justify-center text-sm font-medium text-gray-700 dark:text-gray-400"
          >
            …
          </span>
        </slot>

        <!-- Page item -->
        <template v-else>
          <slot name="page" :value="item" :active="item === page" :go="() => goTo(item as number)">
            <button
              type="button"
              :aria-current="item === page ? 'page' : undefined"
              @click="goTo(item as number)"
              class="hover:bg-brand-500 flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium hover:text-white focus-visible:outline-none dark:text-gray-400 dark:hover:text-white"
              :class="
                item === page ? 'bg-brand-500 hover:bg-brand-600 text-white' : 'text-gray-700'
              "
            >
              {{ item }}
            </button>
          </slot>
        </template>
      </li>
    </ul>

    <!-- Next -->
    <button
      type="button"
      :disabled="isLastPage"
      @click="goTo(page + 1)"
      aria-label="Next page"
      class="shadow-theme-xs flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-50 sm:px-3.5 sm:py-2.5 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
    >
      <span v-if="showNextText" :class="arrowTextClass">
        <slot name="next-text">{{ nextText }}</slot>
      </span>

      <span v-if="showNextIcon" class="inline" aria-hidden="true">
        <slot name="next-icon">
          <!-- default chevron-right (auto-mirrors in RTL) -->
          <svg class="fill-current rtl:scale-x-[-1]" width="20" height="20" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M17.4165 9.9986C17.4168 10.1909 17.3437 10.3832 17.197 10.53L12.2004 15.5301C11.9076 15.8231 11.4327 15.8233 11.1397 15.5305C10.8467 15.2377 10.8465 14.7629 11.1393 14.4699L14.8594 10.7472L3.33203 10.7472C2.91782 10.7472 2.58203 10.4114 2.58203 9.99715C2.58203 9.58294 2.91782 9.24715 3.33203 9.24715L14.854 9.24715L11.1393 5.53016C10.8465 5.23717 10.8467 4.7623 11.1397 4.4695C11.4327 4.1767 11.9075 4.17685 12.2003 4.46984L17.1578 9.43049C17.3163 9.568 17.4165 9.77087 17.4165 9.99715C17.4165 9.99763 17.4165 9.99812 17.4165 9.9986Z"
            />
          </svg>
        </slot>
      </span>
    </button>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type ArrowMode = 'auto' | 'both' | 'icon' | 'text'
const ELLIPSIS = '…' as const
type PageToken = number | typeof ELLIPSIS

type Props = {
  page: number
  total: number
  pageSize: number
  siblingCount?: number
  boundaryCount?: number
  ariaLabel?: string
  prevText?: string
  nextText?: string
  /** arrow content mode: 'auto' (text hidden below sm), 'both', 'icon', 'text' */
  arrowMode?: ArrowMode
}

const props = withDefaults(defineProps<Props>(), {
  siblingCount: 1,
  boundaryCount: 1,
  ariaLabel: 'Pagination',
  prevText: 'Previous',
  nextText: 'Next',
  arrowMode: 'auto'
})

const emit = defineEmits<{
  (e: 'update:page', value: number): void
  (e: 'change', value: number): void
}>()

const pageCount = computed(() => Math.max(1, Math.ceil((props.total || 0) / (props.pageSize || 1))))
const page = computed(() => clamp(props.page, 1, pageCount.value))
const isFirstPage = computed(() => page.value <= 1)
const isLastPage = computed(() => page.value >= pageCount.value)

function goTo(next: number) {
  const n = clamp(next, 1, pageCount.value)
  if (n !== props.page) {
    emit('update:page', n)
    emit('change', n)
  }
}
function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

/* range builder */
const range = computed<PageToken[]>(() =>
  buildRange(pageCount.value, page.value, props.siblingCount, props.boundaryCount)
)
function isEllipsis(v: PageToken): v is '…' {
  return v === ELLIPSIS
}
function buildRange(total: number, current: number, sibling = 1, boundary = 1): PageToken[] {
  const totalNumbers = boundary * 2 + sibling * 2 + 1
  if (total <= totalNumbers) return seq(1, total)
  const start = Math.max(1 + boundary, current - sibling)
  const end = Math.min(total - boundary, current + sibling)
  const left = seq(1, boundary),
    middle = seq(start, end),
    right = seq(total - boundary + 1, total)
  const showLeft = start > boundary + 1,
    showRight = end < total - boundary
  if (!showLeft && showRight)
    return [...left, ...middle, ...seq(end + 1, boundary + sibling * 2 + 1), '…', ...right]
  if (showLeft && !showRight)
    return [...left, '…', ...seq(total - (boundary + sibling * 2), start - 1), ...middle, ...right]
  return [...left, '…', ...middle, '…', ...right]
}
function seq(a: number, b: number) {
  return Array.from({ length: b - a + 1 }, (_, i) => a + i)
}

/* arrow display logic */
const arrowTextClass = computed(() => (props.arrowMode === 'auto' ? 'hidden sm:inline' : ''))
const showPrevIcon = computed(() => props.arrowMode !== 'text')
const showNextIcon = showPrevIcon
const showPrevText = computed(
  () => props.arrowMode === 'both' || props.arrowMode === 'text' || props.arrowMode === 'auto'
)
const showNextText = showPrevText
</script>

<style scoped>
:host(:dir(rtl)) svg.rtl\:scale-x-\[\-1\] {
  transform: scaleX(-1);
}
</style>
