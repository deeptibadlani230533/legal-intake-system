# Use lightweight Node image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy remaining project files
COPY . .

# Expose backend port
EXPOSE 3000

# Run development server
CMD ["npm", "run", "dev"]