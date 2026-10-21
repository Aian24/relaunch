// ecosystem.config.js — ReLaunch IONOS VPS Process Configuration
// Manages both the Next.js Public Site and the Standalone Audit Engine under PM2

module.exports = {
  apps: [
    {
      name: "relaunch-website",
      script: "server.js",
      cwd: __dirname,
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 3000
      }
    },
    {
      name: "relaunch-audit",
      script: "server.js",
      cwd: "./relaunch-audit",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "production",
        PORT: 3001
      }
    }
  ]
};
