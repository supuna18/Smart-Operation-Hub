# Node image එක භාවිතා කිරීම
FROM node:20-alpine
WORKDIR /app

# Dependencies install කිරීම
COPY package*.json ./
RUN npm install

# Code එක copy කරලා run කිරීම
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host","0.0.0.0"]
