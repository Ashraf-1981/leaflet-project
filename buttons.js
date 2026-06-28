const categoryButtons = document.querySelectorAll(".category-btn");


categoryButtons.forEach(button => {
    button.addEventListener("click", () => {

        const selectedCategory = button.dataset.category;

        markers.forEach(item => {
        map.removeLayer(item.marker);
    });

    markers.forEach(item => {

    if (item.location.category === selectedCategory) {
        item.marker.addTo(map);
    }

});
        console.log(selectedCategory);

    });
}); 