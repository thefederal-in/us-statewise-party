function mapfunction(selector, month){

    var margin = {top: 0, left: 0, right: 0, bottom: 0},
    scale = 1000,
    height = 500 - margin.top - margin.bottom,
    width = 800 - margin.left - margin.right;
    mapurl = "js/us_states.json"

    d3.select(selector).html(null)

    var svg = d3.select(selector)
        .append("svg")
        .attr("class", "india map")
        .attr("viewBox", "0 0 " + width + " " + height)
        .attr("preserveAspectRatio", "xMinYMin")

    // var g = svg.append("g")

    var colorScale = d3.scaleQuantize()
    .range(["#fcfbfd","#f1eff6","#e2e1ef","#cecee5","#b6b5d8","#9e9bc9","#8782bc","#7363ac","#61409b","#501f8c","#3f007d"]);

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

    var tool_tip_map = d3.tip()
    .attr("class", "d3-tip")
    .offset([20, 0])
    .html(function(d){
        var fd = _.filter(coviddata, function(obj){
            return obj["State"] === d.properties.name
        })
        // return d.properties.name + ":" + fd[0]["Party"];
        return d.properties.name;
    });

    svg.call(tool_tip_map);
    
    var tool_tip_circle = d3.tip()
    .attr("class", "d3-tip")
    .offset([0, 0])
    .html(function(d){
        var fd = _.filter(coviddata, function(obj){
            return obj["State"] === d["name"]
        })
        if(fd[0] !== undefined){
            // console.log("fd", fd[0]);
            return d["name"]+": "+fd[0][month].toLocaleString('en-IN');
        }else{
            return d["name"]+": NA";
            // console.log("fd", "Data not available");
        } 
    });

    svg.call(tool_tip_circle);

    

    d3.json(mapurl, function(mapdata){
        console.log("mapdata", mapdata);
        
        var country = topojson.feature(mapdata, mapdata.objects.us_states).features;

        console.log("country", country);

        var stateCentroid = centroids(country)

        var valueExtent = d3.extent(coviddata, function(obj) {
            // console.log(obj["June*"]);
            
            return obj[month]; 
        })

        console.log(valueExtent);
        
        colorScale.domain(valueExtent)
        
        var size = d3.scaleSqrt()
            .domain(valueExtent)  // What's in the data
            .range([5, 45])  // Size in pixel

        svg.selectAll(".state")
            .data(country).enter().append("path")
            .attr("d", geoPath)
            .attr("class", function(d){
                return "state "+ d.properties.name;
            })
            .attr("stroke", "#000000")
            .attr("stroke-width", 0.2)
            .attr("fill", function(d, i){

                var fd = _.filter(coviddata, function(obj){
                    return obj["State"] === d.properties.name
                })

                if(fd[0] !== undefined){
                    // console.log("fd", fd[0]);
                    return colorScaleParty[fd[0]["Party"]];
                }else{
                    return "#FFFFFF";
                }        
            })
            .on('mouseover', tool_tip_map.show)
            .on('mouseout', tool_tip_map.hide)


    

        svg.selectAll("myCircles")
            .data(stateCentroid)
            .enter()
            .append("circle")
            .attr("cx", function(d){ return d["latlong"][0];})
            .attr("cy", function (d){ return d["latlong"][1]; })
            .attr("r", 0)
            .attr("fill-opacity", "85%")
            .on('mouseover', tool_tip_circle.show)
            .on('mouseout', tool_tip_circle.hide)
            .transition().duration(1000)
            .attr("r", function(d){

                var fd = _.filter(coviddata, function(obj){
                    return obj["State"] === d["name"]
                })
                if(fd[0] !== undefined){
                    // console.log("fd", fd[0]);
                    return size(fd[0][month]);
                }else{
                    return 10;
                    // console.log("fd", "Data not available");
                }  

            })
            .attr("fill", function(d){
                
                
                var fd = _.filter(coviddata, function(obj){
                    return obj["State"] === d["name"]
                })

                

                if(fd[0] !== undefined){
                    console.log(fd[0][month], colorScale(fd[0][month]));
                    return colorScale(fd[0][month]);
                }else{
                    return "#FFFFFF";
                }  

            })
            .attr("stroke", "#000000")
            .attr("stroke-width", 0.2)
            
            
    })

} //end mapfunction