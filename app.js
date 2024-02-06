function initMap() {
    let lyon = {lat: 45.764043, lng: 4.835659}; // Coordonnées de Lyon
    let map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: lyon
    });
    var marker = new google.maps.Marker({
        position: lyon,
        map: map
    });
}
