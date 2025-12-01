# Set base image
FROM node:22-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the source code
COPY . .

# Build the app
RUN npm run build

# Expose port
EXPOSE 3000

# Run the production server
CMD ["npm", "run", "start"]
