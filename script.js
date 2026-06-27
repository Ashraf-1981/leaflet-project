document.addEventListener("DOMContentLoaded", function () {
  let singapore = [1.29, 103.85]; // #1 Singapore latlng
let map = L.map("map").setView(singapore, 13); 


// setup the tile layers
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  // maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

  axios.get("/api/locations")
    .then(res => {
      const locations = res.data;

      locations.forEach(loc => {
        L.marker([loc.lat, loc.lng])
          .addTo(map)
          .bindPopup(loc.name);
      });
    })
    .catch(err => console.log(err));
});