# Set base image
FROM node:24-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy rest of the source code
COPY . .

# Lint
RUN npm run lint

# Build the app
RUN npm run build

# Expose port
EXPOSE 3000

# Run the production server
CMD ["npm", "run", "start"]
