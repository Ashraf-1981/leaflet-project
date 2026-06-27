// Create Express as backend to act as the middle man
// Express talking to JsonBin and frontend talking to Express
// Test axios is working and able to get data from JsonBin
const express = require('express');
const cors = require('cors');
const axios = require('axios');

// Create JsonBin as an online data storage to apply restful API
const BIN_ID = "6a3e72e3f5f4af5e2934268a";
const API_KEY = "$2a$10$EYIX7s4QDwq.4ALVh2lVmu17S7xDvU27dS1OkGkvU.Tipnp/6TQ7."
const BIN_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}/latest`;

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());
app.use(express.static(__dirname));


// serve frontend page
// Create Get and test express is running. API route
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});



// Call JsonBin and try...catch to handle errors
app.get('/api/locations', async (req, res) => {
try {
  const response = await axios.get(BIN_URL, {
  headers: {
    "X-Master-Key": API_KEY
  }
});

// JsonBin returns the data back to the frontend
res.json(response.data.record);

} catch (error) {
  res.status(500).json({
  error: "Failed to retrieve data from JSONBin"
});

}
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 
