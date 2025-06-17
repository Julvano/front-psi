function initMap() {
    const bureau = { lat: 48.8566, lng: 2.3522 }; // Exemple : Cotonou
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 14,
        center: bureau,
    });
    const marker = new google.maps.Marker({
        position: bureau,
        map: map,
        title: "Notre bureau à Cotonou",
    });
}