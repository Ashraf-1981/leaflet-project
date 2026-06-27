document.addEventListener("DOMContentLoaded", function () {
  let map = L.map("map").setView([1.3521, 103.8198], 12);

 L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  map.invalidateSize();

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