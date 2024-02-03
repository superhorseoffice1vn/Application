# Use a base image with Node.js 16 for Angular
FROM node:16 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . ./
RUN npm run build

# Use Nginx as the base image
FROM nginx:latest

# Copy Angular build to Nginx static folder
COPY --from=build /app/dist/fe /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Command to start Nginx
CMD ["nginx", "-g", "daemon off;"]
