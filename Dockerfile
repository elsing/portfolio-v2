# Set base image
FROM node:lts-alpine

# Set working directory
WORKDIR /opt/landing

# Copy rest of the source code
COPY ./landing /opt/landing

# Install dependencies
RUN npm ci

# Build the app
RUN npm run build

# # Expose port
# EXPOSE 3000

# Run the production server
CMD ["npm", "run", "start"]
