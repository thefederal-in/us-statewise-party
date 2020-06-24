function mapfunction(selector){

    var margin = {top: 0, left: 0, right: 0, bottom: 0},
    height = 400 - margin.top - margin.bottom,
    width = 800 - margin.left - margin.right;

    var svg = d3.select(selector)
        .append("svg")
        .attr("class", "india map")
        .attr("viewBox", "0 0 " + width + " " + height)
        .attr("preserveAspectRatio", "xMinYMin")

}