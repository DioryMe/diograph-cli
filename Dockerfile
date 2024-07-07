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

# Set the working directory in the container
WORKDIR /usr/src/app

# Install project dependencies
COPY package.json yarn.lock ./
RUN yarn

# Copy the current directory contents into the container at /usr/src/app
COPY . .

RUN yarn build

RUN npm link

# Set environment variables
ENV FFMPEG_PATH=/usr/bin/ffmpeg

# Run robot tests when the container launches
CMD ["dcli", "--version"]
# CMD ["robot", "tests/main.robot"]
