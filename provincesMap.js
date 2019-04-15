var map;
var overlaySVG;
var customMapStyle = [
    {
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
                "color": "#abd5ff"
            }
        ]
    }
];

var contentString = '';

var svgBounds;

function initMap() {
    var center = { lat: 26.8206, lng: 30.8025 };

    map = new google.maps.Map(document.getElementById('map'), {
        center: center,
        zoom: 6.7,
        styles: customMapStyle,
        disableDefaultUI: true

    });
    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });
    initMarkers(map, infowindow);

    var svgBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(21.27857550299368, 24.670040083025242),//southwest
        new google.maps.LatLng(32.24677630593176, 37.61900981867757));//northeast

    initOverlay(svgBounds);
    initInfoBox();


    ////////Helper  for pins positioning
    //google.maps.event.addListener(map, 'rightclick', function (evt) {
    //    alert(evt.latLng)
    //});

    ////////  Helper for  overlay positioning 
    //var bounds = [];
    //google.maps.event.addListener(map, 'rightclick', function (evt) {
    //    bounds.push(evt.latLng);
    //    console.log(evt.latLng);
    //    if (bounds.length == 2) {
    //        svgBounds = new google.maps.LatLngBounds(
    //            new google.maps.LatLng(bounds[0].lat(), bounds[0].lng()),//southwest
    //            new google.maps.LatLng(bounds[1].lat(), bounds[1].lng()));//northeast

    //initOverlay(svgBounds);

    //        bounds = [];
    //    }
    //});

    //google.maps.event.addListener(map, 'click', function (evt) {
    //    alert(svgBounds)
    //});
}
var lastSelectedMarker;
var lastBox;

function initMarkers(map, infowindow) {
    var markerLocalId = 0;
    provincesList.forEach(function (province) {
        var mapPosition = { lat: parseFloat(province.Lat), lng: parseFloat(province.Lng) };
        var marker = new google.maps.Marker({
            position: mapPosition,
            map: map,
            icon: {
                url: "/Content/Images/marker-icon-01.svg", // url
                scaledSize: new google.maps.Size(15, 15), // scaled size
                origin: new google.maps.Point(0, 0), // origin
                anchor: new google.maps.Point(7.5, 7.5), // anchor
                labelOrigin: new google.maps.Point(-province.Title.length / 2 * 3, 20)
            },
            label: {
                text: province.Title,
                color: "#016ab2",
                fontSize: "12px",
                fontWeight: "bold",
                fontFamily: "Segoe UI"
            }
        });

        marker.localId = markerLocalId++;

        marker.addListener('click', function () {
            if (lastSelectedMarker) {
                var defaultIcon = lastSelectedMarker.icon;
                lastSelectedMarker.setIcon({
                    url: "/Content/Images/marker-icon-01.svg", // url
                    scaledSize: new google.maps.Size(15, 15), // scaled size
                    origin: new google.maps.Point(0, 0), // origin
                    anchor: new google.maps.Point(7.5, 7.5), // anchor
                    labelOrigin: defaultIcon.labelOrigin
                });
            }
            lastSelectedMarker = marker;
            var selectedIcon = marker.icon;
            marker.setIcon({
                url: "/Content/Images/marker-icon-02.svg", // url
                scaledSize: new google.maps.Size(15, 15), // scaled size
                origin: new google.maps.Point(0, 0), // origin
                anchor: new google.maps.Point(7.5, 7.5), // anchor
                labelOrigin: selectedIcon.labelOrigin
            });



            var province = provincesList[this.localId];
            var popupContent = constructPopupContent(province);

            var infoBox = new InfoBox({
                latlng: this.getPosition(),
                map: map,
                content: popupContent
            });

            if (lastBox)
                lastBox.setMap(null);

            lastBox = infoBox;
        });
    });
}

function constructPopupContent(province) {
    return '<div class="popup-window">' +
        '<img class="popup-img" src="' + (province.Logo ? province.Logo : "/Content/images/placeholder-logo-16x9.jpg") + '" /> ' +
        '<div class="popup-content">' +
        '<div class="popup-brief section-wrapper">' + province.Brief + '</div> ' +
        '<div class="section-wrapper ' + (!province.TwitterLink && !province.FacebookLink && !province.SiteLink ? 'no-border' : '') + '">' +
        '<div class="popup-capital one-third"><label>' + capitalLabel + '</label><br/>' + province.Capital + '</div><div class="separator first"></div>' +
        '<div class="popup-code one-third"><label>' + telephoneCodeLabel + '</label><br/>' + province.TelephoneCode + '</div><div class="separator second"></div>' +
        '<div class="popup-area one-third"><label>' + areaLabel + '</label><br/>' + province.Area + areaSuffix + '</div>' +
        '</div>' +
        '<ul class="links">' +
        '<li>' +
        '<a class="popup-twitter ' + (province.TwitterLink ? '' : 'hide') + '" href="' + province.TwitterLink + '" target="_blank">' +
        '<img src="/Content/images/svgIcons/twitter.svg" alt="Icon">' +
        '</a>' +
        '<a class="popup-facebook ' + (province.FacebookLink ? '' : 'hide') + '" href="' + province.FacebookLink + '" target="_blank">' +
        '<img src="/Content/images/svgIcons/facebook.svg" alt="Icon">' +
        '</a>' +
        '</li>' +
        '<li class="' + (province.SiteLink ? '' : 'hide') + '">' +
        '<div class="separator"></div>' +
        '<a class="popup-sitelink" href="' + province.SiteLink + '" target="_blank">' +
        siteLabel +
        '</a>' +
        '</li>' +
        '</div>' + '</div>';

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

/* An InfoBox is like an info window, but it displays
 * under the marker, opens quicker, and has flexible styling.
 * @param {GLatLng} latlng Point to place bar at
 * @param {Map} map The map on which to display this InfoBox.
 * @param {Object} opts Passes configuration options - content,
 * offsetVertical, offsetHorizontal, className, height, width
 */

function InfoBox(opts) {
    google.maps.OverlayView.call(this);
    this.latlng_ = opts.latlng;
    this.map_ = opts.map;
    this.content = opts.content;
    this.offsetVertical_ = 30;
    this.offsetHorizontal_ = -150;
    this.height_ = 400;
    this.width_ = 260;
    var me = this;
    this.boundsChangedListener_ =
        google.maps.event.addListener(this.map_, "bounds_changed", function () {
            return me.panMap.apply(me);
        });
    // Once the properties of this OverlayView are initialized, set its map so
    // that we can display it. This will trigger calls to panes_changed and
    // draw.
    this.setMap(this.map_);
}

function initInfoBox() {
    /* InfoBox extends GOverlay class from the Google Maps API
     */
    InfoBox.prototype = new google.maps.OverlayView();
    /* Creates the DIV representing this InfoBox
     */
    InfoBox.prototype.remove = function () {
        if (this.div_) {
            this.div_.parentNode.removeChild(this.div_);
            this.div_ = null;
        }
    };
    /* Redraw the Bar based on the current projection and zoom level
     */
    InfoBox.prototype.draw = function () {
        // Creates the element if it doesn't exist already.
        this.createElement();
        if (!this.div_) return;
        // Calculate the DIV coordinates of two opposite corners of our bounds to
        // get the size and position of our Bar
        var pixPosition = this.getProjection().fromLatLngToDivPixel(this.latlng_);
        if (!pixPosition) return;
        // Now position our DIV based on the DIV coordinates of our bounds
        this.div_.style.width = this.width_ + "px";
        this.div_.style.left = (pixPosition.x + this.offsetHorizontal_) + "px";
        this.div_.style.height = this.height_ + "px";
        this.div_.style.top = (pixPosition.y + this.offsetVertical_) + "px";
        this.div_.style.display = 'block';
    };
    /* Creates the DIV representing this InfoBox in the floatPane. If the panes
     * object, retrieved by calling getPanes, is null, remove the element from the
     * DOM. If the div exists, but its parent is not the floatPane, move the div
     * to the new pane.
     * Called from within draw. Alternatively, this can be called specifically on
     * a panes_changed event.
     */
    InfoBox.prototype.createElement = function () {
        var panes = this.getPanes();

        var div = this.div_;
        if (!div) {
            // This does not handle changing panes. You can set the map to be null and
            // then reset the map to move the div.
            div = this.div_ = document.createElement("div");
            div.className = "infobox"
            var contentDiv = document.createElement("div");
            contentDiv.className = "content"
            contentDiv.innerHTML = this.content;
            var closeBox = document.createElement("div");
            closeBox.className = "close";
            closeBox.innerHTML = "x";
            div.appendChild(closeBox);

            function removeInfoBox(ib) {
                return function () {
                    ib.setMap(null);
                    if (lastSelectedMarker) {
                        var defaultIcon = lastSelectedMarker.icon;
                        lastSelectedMarker.setIcon({
                            url: "/Content/Images/marker-icon-01.svg", // url
                            scaledSize: new google.maps.Size(15, 15), // scaled size
                            origin: new google.maps.Point(0, 0), // origin
                            anchor: new google.maps.Point(7.5, 7.5), // anchor
                            labelOrigin: defaultIcon.labelOrigin
                        });
                        lastSelectedMarker = null;
                    }
                };
            }


            google.maps.event.addDomListener(closeBox, 'click', removeInfoBox(this));
            div.appendChild(contentDiv);
            div.style.display = 'none';
            panes.floatPane.appendChild(div);
            this.panMap();
        } else if (div.parentNode != panes.floatPane) {
            // The panes have changed. Move the div.
            div.parentNode.removeChild(div);
            panes.floatPane.appendChild(div);
        } else {
            // The panes have not changed, so no need to create or move the div.
        }
    }
    /* Pan the map to fit the InfoBox.
     */
    InfoBox.prototype.panMap = function () {
        // if we go beyond map, pan map
        var map = this.map_;
        var bounds = map.getBounds();
        if (!bounds) return;
        // The position of the infowindow
        var position = this.latlng_;
        // The dimension of the infowindow
        var iwWidth = this.width_;
        var iwHeight = this.height_;
        // The offset position of the infowindow
        var iwOffsetX = this.offsetHorizontal_;
        var iwOffsetY = this.offsetVertical_;
        // Padding on the infowindow
        var padX = 40;
        var padY = 40;
        // The degrees per pixel
        var mapDiv = map.getDiv();
        var mapWidth = mapDiv.offsetWidth;
        var mapHeight = mapDiv.offsetHeight;
        var boundsSpan = bounds.toSpan();
        var longSpan = boundsSpan.lng();
        var latSpan = boundsSpan.lat();
        var degPixelX = longSpan / mapWidth;
        var degPixelY = latSpan / mapHeight;
        // The bounds of the map
        var mapWestLng = bounds.getSouthWest().lng();
        var mapEastLng = bounds.getNorthEast().lng();
        var mapNorthLat = bounds.getNorthEast().lat();
        var mapSouthLat = bounds.getSouthWest().lat();
        // The bounds of the infowindow
        var iwWestLng = position.lng() + (iwOffsetX - padX) * degPixelX;
        var iwEastLng = position.lng() + (iwOffsetX + iwWidth + padX) * degPixelX;
        var iwNorthLat = position.lat() - (iwOffsetY - padY) * degPixelY;
        var iwSouthLat = position.lat() - (iwOffsetY + iwHeight + padY) * degPixelY;
        // calculate center shift
        var shiftLng =
            (iwWestLng < mapWestLng ? mapWestLng - iwWestLng : 0) +
            (iwEastLng > mapEastLng ? mapEastLng - iwEastLng : 0);
        var shiftLat =
            (iwNorthLat > mapNorthLat ? mapNorthLat - iwNorthLat : 0) +
            (iwSouthLat < mapSouthLat ? mapSouthLat - iwSouthLat : 0);
        // The center of the map
        var center = map.getCenter();
        // The new map center
        var centerX = center.lng() - shiftLng;
        var centerY = center.lat() - shiftLat;
        // center the map to the new shifted center
        map.setCenter(new google.maps.LatLng(centerY, centerX));
        // Remove the listener after panning is complete.
        google.maps.event.removeListener(this.boundsChangedListener_);
        this.boundsChangedListener_ = null;
    };
}