# 1. Use the official Node image
FROM node:18-alpine

# 2. Set the working directory inside the container
WORKDIR /usr/src/app

# 3. Copy package files first to leverage Docker caching
COPY package*.json ./

# 4. Install production dependencies
RUN npm install

# 5. Copy the entire backend source code (including src/, public/, etc.)
COPY . .

# 6. Expose your backend port (from your .env)
EXPOSE 4000

# 7. Use the start script that points to node src/index.js
CMD ["npm", "start"]