<template>
  <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
    <foreignObject x="-12" y="-12" width="66" height="66"
      ><div
        xmlns="http://www.w3.org/1999/xhtml"
        style="
          backdrop-filter: blur(6px);
          clip-path: url(#bgblur_0_828_1263_clip_path);
          height: 100%;
          width: 100%;
        "
      ></div
    ></foreignObject>
    <rect
      data-figma-bg-blur-radius="12"
      width="42"
      height="42"
      rx="12"
      :fill="color"
      fill-opacity="0.05"
    />
    <line
      x1="14.4142"
      y1="14"
      x2="28.5563"
      y2="28.1421"
      :stroke="color"
      stroke-width="2"
      stroke-linecap="round"
    />
    <line
      x1="1"
      y1="-1"
      x2="21"
      y2="-1"
      transform="matrix(-0.707107 0.707107 0.707107 0.707107 30 14)"
      :stroke="color"
      stroke-width="2"
      stroke-linecap="round"
    />
    <defs>
      <clipPath id="bgblur_0_828_1263_clip_path" transform="translate(12 12)">
        <rect width="42" height="42" rx="12" />
      </clipPath>
    </defs>
  </svg>
</template>
<script setup lang="ts">
const props = defineProps({
  size: { type: [String, Number], default: 24 },
  color: { type: String, default: 'white' }
})
</script>
