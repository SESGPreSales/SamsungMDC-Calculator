# Samsung MDC Calculator Tool

> **WARNING**
Provided as is - Please audit the code before using it.
No Support

## Description
Feel free to use this simple Samsung MDC tool to generate HEX commands to be used with Samsung Smart Signage Devices.
working demo here: https://mdc.sesg.ch 

## How it works
The app is composed of three containers, started using docker compose (has to be already installed on the host -> Get Docker here: https://docs.docker.com/engine/install/ )

- `db` hosts the data
- `backend` provides an API to query the database.
- `frontend` serves static HTML, JavaScript, and CSS. 

## How to Quickly Start
create a docker-compose.yml file in your host
```
version: '3'

services:
  db:
    image: ircnega/mdc_db:1.0.2
    ports:
      - "27017"
    restart: always

  backend:
    image: ircnega/mdc_backend:1.1.0
    ports:
      - "3000"
    restart: always

  frontend:
    image: ircnega/mdc_frontend:1.1.0
    ports:
      - "80:80"
    restart: always

```
Then run `docker compose up -d`

Open `http://localhost` on your browser to use the calculator.

## How to Start - Build yourself: 
clone this repo to your local workspace
````
git clone https://github.com/TBEMSESG/SamsungMDC-Calculator.git

cd SamsungMDC-Calculator
````
Then run docker container with `docker compose up -d`

Open `http://localhost` on your browser to use the calculator.

How to update for newer version: 
````
git pull
docker compose up -d --build
````

## How to customize
The frontend is running on the default port 80. If that port is already in use, please modify the `docker-compose.yml` file to your setup. Change `- "80:80"` to whatever best fits:

```
  frontend:
    build: ./frontend/
    ports:
      - "8081:80"
    restart: always
    
```
