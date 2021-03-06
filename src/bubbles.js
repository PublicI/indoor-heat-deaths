import * as d3 from 'd3'

const margin = {
  top: 0,
  right: 20,
  bottom: 30,
  left: 20
}

const width = 900 - margin.left - margin.right
const height = 500 - margin.top - margin.bottom

const svg = d3
  .select('#bubbles')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

// Define a color scale by
// air conditioning status
const colorScale = d3
  .scaleOrdinal()
  .range(['#007D8A', '#F29E03', '#F85155', '#41B5C2'])

// Move the bubble blobs around
// depending on which year the data is from
var forceXSeparate = d3.forceX(d => {
 	if(d.air_conditioning === 'broken') {
		return width*0.2
	} else if (d.air_conditioning === 'off') { 
    return width*0.5 
  } else if (d.air_conditioning === 'none'){
  	return width*0.7
  } else if (d.air_conditioning === 'unknown'){
  	return width*0.9
  }}).strength(0.07)

var forceXSeparateYear = d3.forceX(d => {
	if(d.Year === '2016') {
		return width*.2
	} else if (d.Year === '2017') { 
    return width*.5
  } else if (d.Year === '2018'){return width*.8
  }}).strength(0.06)

// Define a force for combining the circles
var forceXCombine = d3.forceX(width/2).strength(0.05)

// Keep those circles from stacking on top of each other
var forceCollide = d3.forceCollide(20)

// This will define where the circles go
// and how they interact
var simulation = d3.forceSimulation()
  // Force x and force y will move circles
  // along the axes
  .force('x', forceXCombine)
  .force('y', d3.forceY(height/1.75).strength(0.05))
  .force('collide', forceCollide)

// Read in files
d3.csv(require('./maricopa_heat_deaths.csv'))
  .then(ready)

function ready (datapoints) {
  console.log('Data is', datapoints)
  var circles = svg
    .selectAll('circle')
    .data(datapoints)
    .enter()
    .append('circle')
    .attr('class', 
    	d => d.Name
    	)
    .attr('fill', 'lightgrey')
    .attr('r', 15)

    .on('mouseover', function(d) {
      d3.select(this)
        .transition()
        .duration(200)
        .attr('r', 19)

      d3.select('#name').text(d.Name)
      d3.select('#age').text(d.Age)
      d3.select('#temp').text(d.Temp_cleaned)
      d3.select('#year').text(d.Year)

      // Hide end quote on mouseover/click
      d3.select('#end-quote').style('display', 'none')
      d3.select('#info').style('display', 'block')
    })

    .on('mouseout', function(d) {
      // Change the color to the correct color
      // and set the radius back to normal
      d3.select(this)
        .transition()
        .duration(200)
        .attr('r', 15)
      d3.select('#info').style('display', 'none')

    })

  // Combine the bubbles on click
  d3.select("#combined").on('click', d => 
    simulation
    .force("x", forceXCombine)
    .alphaTarget(0.04)
    .restart()
    // console.log("Combine the bubbles.")
    )

  // Separate the bubbles on click
  d3.select("#status").on('click', d => 
    simulation
    .force("x", forceXSeparate)
    .alphaTarget(0.4)
    .restart()
    )

  // Separate the bubbles by year on click
  d3.select("#yearly").on('click', d => 
    simulation
    .force("x", forceXSeparateYear)
    .alphaTarget(0.3)
    .restart()
    )

    simulation.nodes(datapoints)
      // Each time there's a tick on the simulation
      // move the data according to the forces
      .on('tick', ticked)

    function ticked() {
    	circles
    	.attr('cx', d => d.x)
    	.attr('cy', d => d.y)
    }

// This is where the animations and timing live

		d3.select('#introduction')
		  .transition(750)
		  .style('display', 'block')

	    d3.select('#introduction')
		  .transition(750)
		  .delay(5000)
		  .style('display', 'none')

	    d3.select('#dickinson')
		  .transition(750)
		  .delay(5000)
		  .style('display', 'block')

		d3.selectAll('circle')
		.transition(750)
		.delay(5000)
		.attr('fill', function(d) {
		if(d.Name === 'James Allen Dickinson') {
			return colorScale(d.air_conditioning)
			}
			else return 'lightgrey'
		})
		.attr('r', d => {
			if(d.Name === 'James Allen Dickinson') {
				return 19
			} else return 15
		})
		
	d3.select('#dickinson')
		.transition(750)
		.delay(15000)
		.style('display', 'none')

	d3.select('#broken')
		.transition(750)
		.delay(15000)
		.style('display', 'block')

	d3.selectAll('circle')
		.transition(750)
		.delay(15000)
		.attr('fill', function(d) {
		if(d.air_conditioning === 'broken') {
			return colorScale(d.air_conditioning)
			}
			else return 'lightgrey'
		})
		.attr('fill-opacity', function(d) {
		if(d.Name === 'James Allen Dickinson') {
			return 1
			}
			else return 0.5
		})
		.attr('r', d => {
			if(d.air_conditioning === 'broken') {
				return 19
			} else return 15
		})
		
	d3.select('#broken')
		.transition(750)
		.delay(25000)
		.style('display', 'none')

	d3.select('#noac')
		.transition(750)
		.delay(25000)
		.style('display', 'block')

	d3.selectAll('circle')
		.transition(750)
		.delay(25000)
		.attr('fill', function(d) {
		if(d.air_conditioning === 'off') {
			return colorScale(d.air_conditioning)
			}
			else return 'lightgrey'
		})
		.attr('fill-opacity', function(d) {
		if(d.Name === 'Erminia Quihuis Chacon') {
			return 1
			}
			else return 0.5
		})
		.attr('r', d => {
			if(d.air_conditioning === 'off') {
				return 19
			} else return 15
		})

    d3.select('#noac')
		.transition(750)
		.delay(35000)
		.style('display', 'none')

	d3.select('#off')
		.transition(750)
		.delay(35000)
		.style('display', 'block')

	d3.selectAll('circle')
		.transition(750)
		.delay(35000)
		.attr('fill', function(d) {
		if(d.air_conditioning === 'none') {
			return colorScale(d.air_conditioning)
			}
			else return 'lightgrey'
		})
		
		.attr('fill-opacity', function(d) {
		if(d.Name === 'Humberto Montoya Ayala') {
			return 1
			}
			else return 0.5
		})
		.attr('r', d => {
			if(d.air_conditioning === 'none') {
				return 19
			} else return 15
		})

	d3.select('#off')
		.transition(750)
		.delay(45000)
		.style('display', 'none')

	d3.select('#unknown')
		.transition(750)
		.delay(45000)
		.style('display', 'block')

	d3.selectAll('circle')
		.transition(750)
		.delay(45000)
		.attr('fill', function(d) {
		if(d.air_conditioning === 'unknown') {
			return colorScale(d.air_conditioning)
			}
			else return 'lightgrey'
		})
		.attr('fill-opacity', function(d) {
		if(d.Name === 'Candace Dale Bader') {
			return 1
			}
			else return 0.5
		})
		.attr('r', d => {
			if(d.air_conditioning === 'unknown') {
				return 19
			} else return 15
		})

	d3.select('#unknown')
		.transition(750)
		.delay(55000)
		.style('display', 'none')

	d3.select('#end-quote')
		.transition(750)
		.delay(55000)
		.style('display', 'block')

    d3.selectAll('circle')
    .transition(750)
    .delay(55000)
    .attr('fill', d => {
      return colorScale(d.air_conditioning)
    })
    .attr('fill-opacity', 1)
    .attr('stroke', 'none')
    .attr('r', 15)



	}
	