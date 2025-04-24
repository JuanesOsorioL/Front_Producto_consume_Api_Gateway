# frontend/Dockerfile
FROM nginx:alpine

# Copia el contenido del frontend a la carpeta HTML pública de nginx
COPY . /usr/share/nginx/html

# Expone el puerto por defecto
EXPOSE 80