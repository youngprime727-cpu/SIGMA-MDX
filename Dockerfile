FROM node:lts-buster

# Clone the repository into /root/SIGMA-MDX
RUN git clone https://github.com/muzantech/SIGMA-MDX.git /root/SIGMA-MDX

# Set working directory
WORKDIR /root/SIGMA-MDX

# Install dependencies
RUN npm install && npm install -g pm2 || yarn install --network-concurrency 1

# Expose port
EXPOSE 9090

# Start the bot
CMD ["npm", "start"]
