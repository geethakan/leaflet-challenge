// Source of data 
// const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";          // All earthquakes past 30 days
// const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";  // Significant in past 30 days
const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";              // all past 7 days
var earthquakeData = [];

function createFeaturesMap() {

   // Create a map object.
    var myMap = L.map("map", {
    center: [20, 10],
    zoom: 3
    });

    // Add a tile layer.
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(myMap);

    // color mapping based on depth of earthquake
    //aqua: #00FFFF   yellow: #FFFF00  lime: #00FF00  fuchsia: #FF00FF  purple: #800080  red: #FF0000  maroon: #800000  black: #000000
    function getColor(d) {
        if (d <= 5) { return "aqua"}
        else if (d <=15) {return "yellow"}
        else if (d <= 20) {return "lime"}
        else if (d <=50) {return "fuchsia"}
        else if (d <= 100) {return "purple"}
        else if (d <= 250) {return "red"}
        else if (d <= 500) {return "maroon"}
        else {return "black"}
    };

    // Add circles to the map.
    for (i=0; i < earthquakeData.length; i++) {
        let depth = earthquakeData[i].geometry.coordinates[2];
        let color = getColor(depth);
        let magnitude = earthquakeData[i].properties.mag;
        let lon = earthquakeData[i].geometry.coordinates[0];
        let lat = earthquakeData[i].geometry.coordinates[1];
        let wherePlace = "Location: " + earthquakeData[i].properties.place; 

        let utcSeconds = earthquakeData[i].properties.time;
        let whenDateTime = new Date(utcSeconds);
                      
        if (magnitude < 0) { magnitude = 0};  // Sqrt for -ve returns NaN - replacing -ve magnitudes with 0

        L.circle([lat, lon], {
            fillOpacity: 0.50,
            color: "green",
            fillColor: color,
            // Adjust the radius proportionate to magnitude  
            radius: Math.pow(magnitude, 3) * 500
        }).bindPopup(`<h4> ${wherePlace}</h4> \ 
                    <h4>Lat: ${lat} Lon: ${lon}</h4> \
                    <h4>Date and Time: ${whenDateTime}</h4> \
                    <h4>Depth: ${depth}  Magnitude: ${magnitude}</h4>`).addTo(myMap);
    }
    
    // Add legend for depth(color coding)
    var  legend = L.control({position: "bottomright", title: "Depth (km)"});
    legend.onAdd = function() { 
            var div = L.DomUtil.create('div', 'info legend'),
            colors = ["#00FFFF", "#FFFF00", "#00FF00", "#FF00FF", "#800080", "#FF0000", "#800000", "#000000"],
            labels = [" < 5 km", " 5 - 15", " 15 - 20", " 20 - 50", " 50 - 100", " 100 - 250", " 250 - 500", " > 500 km"];            

            for (var i = 0; i < colors.length; i++) {                
                div.innerHTML +=
                    '<i style="background:' + colors[i] + '"></i>' + labels[i] + '</br>';                    
            }
            
            return div;
    };
    legend.addTo(myMap);
};

function init() {

    // Fetch data from url and save in global variable for use in other functions
    d3.json(url).then(function(data) {            
        earthquakeData = data.features;
        console.log("Features array from URL ", earthquakeData);  
                
        createFeaturesMap();
    });    
    
}; 

init();   
