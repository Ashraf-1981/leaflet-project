// Make it global
let map;
let markers = [];
let locations = [];

// Create cards emoji in an object
const categoryIcons = {
    Nature: "🌿",
    Food: "🍜",
    Malls: "🛍️",
    Landmarks: "🏛️"
};

document.addEventListener("DOMContentLoaded", function () {
let singapore = [1.29, 103.85];

// Setting for user click at empty map for everything return as default
const defaultCenter = singapore;
const defaultZoom = 13;
map = L.map("map").setView(defaultCenter, defaultZoom);

// Detect a click on empty area on map
map.on("click", () => {
    // Clear all markers and cards
     clearMapAndCards();
    //  Return default map
    map.setView(defaultCenter, defaultZoom);
});


L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

// Create custom icons
const markerIcons = {
    Nature: L.icon({
        iconUrl: "images/marker-icon-green.png",
        shadowUrl: "images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34]
    }),

    Food: L.icon({
        iconUrl: "images/marker-icon-red.png",
        shadowUrl: "images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34]
    }),

    Malls: L.icon({
        iconUrl: "images/marker-icon-violet.png",
        shadowUrl: "images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34]
    }),

    Landmarks: L.icon({
        iconUrl: "images/marker-icon-blue.png",
        shadowUrl: "images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34]
    })
};

async function loadLocations() {
 
    try {
        const res = await axios.get("/api/locations");
        locations = res.data;

        locations.forEach(loc => {
    // Save marker inside markers array
        const marker = L.marker([loc.lat, loc.lng], {
    icon: markerIcons[loc.category]
}).bindPopup(`
        <h3>${loc.name}</h3>
        📍 ${loc.address}<br>
       <strong>${categoryIcons[loc.category]} ${loc.category}
</strong><br><br>
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
            <h3>${categoryIcons[location.category]} ${location.name}</h3>
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