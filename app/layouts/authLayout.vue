<template>
  <div class="relative z-1 bg-white p-6 sm:p-0 dark:bg-gray-900">
    <div class="relative flex h-screen w-full flex-col justify-center lg:flex-row dark:bg-gray-900">
      <div class="flex w-full flex-1 flex-col lg:w-1/2">
        <div class="mx-auto w-full max-w-md pt-10">
          <nuxt-link
            to="/"
            class="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <svg
              class="stroke-current"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M12.7083 5L7.5 10.2083L12.7083 15.4167"
                stroke=""
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            Back to dashboard
          </nuxt-link>
        </div>
        <div class="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
          <slot />
        </div>
      </div>
      <div
        class="bg-brand-950 relative hidden h-full w-full items-center lg:grid lg:w-1/2 dark:bg-white/5"
      >
        <div class="z-1 flex items-center justify-center">
          <common-grid-shape />
          <div class="flex max-w-xs flex-col items-center">
            <nuxt-link to="/" class="mb-4 block">
              <img width="{231}" height="{48}" src="/images/logo/auth-logo.svg" alt="Logo" />
            </nuxt-link>
            <p class="text-center text-gray-400 dark:text-white/60">
              Free and Open-Source Tailwind CSS Admin Dashboard Template
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>
