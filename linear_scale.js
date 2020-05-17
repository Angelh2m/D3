
/* *
*  LESSON 24 === https://github.com/iamshaunjp/data-ui-with-d3-firebase/blob/lesson-24/index.js
* FINAL CODE https://github.com/iamshaunjp/data-ui-with-d3-firebase/blob/lesson-28/index.js
*/

const svg = d3.select('.canvas')
    .append('svg')
    .attr('width', 600)
    .attr('height', 600);

// create margins & dimensions
const margin = { top: 20, right: 20, bottom: 100, left: 100 };
const graphWidth = 600 - margin.left - margin.right;
const graphHeight = 600 - margin.top - margin.bottom;


let render = async () => {
    // let data = await d3.json("./menu.json");
    let data = []
    let firebaseData = await db.collection('dishes').get();
    firebaseData.forEach(element => {
        data.push(element.data())
    });
    console.warn(data);

    const min = d3.min(data, d => d.orders);
    const max = d3.max(data, d => d.orders);
    const extent = d3.extent(data, d => d.orders);
    console.log(min, max, extent);

    const graph = svg.append('g')
        .attr('width', graphWidth)
        .attr('height', graphHeight)
        .attr('transform', `translate(${margin.left}, ${margin.top})`);


    const xAxisGroup = graph.append('g')
        .attr('transform', `translate(0, ${graphHeight})`)
    const yAxisGroup = graph.append('g');

    /* *
    *  This is for the bars
    */
    const y = d3.scaleLinear()
        .domain([0, max])
        .range([graphHeight, 0]);

    /* *
    *  This is to tell how wide the width needs to be
    */
    const x = d3.scaleBand()
        .domain(data.map(item => item.name))
        .range([0, 500])
        .paddingInner(0.2)
        .paddingOuter(0.2)

    const rects = graph.selectAll('rect')
        .data(data);

    /* *
    *  Add the first rectangle
    */
    // rects.attr('width', x.bandwidth)
    //     .attr('height', d => graphHeight - y(d.orders))
    //     .attr('fill', 'orange')
    //     .attr('x', (d) => x(d.name))
    //     .attr('y', d => y(d.orders));

    /* *
    *  Add the rest of rectangles
    */
    rects.enter()
        .append('rect')
        .attr('width', x.bandwidth)
        .attr("height", d => graphHeight - y(d.orders))
        .attr('fill', 'orange')
        .attr('x', (d) => x(d.name))
        .attr('y', d => y(d.orders));

    // create & call axes
    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y).ticks(6)

    xAxisGroup.call(xAxis);
    yAxisGroup.call(yAxis);

    xAxisGroup.selectAll('text')
        // .attr('fill', 'orange')
        .attr('transform', 'rotate(-40)')
        .attr('text-anchor', 'end')

}


render();


// console.log("LOADED");
