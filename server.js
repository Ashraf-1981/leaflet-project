
const express = require('express');
const cors = require('cors');
const axios = require('axios');


const BIN_ID = "6a3e72e3f5f4af5e2934268a";
const API_KEY = "$2a$10$EYIX7s4QDwq.4ALVh2lVmu17S7xDvU27dS1OkGkvU.Tipnp/6TQ7."
// For GET to read Only
const BIN_READ_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}/latest`;
// For PUT to amend
const BIN_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;


const app = express();
const port = 3000;

// IMPORTANT
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Restful API - "Get & Put"
// GET /latest → works (read data)
// PUT /latest → 404 (not allowed)

// HOME PAGE(/) and create GET route in Express
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Use async.... to communicate with JsonBin
app.get('/api/locations', async (req, res) => {
  
    // Start to talk to JsonBin and download
    try {
    const response = await axios.get(BIN_READ_URL, {
      headers: {
        "X-Master-Key": API_KEY
      }
    });
      res.json(response.data.record.record);

  } catch (error) {
    res.status(500).json({ error: "API failed" });
  }
});

  // Create PUT route in Express(:id is the parameter)
  // :id and favourite lets Express know which location is the id in
    app.put("/api/locations/:id", async (req, res) => {

    try {
        const id = parseInt(req.params.id);
        const favourite = req.body.favourite;

        // GET data from JSONBin
        const response = await axios.get(BIN_READ_URL, {
        headers: {
        "X-Master-Key": API_KEY
    }
});
        
        // Get the array of locations
        const locations = response.data.record.record;

          // find correct item
        const selectedLocation = locations.find(location =>
            location.id === id
        );

        if (!selectedLocation) {
            return res.status(404).json({ error: "Location not found" });
        }

        // update value
        selectedLocation.favourite = favourite;

        // save back to JSONBin using the BIN_URL only
        await axios.put(BIN_URL, {
            record: locations
        }, {
            headers: {
                "Content-Type": "application/json",
                "X-Master-Key": API_KEY
            }
        });

        res.json({ message: "Updated successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }

});

app.listen(port, () => {
  console.log("Server running on 3000");
});