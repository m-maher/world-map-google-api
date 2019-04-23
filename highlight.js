
$('.dropdown-item').on('click',function(){
    $(".goToCountry").css("display","block");
})

var map;

var country;

var customMapStyle = [
    {
        "featureType": "administrative",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry",
        "stylers": [
            {
                "visibility": "off"
            },
            {
                "color": '#ffffff'
            }
        ]
    },
    {
        "featureType": "landscape",
        "stylers": [
            {
                "color": "#abd5ff"
            }
        ]
    },
    {
        "featureType": "poi",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "water",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    }
];

var customMapStyle2 = [
    {
        "featureType": "administrative.country",
        "elementType": "labels.text",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "administrative.country",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#000000"
            }
        ]
    },
    {
        "featureType": "administrative.country",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "administrative.country",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "weight": "2"
            }
        ]
    },
    {
        "featureType": "administrative.locality",
        "elementType": "labels.text",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative.province",
        "elementType": "labels.text",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry",
        "stylers": [
            {
                "visibility": "off"
            },
            {
                "color": '#ffffff'
            }
        ]
    },
    {
        "featureType": "landscape",
        "stylers": [
            {
                "color": "#abd5ff"
            }
        ]
    },
    {
        "featureType": "poi",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "water",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    }
];

function initialize() {
    var center = { lat: 26.8206, lng: 30.8025 }
    map = new google.maps.Map(document.getElementById('map'),{
        center: center,
        zoom: 2 ,
        maxZoom: 5,
        minZoom: 2,
        styles: customMapStyle,
        disableDefaultUI: true,
        gestureHandling: 'greedy'
    });

    // Initialize JSONP request
    var script = document.createElement('script');
    var url = ['https://www.googleapis.com/fusiontables/v1/query?'];
    url.push('sql=');
    var query = 'SELECT name, kml_4326 FROM ' +
        '1foc3xO9DyfSIF6ofvN0kp2bxSfSeKog5FbdWdQ';
    var encodedQuery = encodeURIComponent(query);
    url.push(encodedQuery);
    url.push('&callback=drawMap');
    url.push('&key=AIzaSyAm9yWCV7JPCTHCJut8whOjARd7pwROFDQ');
    script.src = url.join('');
    var body = document.getElementsByTagName('body')[0];
    body.appendChild(script);
}

var countries = [];
var allCountries = [];
var currentCountry = {}

function drawMap(data) {
    var rows = data['rows'];
    for (var i in rows) {
        if (rows[i][0] != 'Antarctica') {
            var newCoordinates = [];
            var geometries = rows[i][1]['geometries'];
        if (geometries) {
            for (var j in geometries) {
                newCoordinates.push(constructNewCoordinates(geometries[j]));
            }
        } else {
            newCoordinates = constructNewCoordinates(rows[i][1]['geometry']);
        }

        country = new google.maps.Polygon({
            paths: newCoordinates,
            strokeColor: '#ffffff',
            strokeOpacity: 1,
            strokeWeight: 0.3,
            fillColor: '#abd5ff',
            fillOpacity: 1,
            name: rows[i][0]
        });

        allCountries.push(country);

        geocoder = new google.maps.Geocoder();

        var flag = true;
        google.maps.event.addListener(country, 'mouseover', function() {
            if(flag == true && $(this)[0].fillOpacity == 1) {
                this.setOptions({fillOpacity: 1, fillColor:'blue'}); 
            }else{
                this.setOptions({fillOpacity: 0.5});
            }   
            flag = true;  
        });
        google.maps.event.addListener(country, 'mouseout', function() {
            if(flag == true && ($(this)[0].fillOpacity == 1 || $(this)[0].fillOpacity == 0.4)){
                this.setOptions({fillOpacity: 1,fillColor:'#abd5ff'});
            }else{
                $(this)[0].fillOpacity == 0.5
            }
            flag = true; 
        });
        google.maps.event.addListener(country, 'click', function() {
            window.open('https://www.google.com.eg/maps','_blank');
        });
            country.setMap(map);
        }
    }   
}

function constructNewCoordinates(polygon) {
    var newCoordinates = [];
    var coordinates = polygon['coordinates'][0];
    for (var i in coordinates) {
        newCoordinates.push(
            new google.maps.LatLng(coordinates[i][1], coordinates[i][0])
        );
    }
    return newCoordinates;
}

var countryMark;

$(".CountryMark").click(function () {
    countryMark = $(".CountryMark").text();
    getCountryByName(countryMark);
    getCountry(countryMark);
});

$(".CountryMark1").click(function () {
    countryMark = $(".CountryMark1").text();
    getCountryByName(countryMark);
    getCountry(countryMark)
});

var markers = [];

function getCountry(address) {

    geocoder.geocode( { 'address': address }, function(results, status) {

        if (status == 'OK') {

            map.setCenter(results[0].geometry.location);

            deleteMarkersAndColors()
           
            var marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location
            })
            
            markers.push(marker);

            country = currentCountry[0];

            countries.push(country)

            country.setOptions({
                fillColor:'blue',
                fillOpacity: 0.5
            })

            country.setMap(map);

            map.setOptions({
                styles: customMapStyle2,
                zoom:5
            });
        }
    });    
}

function setMarkersAndColors(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
    for (var i = 0; i < countries.length; i++) {
        countries[i].setMap(map);
    }
}

function deleteMarkersAndColors() {
    setMarkersAndColors(null); 
}

function getCountryByName(name) {
    currentCountry = allCountries.filter(country => country.name == name);
}
    
function goToCountry() {
    window.open('https://www.google.com.eg/maps','_blank');
}
