FROM node:19.3.0

# Install Dependencies
COPY package*.json ./

RUN npm install --force

# Copy app source code
COPY . .

EXPOSE 8080
# Exports

CMD ["npm","start"]