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
//     markers.forEach(item => {
//     map.removeLayer(item.marker);
// });
        map.removeLayer(natureLayer);
        map.removeLayer(foodLayer);
        map.removeLayer(mallLayer);
        map.removeLayer(landmarkLayer);       

   
    if (selectedCategory === "Nature") {
    natureLayer.addTo(map);
}
else if (selectedCategory === "Food") {
    foodLayer.addTo(map);
}
else if (selectedCategory === "Malls") {
    mallLayer.addTo(map);
}
else if (selectedCategory === "Landmarks") {
    landmarkLayer.addTo(map);
}
else if (selectedCategory === "All") {
    natureLayer.addTo(map);
    foodLayer.addTo(map);
    mallLayer.addTo(map);
    landmarkLayer.addTo(map);
}
    console.log(selectedCategory);

    });
}); 

    // Dropdown
    const sortDropdown = document.getElementById("sort-dropdown");
        sortDropdown.addEventListener("change", () => {

    // Spread operator to create a copy of locations array
    // Instead make a copy then the original data remains untouched
    // I sort the copy instead the original
    let sortedLocations = [...locations];

    if (sortDropdown.value === "name") {
        // For text use localeCompare
        sortedLocations.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (sortDropdown.value === "rating") {
        // For numbers, descending order
        sortedLocations.sort((a, b) => b.rating - a.rating);
    }

    displayCards(sortedLocations);

});

    // Checkbox
    const favouriteCheckbox = document.getElementById("favourite-checkbox");
        favouriteCheckbox.addEventListener("change", () => {

    if (favouriteCheckbox.checked) {

    const favouriteLocations = locations.filter(location =>
        location.favourite
        );

    displayCards(favouriteLocations);

} else {

    displayCards(locations);
}

});