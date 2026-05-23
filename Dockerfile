# TAHAP 1: Membangun (Build) aplikasi React/Vite
FROM node:24-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Perintah ini akan menghasilkan folder 'dist'
RUN npm run build

# TAHAP 2: Menyajikan dengan Nginx
FROM nginx:alpine
# Hapus halaman default Nginx
RUN rm -rf /usr/share/nginx/html/*
# Copy hasil folder 'dist' dari TAHAP 1 ke Nginx
COPY --from=build /app/dist /usr/share/nginx/html
# Copy aturan Nginx yang baru saja kita buat
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Nginx berjalan di port 80
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]