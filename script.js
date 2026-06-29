// Make it global
let map;
let markers = [];
let locations = [];

document.addEventListener("DOMContentLoaded", function () {
let singapore = [1.29, 103.85]; 

map = L.map("map").setView(singapore, 13); 


L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  // maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

async function loadLocations() {
 
    try {
        const res = await axios.get("/api/locations");
        locations = res.data;

        locations.forEach(loc => {
            // Save marker inside markers array
            const marker = L.marker([loc.lat, loc.lng])
        .bindPopup(`
        <strong>${loc.name}</strong><br>
        📍 ${loc.address}<br>
        🌿 ${loc.category}<br><br>
        ${loc.description}
    `);

            markers.push({
            marker: marker,
            location: loc
});
        });
        
    } catch (err) {
      console.log(err);
    }
}

loadLocations();
});

// Create cards
function displayCards(locations) {

    const cardContainer = document.getElementById("card-container");

    cardContainer.innerHTML = "";

    locations.forEach(location => {

        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <h3>${location.name}</h3>
            <p class="category">${location.category}</p>
            <p class="rating">⭐ ${location.rating}</p>
        `;
        // Make the cards clickable. JS create dynamically
        card.addEventListener("click", () => {

        // return one matching item find()
        const selectedMarker = markers.find(item =>
        item.location.id === location.id
    );
        // Move the map when user click the card and zoom
        map.setView(
        [selectedMarker.location.lat, selectedMarker.location.lng],
        18
    );

    // Make the marker appear 1st
    selectedMarker.marker.addTo(map);
    selectedMarker.marker.openPopup();

});
        cardContainer.appendChild(card);
    });
}

// Clear markers and cards when page loaded
function clearMapAndCards() {

    markers.forEach(item => {
        map.removeLayer(item.marker);
    });

    const cardContainer = document.getElementById("card-container");
    cardContainer.innerHTML = "";
}