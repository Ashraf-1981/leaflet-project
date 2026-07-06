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

const searchInput = document.getElementById("search-input");
// Listen user press the Enter key after type in the searchbar
searchInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {
        // Change the words to lowerCase
        const searchText = searchInput.value.toLowerCase();
        // Loop and Find through the markers [..]
        const foundLocation = markers.find(item =>
        // Include the search for partial name also
        item.location.name.toLowerCase().includes(searchText)
);
    // Check if there is a matching attraction
    // Create popUp, marker and Zoom to it
    if (foundLocation) {
    map.setView(
        [foundLocation.location.lat, foundLocation.location.lng],18
    );  
        // Show marker,popUp and zoom
        foundLocation.marker.addTo(map);
        foundLocation.marker.openPopup();
        // Show only the searched card
        displayCards([foundLocation.location]);

}   else {
    alert("Attraction not found.");
}
    console.log(foundLocation);
    }
});

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
// https://github.com/pointhi/leaflet-color-markers
const markerIcons = {
    Nature: L.icon({
        iconUrl: "images/marker-icon-green.png",
        shadowUrl: "images/marker-shadow.png",
    }),

    Food: L.icon({
        iconUrl: "images/marker-icon-red.png",
        shadowUrl: "images/marker-shadow.png",
    }),

    Malls: L.icon({
        iconUrl: "images/marker-icon-violet.png",
        shadowUrl: "images/marker-shadow.png",
    }),

    Landmarks: L.icon({
        iconUrl: "images/marker-icon-blue.png",
        shadowUrl: "images/marker-shadow.png",
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
})      .bindPopup(`
        <h3>${loc.name}</h3>
        📍 ${loc.address}<br>
       <strong>${categoryIcons[loc.category]} ${loc.category}</strong><br><br>
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

        // Create variable for save/unsave buttons
        // Create clickable buttons(favourite-btn) & locations where it belongs
        let heartIcon;

        if (location.favourite) {
           heartIcon = ` Add <i class="fa-solid fa-heart favourite-btn" 
           data-id="${location.id}"></i> Favourite`;
}       else {
           heartIcon = `<span class="add-text">Add</span><i class="fa-regular fa-heart favourite-btn" 
           data-id="${location.id}"></i> Favourite`;
}
        card.innerHTML = `
            <h3>${categoryIcons[location.category]} ${location.name}</h3>
            <p class="favourite">${heartIcon}</p>
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

        // Favourite toggle,save/unsaved
        // Stop clicking the cards too as it's in the cards. Separate them
        const heart = card.querySelector(".favourite-btn");

        // Send a PUT request to express server
        heart.addEventListener("click", async (event) => {
        event.stopPropagation();

        const id = heart.dataset.id;

        let favourite;

        // This false/true is the new favourite value sent by frontend
        // when heartIcon is clicked/unclicked
        if (location.favourite) {
            favourite = false;
}       else {
            favourite = true;
}       
        // Frontend ask Express find the id as (Read only first)
        await axios.put(`/api/locations/${id}`, {
        favourite: favourite
});

// find the correct item in array
const selected = locations.find(loc => loc.id === parseInt(id));

        if (selected) {selected.favourite = favourite;}

        displayCards(locations);
       
});
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