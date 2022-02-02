var svg = d3.select("svg"),
    margin = {top: 30, right: 30, bottom: 30, left: 80},
    width = 960 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var y = d3.scaleBand()			// x = d3.scaleBand()
    .rangeRound([0, height])	// .rangeRound([0, width])
    .paddingInner(0.05)
    .align(0.1);

var x = d3.scaleLinear()		// y = d3.scaleLinear()
    .rangeRound([0, width]);	// .rangeRound([height, 0]);

var z = d3.scaleOrdinal()
    .range(["#EC9697", "#8E8BAD", "#524F6C", "#D7525B"]);

d3.csv("datamatch2021.csv", function(d, i, columns) {
    for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
    d.total = t;
    return d;
}, function(error, data) {
    if (error) throw error;
console.log(data)
    var keys = data.columns.slice(1);
    var topData = data.sort(function(a, b) {
        return b.total - a.total;
    }).slice(0, 10);//top 10 here

    // data.sort(function(a, b) { return b.total - a.total; });
    y.domain(topData.map(function(d) { return d.School; }));					// x.domain...
    x.domain([0, d3.max(topData, function(d) { return d.total; })]).nice();	// y.domain...
    z.domain(keys);



    g.append("g")
        .selectAll("g")
        .data(d3.stack().keys(keys)(topData))
        .enter().append("g")
        .attr("fill", function(d) { return z(d.key); })
        .selectAll("rect")
        .data(function(d) { return d; })
        .enter().append("rect")
        .attr("y", function(d) { return y(d.data.School); })	    //.attr("x", function(d) { return x(d.data.State); })
        .attr("x", function(d) { return x(d[0]); })			    //.attr("y", function(d) { return y(d[1]); })
        .attr("width", function(d) { return x(d[1]) - x(d[0]); })//.attr("height", function(d) { return y(d[0]) - y(d[1]); })
        .attr("height", y.bandwidth()-10)						    //.attr("width", x.bandwidth());
        .on('mouseover', function(d){
            d3.select(this)
            .style("opacity", .85);
        svg.append("text")
            .data(topData)
            .attr("id", "tooltip")
            .attr("x", 800)
            .attr("y", height)
            .attr("text-anchor", "middle")
            .attr("font-family", "sans-serif")
            .attr("font-size", "15px")
            .attr("font-weight", "bold")
            .attr("fill", "black")
            .text( "Thirstiness:" + (d[1]-d[0]) )

    })
        .on("mouseout", function(d) {
            d3.select(this)
                .transition()
                .duration(50)
                .style("opacity", 1);
            d3.select("#tooltip").remove();
        });




    g.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0,0)") 						//  .attr("transform", "translate(0," + height + ")")
        .call(d3.axisLeft(y));									//   .call(d3.axisBottom(x));

    g.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0,"+height+")")				// New line
        .call(d3.axisBottom(x).ticks(null, "s"))					//  .call(d3.axisLeft(y).ticks(null, "s"))
        .append("text")
        .attr("y", 40)												//     .attr("y", 2)
        .attr("x", x(x.ticks().pop()) + 0.1) 						//     .attr("y", y(y.ticks().pop()) + 0.5)
        .attr("dy", "0.32em")										//     .attr("dy", "0.32em")
        .attr("fill", "#000")
        .attr("font-weight", "bold")
        .attr("text-anchor", "start")
        .attr("font-size", 15)
        .text("Thirstiness Index")
        .attr("transform", "translate("+ (-width) +",-10)");   	// Newline

    var legend = g.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "end")
        .selectAll("g")
        .data(keys.slice().reverse())
        .enter().append("g")
        //.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
        .attr("transform", function(d, i) { return "translate(-50," + (300 + i * 20) + ")"; });

    legend.append("rect")
        .attr("x", width-25)
        .attr("width", 19)
        .attr("height", 19)
        .attr("fill", z);

    legend.append("text")
        .attr("x", width-30)
        .attr("y", 9.5)
        .attr("dy", "0.32em")
        .text(function(d) { return d; });

    legend.append("text")
        .attr("x", width - 55)
        .attr("y",9.5)
        .attr("dy","0.32em")
        .text("Class of")



});