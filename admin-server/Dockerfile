FROM node:18-slim

WORKDIR /app

# Install OpenSSL for Prisma
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Copy all files
COPY . .

# Install dependencies
RUN npm ci

# Generate Prisma client
RUN npx prisma generate

# Build Next.js
RUN npm run build

# Create database directory
RUN mkdir -p /app/prisma

EXPOSE 3000

CMD ["npm", "start"]