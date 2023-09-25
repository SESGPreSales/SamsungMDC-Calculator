#!/bin/bash

# Sleep for few seconds to make sure MongoDB has started
sleep 10

# Import data into MongoDB
mongoimport --host localhost --db mdc --collection commands --file /mdc.commands.json --jsonArray
sleep 2 