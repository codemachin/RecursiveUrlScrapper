# RecursiveUrlScrapper

Node Mongo recursive url scrapper

## Project Description
```
Recursively crawls through popular blogging website https://medium.com using Node.js and harvests all
possible hyperlinks that belong to medium.com and store them in a mongodb.
```

## Features

	1) Recursive Crawler
	2) Shows all unique urls harvested
    3) The total reference count of every URL.
    4) A complete unique list of parameters associated with this URL.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

	1) Nodejs
	2) Mongodb
	3) NPM
	4) Git

### Installing

Environment : Windows and Linux

Setting Prerequisites

```
1) Start mongodb by running mongod
2) Check node is above version 6.0. Check by typing node -v in terminal
```

Setting up the local server

```
1) Run command npm install
2) After all dependencies are installed. Run command : npm start, in your terminal
3) Let the server start
```

Getting started

```
1) Visit http://localhost:8080/crawl on your browser to start the harvesting process.
2) Visit http://localhost:8080/get on your browser to view all urls with reference counts and unique parameters.
```

## Running the docker image

```
1) Build the docker image using: docker build -t <tag>/<image-name> .
2) Run the docker image by: docker run -p <local-machine-port>:8080 -d <tag>/<image-name>
```

## Deployment on linux server

Prerequisites

```
1) Mongodb
2) Node js version 6 and above
3) Nginx
4) Git
```

Basic Nginx configuration for proxy pass to port 80

```

	server {

	    listen 80;

	    location / {

	            proxy_pass http://localhost:8080;
	    }

	}

```

## Built With

* Mongodb
* Nodejs
* VS Code

## Versioning

RecursiveCrawler version 1.0

## Authors

* **Vivek Shankar** 