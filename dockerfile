
# from base image node
FROM node:8.11-slim

RUN apk add --no-cache python g++ make

WORKDIR /app

# copying all the files from your file system to container file system
COPY package.json .

# install all dependencies
RUN npm install

# copy oter files as well
COPY ./ .

#expose the port
EXPOSE 3000

# command to run when intantiate an image
CMD ["npm","run", "run"]