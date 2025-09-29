module.exports = {
  apps: [
    {
      name: "my-new-app",
      script: ".output/server/index.mjs", // Nuxt 3; for Nuxt 2 use "npm", args: "start"
      env: {
        NODE_ENV: "production",
        HOST: "127.0.0.1",
        PORT: 4000
      },
      autorestart: true,
      watch: false
    }
  ]
}
