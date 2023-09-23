const express = require('express');
const app = express();
const {MongoClient} = require('mongodb');

const uri = "mongodb://admin:mdcpassword@localhost:27017";

async function run() {
    let res = [];
    const client = new MongoClient(uri);
    console.log('open connection')
    try {
    
    // Get the database and collection on which to run the operation
    const database = client.db("mdc");
    const commands = database.collection("commands");
    // Query for movies that have a runtime less than 15 minutes
    const query = {};
    const options = {
      // Sort returned documents in ascending order by title (A->Z)
      sort: { name: 1 },
      // Include only the `title` and `imdb` fields in each returned document
      projection: { _id: 1,name: 1, Description: 1 }
    };
    // Execute query 
    const cursor = commands.find(query, options);
    // Print a message if no documents were found
    if ((await commands.countDocuments(query)) === 0) {
        console.log("No documents found!");
    }
    // Print returned documents
    for await (const doc of cursor) {
        res.push(doc)
    }
    return res;
} finally {
    await client.close();
    console.log('connection closed');
  }
}


app.get('/tablecontent', function (req, res) {
    run().then((result) => {
        res.status(901).send(result);
    }).catch((error) => {
        console.error(error);
        res.status(500).send('Internal Server Error');
    });
});






app.listen(3000)
console.log("listening on port 3000")