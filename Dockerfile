# Base image
FROM node:20.17-alpine AS base

# Dependencies stage
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
# Install both production and development dependencies (for Prisma CLI)
RUN npm ci

# Build stage
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Run Prisma generate (to generate Prisma client) before building
RUN npx prisma generate && npm run build

# Runner stage
FROM base AS runner
WORKDIR /app

# Set environment to production
ENV NODE_ENV production

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

# Set proper ownership for nextjs user
RUN mkdir .next && chown nextjs:nodejs .next

# Copy necessary files from the builder stage
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

# COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Switch to the non-root user
USER nextjs

# Expose port and hostname
ENV PORT 3000
ENV HOSTNAME 0.0.0.0

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]
