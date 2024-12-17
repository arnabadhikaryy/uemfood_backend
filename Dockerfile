# Use the official Node.js image as a base image
FROM node:16

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json (or yarn.lock) first to leverage Docker cache
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of your application code to the container
COPY . .

# Expose the port the app will run on (replace with your application's port)
EXPOSE 3000

# Command to run the Node.js app (replace with the actual start command of your app)
CMD ["npm run dev"]
