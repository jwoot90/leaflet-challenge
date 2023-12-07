

// Get URL for JSON data
var geoQuery = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

//create map object
let myMap = L.map("map", {
    center: [37.6000, -95.6650],
    zoom: 5
});


//Add tile layer to map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);


var tectonicPlates = new L.layerGroup();
//Perform request to get data
d3.json(geoQuery).then(function (data) {
    console.log(data);

    getFeatures(data.features);
})



//Plot the tectonic plates dataset on the map in addition to the earthquakes.
//function 
var tecPlatesUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"


d3.json(tecPlatesUrl).then((tectonicData) => {
    L.geoJSON(tectonicData, {
        color: "rgb(212, 142, 38)",
        weight: 2


    }).addTo(tectonicPlates);

    tectonicPlates.addTo(myMap);

})


//add earthquake data to map
d3.json(geoQuery).then(function (data) {

    function formatMap(feature) {

        return {
            opacity: 1,
            opacityFill: 1,
            fillColor: chooseColor(feature.geometry.coordinates[2]),
            color: "black",
            radius: magRadius(feature.properties.mag),
            stroke: true,
            weight: 0.5

        };



    }

    function chooseColor(depth) {
        if (depth < 10) return "#F9C784";
        else if (depth < 30) return "#94D1BE";
        else if (depth < 50) return "#9EB3C2";
        else if (depth < 70) return "#B07BAC";
        else if (depth < 90) return "#1C7293";
        else return "#FFC759";
    }

    //size by magnitude

    function magRadius(mag) {
        if (mag === 0) {
            return 1;
            console.log(mag)
        }
        return mag * 6
    }
    //add data to map

    L.geoJSON(data, {
        

        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng)

        },

        style: formatMap,

        onEachFeature: function (feature, layer) {
            layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>Magnitude:${feature.properties.mag}</p><p>Depth:${feature.geometry.coordinates[2]}</p>`);


        }
        
    
    }).addTo(myMap)
    let legend = L.control({position:'bottomright'});

    legend.onAdd = function() {
      var div = L.DomUtil.create('div','info legend')
      var gradeScale = [10,30,50,70,90];
      var labels = [];
      var legendInfo = "<h4>Magnitude</h4>";
      
      div.innerHTML = legendInfo
      
      for(var i = 0; i< gradeScale.length; i++) {
        labels.push('<ul style="background-color:' + chooseColor(gradeScale[i] + 1) + '"> <span>' + gradeScale[i] + (gradeScale[i + 1] ? '&ndash;' + gradeScale[i + 1] + '' : '+') + '</span></ul>'); 
        
      }
      
      div.innerHTML += "<ul>" + labels.join("") + "</ul>";
      
      return div;
    
      
    };
    
    
    legend.addTo(myMap)


})












