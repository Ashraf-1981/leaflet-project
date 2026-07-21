
const express = require('express');
const cors = require('cors');
const axios = require('axios');


const BIN_ID = "6a3e72e3f5f4af5e2934268a";
const API_KEY = "$2a$10$EYIX7s4QDwq.4ALVh2lVmu17S7xDvU27dS1OkGkvU.Tipnp/6TQ7."
// For GET to read Only
const BIN_READ_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}/latest`;
// For PUT to amend
const BIN_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

// Create express applications
const app = express();
const port = 3000;

// IMPORTANT. _dirame:project folder like index.html, css etc
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// GET /latest → works (read data)
// PUT /latest → 404 (not allowed)

// HOME PAGE(/). Express get req from frontend/browser and res back index.html to them
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Use async.... express get req from frontend to communicate with JsonBin/backend
// to get something
app.get('/api/locations', async (req, res) => {
  
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

  // "Express receives a PUT request to update, from the frontend.(:id is the parameter)
  // :id and favourite lets Express know which location to find and change
    app.put("/api/locations/:id", async (req, res) => {

    try {
        const id = parseInt(req.params.id);
        // { favourite: favourite } — is the request body is from scrip.js
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