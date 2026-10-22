# ==============================================================================
# ReLaunch Studio — Dockerized Local VPS Video Render Worker
# Stack: Node 20 + Python 3 (faster-whisper) + FFmpeg + Chromium (Remotion)
# ==============================================================================

FROM node:20-bookworm-slim

# Install system dependencies: FFmpeg, Python3, build tools, Chromium for Remotion
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    python3 \
    python3-pip \
    python3-venv \
    libvpx-dev \
    libx264-dev \
    curl \
    chromium \
    fonts-freefont-ttf \
    fonts-montserrat \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Remotion Puppeteer environment configuration
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

WORKDIR /app

# Set up isolated Python virtual environment for faster-whisper
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
RUN pip3 install --no-cache-dir faster-whisper

# Copy package manifests and install Node dependencies
COPY package*.json ./
RUN npm ci

# Copy source code and build TypeScript
COPY . .
RUN npm run build

# Start the BullMQ queue worker
CMD ["node", "dist/index.js"]
