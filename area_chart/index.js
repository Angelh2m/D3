// dataset describing the consumption of renewable energy at world level
// https://data.worldbank.org/indicator/EG.FEC.RNEW.ZS
const data = [
    {
        year: '1998',
        price: 5000,
    },
    {
        year: '1999',
        price: 9000,
    },
    {
        year: '2000',
        price: 2000,
    },
    {
        year: '2001',
        price: 10000,
    },
    {
        year: '2002',
        price: 9000,
    },
    {
        year: '2003',
        price: 5000,
    },
    {
        year: '2004',
        price: 8000,
    },
    {
        year: '2005',
        price: 19800,
    },
   
];

// in the .viz container add an svg element following the margin convention
const margin = {
    top: 40,
    right: 50,
    bottom: 40,
    left: 40,
};
const width = 700 - (margin.left + margin.right);
const height = 350 - (margin.top + margin.bottom);

const svg = d3
    .select('.viz')
    .append('svg')
    .attr('viewBox', `0 0 ${width + (margin.left + margin.right)} ${height + (margin.top + margin.bottom)}`);

// describe a gradient for the visualization
const defs = svg
    .append('defs');

const linearGradient = defs
    .append('linearGradient')
    .attr('id', 'gradient')
    .attr('gradientUnits', 'userSpaceOnUse')
    .attr('x1', 0)
    .attr('x2', width)
    .attr('y1', height / 2)
    .attr('y2', height / 2);

linearGradient
    .append('stop')
    .attr('stop-color', '#0cbde7')
    .attr('offset', 0);

linearGradient
    .append('stop')
    .attr('stop-color', '#58d943')
    .attr('offset', 1);

// include the visualization in the nested graph
const graph = svg
    .append('g')
    .attr('transform', `translate(${margin.left} ${margin.right})`);

// describe the scales for the line chart
// x-axis: time scale using the years
const xScale = d3
    .scaleTime()
    .domain([new Date(data[0].year), new Date(data[data.length - 1].year)]) // ! the domain of a time scale describes two date objects
    .range([0, width]);

// y-axis: linear scale using the prices
// consider two values outside of the prices' actual minimum and maximum values
// this to show whitespace around the line chart
const [minP, maxP] = d3.extent(data, ({ price }) => price);
const yScale = d3
    .scaleLinear()
    .domain([minP * 0.95, maxP * 1.05]) // 5% around the actual values
    .range([height, 0]); // flip the range considering the top down nature of the SVG coordinate system

// include the axes based on the defined scales
const xAxis = d3
    .axisBottom(xScale)
    .tickValues(data.map(function(d){
        console.warn(d.year);
        
        return new Date(d.year)
    }))
    .tickFormat(d3.timeFormat("%Y"))
    // .ticks(data.length)

graph
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', `translate(0 ${height})`)
    .call(xAxis);

const yAxis = d3
    .axisLeft(yScale)
    .tickValues(data.map(function(d){
        console.warn(d.price);
        
        return d.price
    }))

graph
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis);

// remove the ticks and lines fabricating the axes
// d3
//     .selectAll('g.axis')
//     .selectAll('g.tick')
//     // .remove();

d3
    .selectAll('g.axis')
    .select('path')
    .remove();


/* *
*  HORIZONTAL LINE
*/
graph.selectAll("vline")
.data(data)
.enter()
.append("line")
.attr('stroke', '#e6f9e4')
.attr('stroke-width', 1)
.attr('stroke-dasharray', 2)
.attr('class', 'vlines')
.style('opacity', 1)
.attr("x1", function(d) { 

    return xScale( new Date(d.year) )
})
.attr("x2", function(d) { 
    return xScale( new Date(d.year) )
})
.attr('y1', height)


/* *
*  VERTICAL LINE
*/
graph.selectAll("vline")
    .data(data)
    .enter()
    .append("line")
    .attr('stroke', '#e6f9e4')
    .attr('stroke-width', 1)
    // .attr('stroke-dasharray', 2)
    .attr('class', 'vlines')
    .style('opacity', 1)
    .attr("y1", function(d) { 
        console.warn(d.price);
        return yScale( d.price )
    })
    .attr("y2", function(d) { 
        return yScale(d.price )
    })
    .attr('x1', width)

    // .attr('y2', yScale(height));
    // .attr("x", function(d) { return x(d.Country); })
    // .attr("y", function(d) { return y(d.Value); })
    // .attr("width", x.bandwidth())
    // .attr("height", function(d) { return height - y(d.Value); })
    // .attr("fill", "#69b3a2")


/* *
*  DOTTED LINE
*/

const dottedLines = graph.append('g')
    .attr('class', 'lines')
    .style('opacity', 1);

const xDottedLine = dottedLines.append('line')
    .attr('stroke', '#aaa')
    .attr('stroke-width', 1)
    .attr('stroke-dasharray', 4);

xDottedLine
    .attr('x1', xScale(new Date('1992')))
    .attr('x2', xScale(new Date('1992')))
    .attr('y1', height)
    .attr('y2', yScale(height));

// add three graph elements for the horizontal grid lines
const lines = graph
    .selectAll('g.line')
    .data([0, height / 2, height])
    .enter()
    .append('g')
    .attr('transform', d => `translate(0 ${d})`);

// lines
//     .append('path')
//     .attr('d', `M 0 0 h ${width}`)
//     .attr('fill', 'none')
//     .attr('stroke', 'currentColor')
//     .attr('opacity', 0.2);

// add three text elements describing the value at the end of the three lines
// format the values to include 2 digits after the decimal point
// const formatprice = d3.format('.2f');
// lines
//     .append('text')
//     .attr('x', width + 4)
//     .attr('y', -2)
//     .attr('fill', 'currentColor')
//     .text(d => `${formatprice(yScale.invert(d))}%`)
//     .attr('font-size', 14);

// for the x-axis include the start and end year
// format the values to show only the year
// const formatYear = d3.timeFormat('%Y');
// const ticks = graph
//     .selectAll('g.year')
//     .data([0, width])
//     .enter()
//     .append('g')
//     .attr('transform', d => `translate(${d} ${height})`);

// ticks
//     .append('text')
//     .attr('x', 0)
//     .attr('y', 30)
//     .attr('text-anchor', (d, i) => i === 0 ? 'start' : 'end')
//     .attr('fill', 'currentColor')
//     .text(d => `${formatYear(xScale.invert(d))}`)
//     .attr('font-size', 14);

// describe the line function to plot the data through a path element
// for each data point the line function computes the coordinates based on the input year and price
const line = d3
    .line()
    .x(({ year }) => {
        let line = xScale(new Date(year))
        // console.warn(year, line);
        return line;
    }) // to obtain the value from the time scale the input needs to be a date object (like the domain)
    .y(({ price }) => yScale(price))
    .curve(d3.curveBasis);// include a curve instead of straight segments

// add a path element using the line function
graph
    .append('path')
    .attr('d', line(data))
    .attr('fill', 'none')
    .attr('stroke', 'url(#gradient)')
    .attr('stroke-width', 5);


// describe an area function below the line
const area = d3
    .area()
    .x(({ year }) => xScale(new Date(year)))
    .y0(({ price }) => yScale(minP * 0.95)) // going from the bottom of the visualization to the data points' values
    .y1(({ price }) => yScale(price))
    .curve(d3.curveBasis); // same curve of the line

// style the area with the gradient and a semi transparent fill
graph
    .append('path')
    .attr('d', area(data))
    .attr('fill', 'url(#gradient)')
    .attr('opacity', 0.15);

// include a dot for the last data point
const { year: lastYear, price: lastprice } = data[data.length - 1];
let circle  = graph
    .append('circle')
    .attr('cx', xScale(new Date(lastYear)))
    .attr('cy', yScale(lastprice))
    .attr('r', 8)
    .attr('fill', '#58d943')

let animatedCircle  = graph
    .append('circle')
    .attr('cx', xScale(new Date(lastYear)))
    .attr('cy', yScale(lastprice))
    .attr('r', 8)
    .attr('fill', '#58d943')
    .transition()
    .duration(2000)
        .ease(Math.sqrt)
        .attr("r", 20)
        .style("fill-opacity", 1e-6)
        .style("stroke-opacity", 1e-10)
        .remove()
        // setTimeout(animatedCircle, 200);

 d3.interval(function(elapsed) {
    graph
    .append('circle')
    .attr('cx', xScale(new Date(lastYear)))
    .attr('cy', yScale(lastprice))
    .attr('r', 8)
    .attr('fill', '#58d943')
    .transition()
    .duration(2000)
        .ease(Math.sqrt)
        .attr("r", 20)
        .style("fill-opacity", 1e-6)
        .style("stroke-opacity", 1e-6)
        .remove()
            // .transition()
            //   .attr("cx", xScale(new Date(lastYear)))
            //   .attr("cy", yScale(lastprice))
            //   .attr('r', 20)
            //   .attr('fill', '#58d943')
            //   .attr('opacity', 0.2)
            // .transition()
            //   .attr("cx", xScale(new Date(lastYear)))
            //   .attr("cy", yScale(lastprice))
            //   .attr('r', 20)
            //   .attr('fill', '#58d943')
            //   .attr('opacity', 0.2)
            //   .transition()
            //   .attr('opacity', 0);
            //   .transition()
            //   .attr("cx", 95)
            //   .attr("cy", 10)
            //   .transition()
            //   .attr("cx", 190)
            //   .attr("cy", 100)
 }, 2000);


//  d3.interval(function(elapsed) {
//     animatedCircle
//             .transition()
//               .attr("cx", xScale(new Date(lastYear)))
//               .attr("cy", yScale(lastprice))
//               .attr('r', 20)
//               .attr('fill', '#58d943')
//               .attr('opacity', 0.2)
//             .transition()
//               .attr("cx", xScale(new Date(lastYear)))
//               .attr("cy", yScale(lastprice))
//               .attr('r', 20)
//               .attr('fill', '#58d943')
//               .attr('opacity', 0.2)
//               .transition()
//               .attr('opacity', 0);
//             //   .transition()
//             //   .attr("cx", 95)
//             //   .attr("cy", 10)
//             //   .transition()
//             //   .attr("cx", 190)
//             //   .attr("cy", 100)
//  }, 1000);