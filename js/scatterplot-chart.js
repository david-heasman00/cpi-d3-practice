//Load data
d3.csv("data/CPI_data.csv", d3.autoType).then(data => {
    console.log("cpi", data);
    drawScatterPlot(data);
});

//Create scatterplot here
const drawScatterPlot = (data) => {

  /****************************/
  /* Declare margin constants */
  /****************************/
  const margin = {top: 40, right: 170, bottom: 25, left:40};
  const width = 1000;
  const height = 500;
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  /****************************/
  /*     Append containers    */
  /****************************/
  //Append SVG container
  const svg = d3.select("#scatterplot-chart")
    .append("svg")
      .attr("viewBox", `0, 0, ${width}, ${height}`)


  //Append group that will hold inner chart
  const innerChart = svg
    .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

  /****************************/
  /*     Declare scales       */
  /****************************/
  // X scale
  const firstDate = new Date(2014, 00, 01, 0, 0, 0);
  const lastDate = d3.max(data, d => d.date);
  const xScale = d3.scaleTime()
    .domain([firstDate, lastDate])
    .range([0, innerWidth]);
  
  // Y scale
  const maxValue = d3.max(data, d => d.cpi);
  const yScale = d3.scaleLinear()
    .domain([0, maxValue])
    .range([innerHeight, 0]);

  /****************************/
  /*     Append axes          */
  /****************************/
  //Bottom axis
  const bottomAxis = d3.axisBottom(xScale)
    .tickFormat(d3.timeFormat("%Y"));
  innerChart
    .append("g")
      .attr("class", "axis-x")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(bottomAxis);
  //Set labels to be in middle of ticks
  d3.selectAll(".axis-x text")
    .attr("x", d => {
      const currentYear = d;
      const nextYear = new Date(currentYear.getFullYear() + 1, 0, 1);
      return (xScale(nextYear) - xScale(currentYear)) /2 ;
    })
    .attr("y", "10px");

  // Left axis
  const leftAxis = d3.axisLeft(yScale);
  innerChart
    .append("g")
      .attr("class", "axis-y")
      .call(leftAxis);
  d3.selectAll(".axis-y text")
    .attr("x", "-5px");

  /****************************/
  /* Bind data to scatterplot */
  /****************************/
  const mainDataColour = "#B3477D";
  innerChart
    .selectAll("circle")
    .data(data)
    .join("circle")
      .attr("r", 4)
      .attr("cx", d => xScale(d.date))
      .attr("cy", d => yScale(d.cpi))
      .attr("fill", mainDataColour);
};