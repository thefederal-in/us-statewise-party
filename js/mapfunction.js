function mapfunction(selector){

    var margin = {top: 0, left: 0, right: 0, bottom: 0},
    scale = 1000,
    height = 500 - margin.top - margin.bottom,
    width = 800 - margin.left - margin.right;
    mapurl = "js/us_states.json"

    var svg = d3.select(selector)
        .append("svg")
        .attr("class", "india map")
        .attr("viewBox", "0 0 " + width + " " + height)
        .attr("preserveAspectRatio", "xMinYMin")

    // var g = svg.append("g")

    var colorScale = d3.scaleThreshold()
    .domain([0, 100, 500, 1000, 5000, 10000, 20000, 40000, 60000])
    .range([ "#fff5eb", "#fee6ce", "#fdd0a2", "#fdae6b", "#fd8d3c", "#f16913", "#d94801", "#a63603","#7f2704"]);

    var colorScaleParty = {
        "R": "#ff6b6b",
        "D": "#54a0ff",
        "Coalition": "#666666"
    }

    var projection = d3.geoAlbersUsa()
        .scale(scale)
        .translate([width / 2, height / 2])

    var geoPath = d3.geoPath()
        .projection(projection)

    function centroids(boundarydata){
        return boundarydata.map(function (d){
            return {"latlong": projection(d3.geoCentroid(d)), "name": d.properties.name}
        });
    }

    

    d3.json(mapurl, function(mapdata){
        console.log("mapdata", mapdata);
        
        var country = topojson.feature(mapdata, mapdata.objects.us_states).features;

        console.log("country", country);

        var stateCentroid = centroids(country)

        var valueExtent = d3.extent(coviddata, function(obj) {
            // console.log(obj["June*"]);
            
            return obj["June*"]; 
        })

        console.log(valueExtent);
        
        
        var size = d3.scaleSqrt()
            .domain(valueExtent)  // What's in the data
            .range([ 10, 70])  // Size in pixel

        svg.selectAll(".state")
            .data(country).enter().append("path")
            .attr("d", geoPath)
            .attr("class", "state")
            .attr("stroke", "#000000")
            .attr("stroke-width", 0.2)
            .attr("fill", function(d, i){
                // console.log("d", d.properties.name);

                var fd = _.filter(coviddata, function(obj){
                    return obj["State"] === d.properties.name
                })

                if(fd[0] !== undefined){
                    // console.log("fd", fd[0]);
                    return colorScaleParty[fd[0]["Party"]];
                }else{
                    return "#FFFFFF";
                    // console.log("fd", "Data not available");
                }        
            })

        svg.selectAll("myCircles")
            .data(stateCentroid)
            .enter()
            .append("circle")
            .attr("r", function(d){

                var fd = _.filter(coviddata, function(obj){
                    return obj["State"] === d["name"]
                })

                // console.log(colorScale[fd[0]["June*"]]);

                if(fd[0] !== undefined){
                    // console.log("fd", fd[0]);
                    return size(fd[0]["June*"]);
                }else{
                    return 10;
                    // console.log("fd", "Data not available");
                }  

            })
            .attr("cx", function(d){
                // console.log("cd", d);
                
                return d["latlong"][0]; 
            })
            .attr("cy", function (d){ return d["latlong"][1]; })
            .attr("fill-opacity", "75%")
            .attr("fill", function(d){
                
                var fd = _.filter(coviddata, function(obj){
                    return obj["State"] === d["name"]
                })

                if(fd[0] !== undefined){
                    return colorScale(fd[0]["June*"]);
                }else{
                    return "#FFFFFF";
                }  

            })
            .attr("stroke", "#000000")
            .attr("stroke-width", 0.2)
            
            
    })

} //end mapfunction