var file = "assets/data/data.csv";

var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 100,
  left: 120
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var xSel = "poverty";
var ySel = "healthcare";

start();

function start() {
  var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  build(svg, chartGroup);
}

function build(svg, chartGroup) {
  d3.csv(file).then(data => {
    console.log(data);

    updateData(data, xSel, ySel);

    var xLineScale = d3.scaleLinear()
      .domain([d3.min(data, d => d[xSel])-1, d3.max(data,d => d[xSel])+1])
      .range([0, width]);

    var yLineScale = d3.scaleLinear()
      .domain([d3.min(data, d => d[ySel])-1, d3.max(data,d => d[ySel])+1])
      .range([height, 0]);

    var xAxis = d3.axisBottom(xLineScale);
    var yAxis = d3.axisLeft(yLineScale);

    chartGroup.append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis);

    chartGroup.append("g")
      .attr("class", "y axis")
      .call(yAxis);

    var circlesGroup = chartGroup.selectAll(".stateCircle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => xLineScale(d[xSel]))
      .attr("cy", d => yLineScale(d[ySel]))
      .attr("r", "10")
      .attr("opacity", ".5");

    var abbre = chartGroup.selectAll(".stateText")
      .data(data)
      .enter()
      .append("text")
      .attr("x", (d) => xLineScale(d[xSel])-6)
      .attr("y", (d) => yLineScale(d[ySel])+4)
      .text((d) => `${d.abbr}`)
      .attr("font-size", "10px");

    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([-5, 0])
      .html((d) => {
        if (xSel === "age" || xSel === "income") {
          return `${d.state}<br><br>${xSel}: ${d[xSel]}<br>${ySel}: ${d[ySel]}%`;
        } else {
          return `${d.state}<br><br>${xSel}: ${d[xSel]}%<br>${ySel}: ${d[ySel]}%`;
        }

      });

    chartGroup.call(toolTip);

    abbre.on("mouseover", function(d) {
      toolTip.show(d, this);
    }).on("mouseout", function(d) {
      toolTip.hide(d);
    });

    options(data, svg, chartGroup, xLineScale, yLineScale, xAxis, yAxis, circlesGroup, abbre);

  });
}

function updateData(data, xSel, ySel) {
  data.forEach((data) => {
    data[xSel] = +data[xSel];
    data[ySel] = +data[ySel];
  });
}

function options(data, svg, chartGroup, xLine, yLine, xAxis, yAxis, circlesGroup, abbre) {
  var healthcareY = chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 60)
    .attr("x", 0 - (height / 1.45))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .attr("id", "healthcare")
    .attr("fill", "grey")
    .attr("font-weight", "bold")
    .text("Lacks Healthcare (%)")
    .on("mouseover", function() {
      d3.select(this)
        .transition()
        .duration(500)
        .attr("fill", "black");
    }).on("mouseout", function() {
      d3.select(this)
        .transition()
        .duration(500)
        .attr("fill", "grey");
    }).on("click", function() {
      ySel = d3.select(this).attr("id");

      updateData(data, xSel, ySel);

      yLine.domain([d3.min(data, d => d[ySel])-1, d3.max(data,d => d[ySel])+1]);
      svg.select(".y")
        .transition()
        .call(yAxis);

      circlesGroup.data(data)
        .transition()
        .attr("cy", d => yLine(d[ySel]))
        .attr("r", "10")
        .attr("opacity", ".5");

      abbre.data(data)
        .transition()
        .attr("y", (d) => yLine(d[ySel])+4)

      selection(chartGroup, xSel, ySel);
      // build(svg, chartGroup);
    });

  var smokesY = chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 35)
    .attr("x", 0 - (height / 1.6))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .attr("id", "smokes")
    .attr("fill", "grey")
    .text("Smokes (%)")
    .on("mouseover", function() {
      d3.select(this)
        .transition()
        .duration(500)
        .attr("fill", "black");
    }).on("mouseout", function() {
      d3.select(this)
        .transition()
        .duration(500)
        .attr("fill", "grey");
    }).on("click", function() {
      ySel = d3.select(this).attr("id");

      updateData(data, xSel, ySel);

      yLine.domain([d3.min(data, d => d[ySel])-1, d3.max(data,d => d[ySel])+1]);

      svg.select(".y")
        .transition()
        .call(yAxis);

      circlesGroup.data(data)
        .transition()
        .attr("cy", d => yLine(d[ySel]))
        .attr("r", "10")
        .attr("opacity", ".5");

      abbre.data(data)
        .transition()
        .attr("y", (d) => yLine(d[ySel])+4)

      selection(chartGroup, xSel, ySel);
      // build(svg, chartGroup);
    });

  var obeseY = chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 10)
    .attr("x", 0 - (height / 1.63))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .attr("id", "obesity")
    .attr("fill", "grey")
    .text("Obese (%)")
    .on("mouseover", function() {
      d3.select(this)
        .transition()
        .duration(500)
        .attr("fill", "black");
    }).on("mouseout", function() {
      d3.select(this)
        .transition()
        .duration(500)
        .attr("fill", "grey");
    }).on("click", function() {
      ySel = d3.select(this).attr("id");

      updateData(data, xSel, ySel);

      yLine.domain([d3.min(data, d => d[ySel])-1, d3.max(data,d => d[ySel])+1]);
      svg.select(".y")
        .transition()
        .call(yAxis);

      circlesGroup.data(data)
        .transition()
        .attr("cy", d => yLine(d[ySel]))
        .attr("r", "10")
        .attr("opacity", ".5");

      abbre.data(data)
        .transition()
        .attr("y", (d) => yLine(d[ySel])+4)

      selection(chartGroup, xSel, ySel);
      // build(svg, chartGroup);
    });

  var povertyX = chartGroup.append("text")
    .attr("transform", `translate(${width / 2.2}, ${height + margin.top + 20})`)
    .attr("class", "axisText")
    .attr("id", "poverty")
    .attr("fill", "grey")
    .attr("font-weight", "bold")
    .text("In Poverty (%)")
    .on("mouseover", function() {
      d3.select(this)
        .transition()
        .duration(500)
        .attr("fill", "black");
    }).on("mouseout", function() {
      d3.select(this)
        .transition()
        .duration(500)
        .attr("fill", "grey");
    }).on("click", function() {
      xSel = d3.select(this).attr("id");

      updateData(data, xSel, ySel);

      xLine.domain([d3.min(data, d => d[xSel])-1, d3.max(data,d => d[xSel])+1]);
      svg.select(".x")
        .transition()
        .call(xAxis);

      circlesGroup.data(data)
        .transition()
        .attr("cx", d => xLine(d[xSel]))
        .attr("r", "10")
        .attr("opacity", ".5");

      abbre.data(data)
        .transition()
        .attr("x", (d) => xLine(d[xSel])-6);

      selection(chartGroup, xSel, ySel);
      // build(svg, chartGroup);
    });

  var ageX = chartGroup.append("text")
    .attr("transform", `translate(${width / 2.2}, ${height + margin.top + 45})`)
    .attr("class", "axisText")
    .attr("id", "age")
    .attr("fill", "grey")
    .text("Age (Median)")
    .on("mouseover", function() {
      d3.select(this)
        .transition()
        .duration(500)
        .attr("fill", "black");
    }).on("mouseout", function() {
      d3.select(this)
        .transition()
        .duration(500)
        .attr("fill", "grey");
    }).on("click", function() {
      xSel = d3.select(this).attr("id");

      updateData(data, xSel, ySel);

      xLine.domain([d3.min(data, d => d[xSel])-1, d3.max(data,d => d[xSel])+1]);
      svg.select(".x")
        .transition()
        .call(xAxis);

      circlesGroup.data(data)
        .transition()
        .attr("cx", d => xLine(d[xSel]))
        .attr("r", "10")
        .attr("opacity", ".5");

      abbre.data(data)
        .transition()
        .attr("x", (d) => xLine(d[xSel])-6);

      selection(chartGroup, xSel, ySel);
      // build(svg, chartGroup);
    });

  var ageX = chartGroup.append("text")
    .attr("transform", `translate(${width / 2.5}, ${height + margin.top + 70})`)
    .attr("class", "axisText")
    .attr("id", "income")
    .attr("fill", "grey")
    .text("House Hold Income (Median)")
    .on("mouseover", function() {
      d3.select(this)
        .transition()
        .duration(500)
        .attr("fill", "black");
    }).on("mouseout", function() {
      d3.select(this)
        .transition()
        .duration(500)
        .attr("fill", "grey");
    }).on("click", function() {
      xSel = d3.select(this).attr("id");

      updateData(data, xSel, ySel);

      xLine.domain([d3.min(data, d => d[xSel])-1000, d3.max(data,d => d[xSel])+1000]);
      svg.select(".x")
        .transition()
        .call(xAxis);

      circlesGroup.data(data)
        .transition()
        .attr("cx", d => xLine(d[xSel]))
        .attr("r", "10")
        .attr("opacity", ".5");

      abbre.data(data)
        .transition()
        .attr("x", (d) => xLine(d[xSel])-6);

      selection(chartGroup, xSel, ySel);
      // build(svg, chartGroup);
    });

}

function selection(chartGroup, xSel, ySel) {
  chartGroup.selectAll(".axisText")
    .attr("fill", "grey")
    .attr("font-weight", "normal");

  chartGroup.select(`#${xSel}`)
    .attr("font-weight", "bold")
    .attr("fill", "black");

  chartGroup.select(`#${ySel}`)
    .attr("font-weight", "bold")
    .attr("fill", "black");
}