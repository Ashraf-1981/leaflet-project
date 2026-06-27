
const express = require('express');
const cors = require('cors');
const axios = require('axios');


const BIN_ID = "6a3e72e3f5f4af5e2934268a";
const API_KEY = "$2a$10$EYIX7s4QDwq.4ALVh2lVmu17S7xDvU27dS1OkGkvU.Tipnp/6TQ7."
const BIN_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}/latest`;


const app = express();
const port = 3000;

// IMPORTANT
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// HOME PAGE
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// API
app.get('/api/locations', async (req, res) => {
  try {
    const response = await axios.get(BIN_URL, {
      headers: {
        "X-Master-Key": API_KEY
      }
    });

    res.json(response.data.record);

  } catch (error) {
    res.status(500).json({ error: "API failed" });
  }
});

app.listen(port, () => {
  console.log("Server running on 3000");
});