# Use Node.js LTS as the base image
FROM node:18

# Create a directory for the app
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the app files
COPY . .

# Expose the port (if needed, for any future API or web server)
# EXPOSE 3000

# Command to run the Node.js app
CMD ["node", "index.js"]
