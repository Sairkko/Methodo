function initMap() {
    console.log('Chargement de la carte...'); // Message indiquant le début du chargement de la carte.

    // Options de la carte par défaut.
    let defaultOptions = {
        zoom: 14,
        center: {lat: 45.764043, lng: 4.835659} // Coordonnées par défaut (Lyon)
    };

    // Création de la carte.
    let map = new google.maps.Map(document.getElementById('map'), defaultOptions);

    // Ajouter les marqueurs des parkings
    addParkingMarkers(map);

    // Fonction de rappel en cas de succès de la géolocalisation.
    function handleLocationSuccess(position) {
        let userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };

        // Mettre à jour le centre de la carte et le marqueur.
        map.setCenter(userLocation);
        new google.maps.Marker({
            position: userLocation,
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
    // Fonction de rappel en cas d'échec de la géolocalisation.
    function handleLocationError(error) {
        console.warn(`ERROR(${error.code}): ${error.message}`);
        // Vous pouvez gérer les erreurs ici, par exemple en affichant un message à l'utilisateur.
    }

    // Demander la position de l'utilisateur.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(handleLocationSuccess, handleLocationError);
    } else {
        console.error("La géolocalisation n'est pas supportée par ce navigateur.");
        // Gérer le cas où la géolocalisation n'est pas supportée.
    }
}

const parkings = [
    {
        lat: 45.748,
        lng: 4.846,
        name: "Parking Lyon 3 - 1",
        address: "Adresse du Parking Lyon 3 - 1",
        availableSpots: 120,
        hours: "08:00 - 22:00"
    },
    {
        lat: 45.749,
        lng: 4.849,
        name: "Parking Lyon 3 - 2",
        address: "Adresse du Parking Lyon 3 - 2",
        availableSpots: 85,
        hours: "07:00 - 21:00"
    },
    {
        lat: 45.750,
        lng: 4.847,
        name: "Parking Lyon 3 - 3",
        address: "Adresse du Parking Lyon 3 - 3",
        availableSpots: 75,
        hours: "06:00 - 20:00"
    },
    {
        lat: 45.751,
        lng: 4.850,
        name: "Parking Lyon 3 - 4",
        address: "Adresse du Parking Lyon 3 - 4",
        availableSpots: 60,
        hours: "08:30 - 22:30"
    },
    {
        lat: 45.752,
        lng: 4.848,
        name: "Parking Lyon 3 - 5",
        address: "Adresse du Parking Lyon 3 - 5",
        availableSpots: 50,
        hours: "09:00 - 23:00"
    },
];

function addParkingMarkers(map) {
    parkings.forEach(function(parking) {
        let marker = new google.maps.Marker({
            position: {lat: parking.lat, lng: parking.lng},
            map: map,
            title: parking.name,
            icon: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png' // URL de l'icône du marqueur
        });

        let infoWindowContent = `
            <h3>${parking.name}</h3>
            <p>${parking.address}</p>
            <p>Places disponibles: ${parking.availableSpots}</p>
            <p>Horaires: ${parking.hours}</p>
        `;

        let infoWindow = new google.maps.InfoWindow({
            content: infoWindowContent
        });

        marker.addListener('click', function() {
            infoWindow.open(map, marker);
        });
    });
}

window.onload = function() {
    // Appeler initMap pour la première fois immédiatement.
    initMap();

    // Ensuite, appeler initMap toutes les 60 secondes.
    setInterval(initMap, 60000);

    // Ajouter l'écouteur d'événement pour le bouton d'actualisation
    document.getElementById('refreshMap').addEventListener('click', function() {
        initMap();
    });
};
