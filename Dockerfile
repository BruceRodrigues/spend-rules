FROM oven/bun:1

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY prisma ./prisma
RUN bunx prisma generate

COPY . .

EXPOSE 3000

CMD ["bun", "--bun", "next", "dev", "--hostname", "0.0.0.0"]
