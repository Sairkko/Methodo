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


function searchParking() {
    var searchText = document.getElementById('searchInput').value;
    var apiUrl = `URL_DE_LAPI?recherche=${encodeURIComponent(searchText)}`;

    axios.get(apiUrl)
        .then(function(response) {
            // Reponse doit etre de la forme :
            // 0 {
            //      id:
            //      lat :
            //      long:
            // }
            response.data.forEach(parking => {
                var position = {lat: parking.lat, lng: parking.long};
                new google.maps.Marker({
                    position: position,
                    map: window.map,
                    title: `Parking ID: ${parking.id}`
                });
            });
        })
        .catch(function(error) {
            console.log('Erreur lors de la récupération des données:', error);
        });
}