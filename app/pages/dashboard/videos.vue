<template>
  <div class="">
    <PageBreadcrumb page-title="Videos" />
    <div class="space-y-5 sm:space-y-6">
      <ComponentCard
        collapsible
        title="YouTubeEmbed"
        class="grid grid-cols-1 gap-5 sm:gap-6 xl:grid-cols-2"
      >
        <div class="space-y-5 sm:space-y-6">
          <ComponentCard title="Video Ratio 16:9">
            <YouTubeEmbed videoId="dQw4w9WgXcQ" />
          </ComponentCard>
          <ComponentCard title="Video Ratio 4:3">
            <YouTubeEmbed videoId="dQw4w9WgXcQ" aspectRatio="4:3" />
          </ComponentCard>
        </div>
        <div class="space-y-5 sm:space-y-6">
          <ComponentCard title="Video Ratio 21:9">
            <YouTubeEmbed videoId="dQw4w9WgXcQ" aspectRatio="21:9" />
          </ComponentCard>
          <ComponentCard title="Video Ratio 1:1">
            <YouTubeEmbed videoId="dQw4w9WgXcQ" aspectRatio="1:1" />
          </ComponentCard>
        </div>
      </ComponentCard>
      <ComponentCard collapsible default-open title="SmartVideo" class="space-y-5 sm:space-y-6">
        <ComponentCard title="YouTube by full URL" class="space-y-5 sm:space-y-6">
          <SmartVideo src="https://www.youtube.com/watch?v=dQw4w9WgXcQ" aspectRatio="16:9" muted />
          <SmartVideo
            src="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            aspectRatio="16:9"
            poster="https://media.istockphoto.com/id/517188688/photo/mountain-landscape.jpg?s=612x612&w=0&k=20&c=A63koPKaCyIwQWOTFBRWXj_PwCrR4cEoOw2S9Q7yVl8="
            muted
          />
        </ComponentCard>
        <ComponentCard title="YouTube by id">
          <SmartVideo
            src="https://youtu.be/dQw4w9WgXcQ"
            :videoId="'dQw4w9WgXcQ'"
            aspectRatio="21:9"
          />
        </ComponentCard>
        <ComponentCard title="Native MP4 with poster">
          <SmartVideo
            src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            poster="https://m.media-amazon.com/images/M/MV5BNmZkNWNmYTgtNmYyMy00NTM0LThiOWYtY2FmMzBiNTRhNmZiXkEyXkFqcGc@._V1_.jpg"
            preload="metadata"
          />
        </ComponentCard>
        <ComponentCard title="Square reel-style " class="space-y-5 sm:space-y-6">
          <SmartVideo src="/videos/main_head.mp4" aspectRatio="1:1" />
          <SmartVideo
            src="/videos/main_head.mp4"
            poster="/images/video-thumb/thumb-16.png"
            aspectRatio="1:1"
          />
        </ComponentCard>
      </ComponentCard>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'dashboard'
})
import SmartVideo from '~/components/ui/videos/SmartVideo.vue'

</script>

<style></style>
