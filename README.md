# Samsung MDC Calculator Tool

> **WARNING**
Provided as is - Please audit the code before using it.
No Support

## Description
Feel free to use this simple Samsung MDC tool to generate HEX commands to use with Samsung Smart Signage Devices.
working demo here : https://mdc.sesg.ch 

## How it work
The app is composed of three containers, startd using docker compose (needed already installed on the host).

- `db` hosts the data
- `backend` provides an API to query the database.
- `frontend` serves static HTML, JavaScript and CSS. 

## How to Start
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
The frontend is running on the default port 80. In case the port is already in use, feel free to modify the `docker-compose.yml` file:
```
  frontend:
    build: ./frontend/
    ports:
      - **"8081**:80"
    restart: always
    volumes:
      - ./frontend/html:/usr/share/nginx/html
```