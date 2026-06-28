let map;
let markers = [];

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
        const locations = res.data;

        locations.forEach(loc => {
            const marker = L.marker([loc.lat, loc.lng])
                .bindPopup(loc.name);

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