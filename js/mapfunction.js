function mapfunction(selector){

    var margin = {top: 0, left: 0, right: 0, bottom: 0},
    scale = 100,
    height = 400 - margin.top - margin.bottom,
    width = 800 - margin.left - margin.right;
    mapurl = "js/us_states.json"

    var svg = d3.select(selector)
        .append("svg")
        .attr("class", "india map")
        .attr("viewBox", "0 0 " + width + " " + height)
        .attr("preserveAspectRatio", "xMinYMin")

    // var g = svg.append("g")

    var projection = d3.geoAlbersUsa()
        .scale(scale)
        .translate([width / 2, height / 2])

    var geoPath = d3.geoPath()
        .projection(projection)

    d3.json(mapurl, function(mapdata){
        console.log("mapdata", mapdata);
        var country = topojson.feature(mapdata, mapdata.objects.us_states).features;

        console.log("country", country);

        svg.selectAll(".state")
            .data(country).enter().append("path")
                .attr("d", geoPath)
                .attr("class", "state")
                .attr("stroke", "#000000")
                .attr("stroke-width", 0.2)
        
        
    })

} //end mapfunction