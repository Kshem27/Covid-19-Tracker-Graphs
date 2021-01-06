const url = 'https://api.covid19india.org/data.json';
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
window.onload = () => {
	$('#confirmed').click();
};
