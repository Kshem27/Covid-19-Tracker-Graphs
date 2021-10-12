const url = 'https://still-coast-68855.herokuapp.com/data';
const height = 600,
	width = 600,
	radius = 2,
	padding = 60;
d3.select('svg').attr('width', width).attr('height', height);
$('#confirmed').click(() => {
	graph('totalconfirmed', 'red');
	$('#heading').text('Confirmed Cases');
});
$('#deaths').click(() => {
	graph('totaldeceased', 'black');
	$('#heading').text('Deaths');
});
$('#recovered').click(() => {
	graph('totalrecovered', 'green');
	$('#heading').text('Recovered');
});
function graph(item, color) {
	d3.select('svg').selectAll('*').remove();
	axios
		.get(url)
		.then((res) => {
			let dailyCases = res.data['cases_time_series'];
			let yScale = d3
				.scaleLinear()
				.domain(d3.extent(dailyCases, (d) => +d[item]))
				.range([ height - padding, padding ]);
			let yAxis = d3.axisLeft(yScale).tickSize(-width + 2 * padding).tickSizeOuter(0);
			let xScale = d3.scaleLinear().domain([ 0, dailyCases.length ]).range([ padding, width - padding ]);
			let xAxis = d3.axisBottom(xScale).tickSize(-height + 2 * padding).tickSizeOuter(0);
			d3.select('svg').append('g').attr('transform', 'translate(' + padding + ',0)').call(yAxis);
			d3.select('svg').append('g').attr('transform', 'translate(0,' + (height - padding) + ')').call(xAxis);

			d3
				.select('svg')
				.selectAll('circle')
				.data(dailyCases)
				.enter()
				.append('circle')
				.attr('cx', (d, i) => xScale(i))
				.attr('cy', (d, i) => yScale(+d[item]))
				.attr('fill', color)
				.attr('r', radius);

			d3
				.select('svg')
				.append('text')
				.attr('transform', 'rotate(-90)')
				.attr('x', -height / 2)
				.attr('y', 10)
				.attr('font-size', '0.8em')
				.attr('text-anchor', 'middle')
				.text('No. Of Cases');
			d3
				.select('svg')
				.append('text')
				.attr('x', width / 2)
				.attr('y', height - padding)
				.attr('dy', '1.3em')
				.attr('text-anchor', 'middle')
				.text('Days');
			d3
				.select('svg')
				.append('text')
				.attr('x', width / 2)
				.attr('y', padding)
				.attr('font-size', '2em')
				.attr('text-anchor', 'middle')
				.text('No. Of Cases Over the Days');
		})
		.catch((err) => console.log(err));
}
var heightSecond = 500;
// var width = 600;
var numBars = 37;
var barPadding = 5;
var paddin = 10;
var barWidth = width / numBars - barPadding;
axios
	.get(url)
	.then((res) => {
		let stateData = res.data['statewise'];
		stateData.shift();
		let state = d3.select('#statewise').selectAll('rect').data(stateData, (d, i) => d.confirmed);
		let maxCases = 10500000;
		let yScale = d3.scaleLinear().domain([ 0, maxCases ]).range([ heightSecond - paddin, paddin ]);

		let stateEnter = state.enter().append('g');
		let colorScale = d3
			.scaleLinear()
			.domain(d3.extent(stateData, (d) => +d.recovered / +d.confirmed))
			.range([ 'red', 'green' ]);
		stateEnter.append('rect');
		stateEnter.append('text');
		stateEnter
			.select('rect')
			.attr('fill', (d) => colorScale(d.recovered / d.confirmed))
			.attr('width', barWidth)
			.attr('height', (d, i) => heightSecond - yScale(d.confirmed))
			.attr('x', (d, i) => (barWidth + barPadding) * i)
			.attr('y', (d, i) => yScale(d.confirmed));
		stateEnter
			.select('text')
			.attr('transform', 'rotate(-90)')
			.attr('y', (d, i) => (barWidth + barPadding) * i + barWidth / 2)
			.attr('x', (d, i) => -yScale(d.confirmed))
			.attr('alignment-baseline', 'middle')
			.attr('font-size', '0.8em')
			.text((d, i) => d.state);
	})
	.catch((err) => console.log(err));
window.onload = () => {
	$('#confirmed').click();
};
