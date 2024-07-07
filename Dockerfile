# Use an official Python runtime as a parent image
FROM python:3.10

# Install any needed packages specified in requirements.txt
RUN pip install robotframework robotframework-requests robotframework-browser

# Install Node.js and yarn
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g yarn

# Install ffmpeg
RUN apt-get update && apt-get install -y ffmpeg
ENV FFMPEG_PATH=/usr/bin/ffmpeg

# Set the working directory in the container
WORKDIR /usr/src/app

# Install project dependencies
COPY package.json yarn.lock ./
RUN yarn

# Copy and build the source code
COPY . .
RUN yarn build

# Enable dcli command
RUN npm link

# Set correct path as demo-content-room address
RUN sed -i 's|"/Diory Content",|"'$(pwd)'/tests/demo-content-room/Diory Content",|g' tests/demo-content-room/room.json

# Run robot tests when the container launches
CMD ["robot", "tests/main.robot"]
