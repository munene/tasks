FROM node:12

# Set working directory
WORKDIR /usr/src/app

# Install dependencies
COPY package.json ./
RUN npm Install

# Copy src files
COPY . .

# Build app
RUN npm run Build

# Run the app
CMD ["npm", "start"]