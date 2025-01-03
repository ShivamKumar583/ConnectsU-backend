# Use an official Node.js runtime as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /server

# Copy only the package.json and package-lock.json to install dependencies first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Expose the port your Express.js app listens on (adjust if necessary)
EXPOSE 4000

# Set the command to start the Express.js server
CMD ["node", "index.js"]
