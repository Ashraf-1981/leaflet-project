const categoryButtons = document.querySelectorAll(".category-btn");


categoryButtons.forEach(button => {
    button.addEventListener("click", () => {

        const selectedCategory = button.dataset.category;
        
      // Only for All buttons to show all cards, use if...else 
      if (selectedCategory === "All") {
    displayCards(locations);
} else {
    // Filter - new array that only match what user click
    const filteredLocations = locations.filter(location =>
        location.category === selectedCategory
    );

    displayCards(filteredLocations);
}

        // Remove first/Plain map
        markers.forEach(item => {
        map.removeLayer(item.marker);
    });

        // You already created them once when the data loaded unlike cards 
    markers.forEach(item => {
    if (
        selectedCategory === "All" ||
        item.location.category === selectedCategory
    ) {
        item.marker.addTo(map);
    }

});
        console.log(selectedCategory);

    });
}); 