# Use official Node.js image as a base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the Next.js application
COPY . .

# Build the Next.js application for production
RUN npm run build

# Expose the port Next.js will run on
EXPOSE 3000

# Run the Next.js application in production mode
CMD ["npm", "start"]
