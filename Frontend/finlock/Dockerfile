FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

# Expose your local React development port (change to 5173 if you are using Vite!)
EXPOSE 3000

CMD ["npm", "start"]