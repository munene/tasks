FROM node:12

# Set working directory
WORKDIR /usr/src/app

# Install dependencies
COPY package.json ./
RUN npm install

# Copy src files
COPY . .

# Build app
RUN npm run build

# Run the app
CMD ["npm", "start"]
EXPOSE 3000