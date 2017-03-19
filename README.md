# urlshortner
A sample URL shortner

This is a dockerized app for shortening URLs.

##Requirements:
-> Docker Daemon
-> nodeJs
-> npm


##Steps to run:
1. Go the project root directory containing the Dockerfile and create a docker container by executing:
`docker build -t urlshortner:1.0 .`

2. Start the container
`docker run -p 3000:3000 urlshortner:1.0`

3. Access the app from browser as following:
`http://localhost:3000/`
