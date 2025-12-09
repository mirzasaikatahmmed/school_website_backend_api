FROM node:18-alpine AS builder

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

FROM node:18-alpine

RUN npm install -g pnpm

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Create uploads directory
RUN mkdir -p /app/uploads/notices /app/uploads/events /app/uploads/galleries /app/uploads/staff /app/uploads/downloads /app/uploads/admissions /app/uploads/results

EXPOSE 3000

CMD ["node", "dist/main"]
