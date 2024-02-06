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
        let searchText = document.getElementById('searchInput').value;
        let apiUrl = `URL_DE_LAPI?recherche=${encodeURIComponent(searchText)}`;

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
    axios.get(apiUrl)
        .then(function(response) {
            // Reponse doit etre de la forme :
            // 0 {
            //      id:
            //      lat :
            //      long:
            //      horaire:
            //      place_dispo
            // }
            response.data.forEach(parking => {
                var position = {lat: parking.lat, lng: parking.long};
                new google.maps.Marker({
                    position: position,
                    map: window.map,
                    title: `Parking ID: ${parking.id}`
                });
                new google.maps.InfoWindow({
                    content: `<h3>${parking.name}</h3><p>${parking.horaire}</p><p>${parking.place_dispo}</p>`
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
        name: "Parking Lyon 3.1",
        address: "58 cours albert camus",
        availableSpots: 120,
        hours: "08:00 - 22:00"
    },
    {
        lat: 45.749,
        lng: 4.849,
        name: "Parking Lyon 3.2",
        address: "60 cours ablert thomas",
        availableSpots: 85,
        hours: "07:00 - 21:00"
    },
    {
        lat: 45.750,
        lng: 4.847,
        name: "Parking Lyon 3.3",
        address: "150 rue de part-dieu",
        availableSpots: 75,
        hours: "06:00 - 20:00"
    },
    {
        lat: 45.751,
        lng: 4.850,
        name: "Parking Lyon 3.4",
        address: "10 cours du dauphine",
        availableSpots: 60,
        hours: "08:30 - 22:30"
    },
    {
        lat: 45.752,
        lng: 4.848,
        name: "Parking Lyon 3.5",
        address: "5 rue de bellecour",
        availableSpots: 50,
        hours: "09:00 - 23:00"
    },
];

// Générer 10 places libres aléatoirement autour de Lyon 3
const freeSpots = [];
for (let i = 0; i < 10; i++) {
    freeSpots.push({
        lat: 45.748 + (Math.random() * (45.752 - 45.748)), // Générer un nombre aléatoire entre 45.748 et 45.752
        lng: 4.846 + (Math.random() * (4.850 - 4.846)), // Générer un nombre aléatoire entre 4.846 et 4.850
        name: `Place Libre ${i + 1}`,
        address: `Adresse de la place libre ${i + 1}`,
        availableSpots: 1, // Par défaut, une place libre représente 1 place disponible
        hours: "24/7", // Supposons que les places libres sont disponibles 24/7
        type: 'freeSpot' // Type ajouté pour distinguer les places libres
    });
}

// Fusionner les deux tableaux
const allSpots = parkings.concat(freeSpots);

function addParkingMarkers(map) {
    allSpots.forEach(function(spot) {
        // Choisir l'icône en fonction du type de l'emplacement
        const iconUrl = spot.type === 'freeSpot'
            ? 'https://maps.google.com/mapfiles/ms/icons/purple-dot.png'
            : 'https://maps.google.com/mapfiles/ms/icons/orange-dot.png';

        let marker = new google.maps.Marker({
            position: {lat: spot.lat, lng: spot.lng},
            map: map,
            title: spot.name,
            icon: iconUrl // Utiliser l'URL de l'icône en fonction du type
        });

        let infoWindowContent = `
            <h3>${spot.name}</h3>
            <p>${spot.address}</p>
            <p>Places disponibles: ${spot.availableSpots}</p>
            <p>Horaires: ${spot.hours}</p>
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
