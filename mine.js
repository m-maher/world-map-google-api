
var map

var country

var allCountries = []

var currentCountry = {}

var lastCountry = ''

var countryMark

var markers = []

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
        zoom: 3 ,
        maxZoom: 5,
        minZoom: 3,
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

function drawMap(data) {
    var rows = data['rows'];
    for (var i in rows) {
        if (rows[i][0] != 'Antarctica' ) {
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
            fillColor: '#227194',
            fillOpacity: 0,
            name: rows[i][0]
        });

        allCountries.push(country);

        geocoder = new google.maps.Geocoder();
            
        var flag = true; //hover flag
        google.maps.event.addListener(country, 'mouseover', function() {
            if(flag == true && $(this)[0].fillOpacity == 0) {
                this.setOptions({fillOpacity: 0.99}); 
            }else{
                this.setOptions({fillOpacity: 1});
            }   
            flag = true;  
        });
        google.maps.event.addListener(country, 'mouseout', function() {
            if(flag == true && ($(this)[0].fillOpacity == 0 || $(this)[0].fillOpacity == 0.99)){
                this.setOptions({fillOpacity: 0});
            }else{
                $(this)[0].fillOpacity == 1
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

$(".CountryMark").click(function () {
    countryMark = $(".CountryMark").text();
    $(".btn-secondary").text(countryMark);
    getCountryByName(countryMark);
    getCountry(countryMark);
});

$(".CountryMark1").click(function () {
    countryMark = $(".CountryMark1").text();
    $(".btn-secondary").text(countryMark);
    getCountryByName(countryMark);
    getCountry(countryMark)
});

$('.dropdown-item').on('click',function(){
    $('.goToCountry').show()
})

function getCountry(address) {

    geocoder.geocode( { 'address': address }, function(results, status) {

        if (status == 'OK') {

            map.setCenter(results[0].geometry.location);

            if(markers != null){
                deleteMarkerAndColor()
            }

            var marker = new google.maps.Marker({
                position: results[0].geometry.location,
                map: map,
                label:{
                    text: address,
                    color: "#ffffff",
                    fontSize: "12px",
                    fontWeight: "bold",
                    fontFamily: "Segoe UI"
                },
                icon:{
                    url: 'Assets/Images/SVGs/marker-icon-01.svg', // url
                    scaledSize: new google.maps.Size(15, 15), // scaled size
                    origin: new google.maps.Point(0, 0), // origin
                    anchor: new google.maps.Point(7.5, 7.5), // anchor
                    labelOrigin: new google.maps.Point(-10, -15)
                }
            })

            markers.push(marker)
        
            country = currentCountry[0]

            country.setOptions({
                fillOpacity: 1
            })

            country.setMap(map)

            if(lastCountry != address) {
                zoom();
                lastCountry = address;
            }
        }
    });    
}

function zoom() {
    if(map.zoom == 4 || map.zoom == 5) {
        map.setOptions({
            zoom:3
        });
        setTimeout(function() {
            map.setOptions({
                zoom:4
            });
        },400);
    }else if(map.zoom == 3 || map.zoom == 5) {
        map.setOptions({
            zoom:4
        })
    }
}

function setMarkerAndColor(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
    country.setMap(map)
}

function deleteMarkerAndColor() {
    setMarkerAndColor(null); 
}

function getCountryByName(name) {
    currentCountry = allCountries.filter(country => country.name == name);
}
    
function goToCountry() {
    window.open('https://www.google.com.eg/maps','_blank');
}

// var address = "Egypt"

// function hoverCountry() {

//     geocoder.geocode( { 'address': address }, function(results, status) {

//         if (status == 'OK') {

//             map.setCenter(results[0].geometry.location);
        
//             country = currentCountry[0]

//             country.setOptions({
//                 fillOpacity: 1
//             })

//             country.setMap(map)
    
//             google.maps.event.addListener('mouseover', function() {
//                 country.setOptions({
//                     fillOpacity: 0.99
//                 })
//             });
        
//             google.maps.event.addListener('mouseout', function() {
//                 country.setOptions({
//                     fillOpacity: 0
//                 })
//             });
//         }
//     });
// }
