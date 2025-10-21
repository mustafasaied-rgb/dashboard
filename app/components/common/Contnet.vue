<template>
  <article
    :class="[
      // your base rhythm
      'space-y-[17px] text-[20px] font-[300] leading-[105%] tracking-[0.2px] rtl:leading-[130%]',
      'lg:space-y-[22px] lg:text-[24.5px] lg:leading-[107.4%] lg:tracking-[0.245px]',
      'xl:text-[30px] xl:leading-[110%] xl:tracking-[0.3px]',
      // lists
      '[&_:is(ul,ol)]:w-[90%] [&_:is(ul,ol)]:list-outside [&_:is(ul,ol)]:space-y-4 [&_:is(ul,ol)]:ps-6',
      '[&_ol]:list-decimal [&_ul]:list-disc',
      // element styles
      'content-typography'
    ]"
    v-html="contentHtml"
  />
</template>

<script setup lang="ts">
const props = defineProps<{ content?: string | undefined }>()
const test = `<p><strong>test</strong></p><p><em>test</em></p><p><u>test</u></p><p><s>test</s></p><p><sub>test </sub><sup>test</sup></p><h1>test</h1><h2>test</h2><ol><li>test</li><li>test</li></ol><p><br></p><ul><li>test</li><li>test</li></ul><p class="ql-indent-1">test</p><p><span class="ql-size-small">test</span></p><p>test</p><p><span class="ql-size-large">test</span></p><p><span class="ql-size-huge">Test</span></p><p>test</p>`
// const rawContent = computed(() => test ?? '')
const rawContent = computed(() => props.content ?? '')

/**
 * If backend sent plain text, wrap in <p> and preserve newlines.
 * If it already contains tags, pass through unchanged.
 */
const contentHtml = computed(() => {
  const s = String(rawContent.value || '').trim()
  const looksLikeHtml = /<\/?[a-z][\s\S]*>/i.test(s)
  if (looksLikeHtml) return s
  if (!s) return ''
  return s
    .split(/\n{2,}/)
    .map((p) => `<p>${p.replace(/\n/g, '<br>')}</p>`)
    .join('')
})
</script>
