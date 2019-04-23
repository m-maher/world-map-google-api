var map

var markers = []

var svgBounds

var overlaySVG

var center = { lat: 26.8206, lng: 30.8025 }

var contentString = '<div class="popup-window">'+
            '<div>'+
              '<img src="Assets/Images/SVGs/address.svg" alt="address">'+
              '<p>العنوان</p>'+
            '</div>'+
            '<div>'+
              '<p>شارع الاستاد البحرى - مدينة نصر- القاهرة - جمهورية مصرالعربية</p>'+
            '</div>'+
            '<div>'+
              '<img src="Assets/Images/SVGs/phone.svg" alt="phone">'+
              '<p>تليفون</p>'+
            '</div>'+
            '<div>'+
              '<p>01111222233</p>'+
              '<p>01111222233</p>'+
            '</div>'+
            '<div>'+
              '<img src="Assets/Images/SVGs/email.svg" alt="email">'+
              '<p>البريد اللإلكتروني</p>'+
            '</div>'+
            '<div>'+
              '<p class="email">feedback@sis.gov.eg</p>'+
            '</div>'+
          '</div>'

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
                "color": '#cccccc'
            }
        ]
    },
    {
        "featureType": "landscape",
        "stylers": [
            {
                "color": "#ffffff"
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
                "color": "#abd5ff"
            }
        ]
    }
];

function initialize() {
    map = new google.maps.Map(document.getElementById('mapBranches'),{
        center: center,
        zoom: 6 ,
        styles: customMapStyle,
        disableDefaultUI: true,
        gestureHandling: 'greedy'
    });

    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });

    var marker = new google.maps.Marker({
        position: { lat: 30.0444, lng: 31.2357 } ,
        map: map,
        label:{
            text: "Cairo",
            color: "#006ab2",
            fontSize: "15px",
            fontWeight: "bold",
            fontFamily: "Segoe UI"
        },
        icon:{
            url: 'Assets/Images/SVGs/marker-icon-01.svg', // url
            scaledSize: new google.maps.Size(15, 15), // scaled size
            origin: new google.maps.Point(0, 0), // origin
            anchor: new google.maps.Point(7.5, 7.5), // anchor
            labelOrigin: new google.maps.Point(0, 25)
        }

    })

    marker.addListener('click', function() {
        infowindow.open(map, marker);
    });

    map.addListener("click", function() {
        infowindow.close();
    });

    var svgBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(21.27857550299368, 24.670040083025242),//southwest
        new google.maps.LatLng(32.24677630593176, 37.61900981867757));//northeast

    initOverlay(svgBounds);

}


function initOverlay(svgBounds) {
    SVGOverlay.prototype = new google.maps.OverlayView();
    /** @constructor */
    function SVGOverlay(bounds, image, map) {
        // Initialize all properties.
        this.bounds_ = bounds;
        this.image_ = image;
        this.map_ = map;
        this.div_ = null;
        this.setMap(map);
    }

    SVGOverlay.prototype.onAdd = function () {
        var div = document.createElement("div")
        div.style.borderStyle = 'none';
        div.style.borderWidth = '0px';
        div.style.position = 'absolute';

        // Load the inline svg element and attach it to the div.
        var svg = this.image_;
        svg.style.width = '100%';
        svg.style.height = '100%';


        div.appendChild(svg);
        this.div_ = div;
        // Add the element to the "overlayLayer" pane.
        var panes = this.getPanes();
        panes.overlayLayer.appendChild(div);
    };

    SVGOverlay.prototype.draw = function () {
        // We use the south-west and north-east
        // coordinates of the overlay to peg it to the correct position and size.
        // To do this, we need to retrieve the projection from the overlay.
        var overlayProjection = this.getProjection();

        // Retrieve the south-west and north-east coordinates of this overlay
        // in LatLngs and convert them to pixel coordinates.
        // We'll use these coordinates to resize the div.
        var sw = overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());
        var ne = overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());

        // Resize the image's div to fit the indicated dimensions.
        var div = this.div_;
        div.style.left = sw.x + 'px';
        div.style.top = ne.y + 'px';
        div.style.width = (ne.x - sw.x) + 'px';
        div.style.height = (sw.y - ne.y) + 'px';
    };


    mySVG = document.getElementById('map-borders');

    overlaySVG = new SVGOverlay(svgBounds, mySVG, map);

}



function getCountry(address) {

    geocoder.geocode( { 'address': address }, function(results, status) {

        if (status == 'OK') {

            map.setCenter(results[0].geometry.location);

            deleteMarkerAndColor()
 
            var marker = new google.maps.Marker({
                position: center,
                map: map,
                label:{
                    text: "Egypt",
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

            country.setMap(map)

            if(lastCountry != address) {
                zoom();
                lastCountry = address;
            }
        }
    });    
}