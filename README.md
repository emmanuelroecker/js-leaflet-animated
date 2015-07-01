# Leaflet Animated

[Leaflet](http://leafletjs.com/) plugin for animating a marker.

Inspired by [Leaflet.AnimatedMarker](https://github.com/openplans/Leaflet.AnimatedMarker)

## Check out the [demo](http://lyon.glicer.com).

Feedback appreciated

## Description

Move a marker along a polyline at a specific rate (meter per second).

When mouse over the marker stops, and restarts when mouse out.

At the end of path, the marker restarts in reverse path.

If page becomes invisible, the marker stops.

## Sample code

Complete sample : [here](example/sample.html)

Only javascript parts using the plugin :

```javascript
//create vaporeto icon
var iconVaporeto = L.icon({
    iconUrl: host + '/img/markermap/vaporeto.png',
    iconSize: [48, 48],
    iconAnchor: [24, 24]
});

//create polyline with gps coordinates
var pathVaporeto = L.polyline([
    [45.767662, 4.821465],
    [45.767668, 4.827387],
    [45.764887, 4.830295],
    [45.761890, 4.830151],
    [45.758972, 4.828184],
    [45.756644, 4.825809],
    [45.753922, 4.824376],
    [45.751732, 4.822665],
    [45.749795, 4.819693],
    [45.747416, 4.816353],
    [45.744802, 4.813936],
    [45.742893, 4.813782],
    [45.741433, 4.818652]
]);

//create vaporeto marker, speed : 64 meters/seconds
var vaporeto = L.GlAnimatedMarker(pathVaporeto.getLatLngs(), { icon: iconVaporeto, speed: 64 });

//called when the marker is clicked
vaporeto.on("click", function () {
    console.log("vaporeto clicked");
});

//add marker to leaflet map
leafletmap.addLayer(vaporeto);
```

## Browser compatibility

Name    | Version
------  | -------
Chrome  | 33
Firefox | 18
IE      | 10
Opera   | 12.10
Safari  | 6.1

## Contact

Authors : Emmanuel ROECKER & Rym BOUCHAGOUR

[Web Development Blog - http://dev.glicer.com](http://dev.glicer.com)