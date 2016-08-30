require('./index.css');

export class BasicChart {
  constructor(data) {
    var d3 = require('d3'); // Require D3 via Webpack

    this.data = data;
    this.svg = d3.select('div#chart').append('svg');

    this.margin = {
      left: 50,
      top: 30,
      right: 30,
      bottom: 30
    };

    this.svg.attr('width', window.innerWidth);
    this.svg.attr('height', window.innerHeight);

    this.width = window.innerWidth - this.margin.left - this.margin.right;
    this.height = window.innerHeight - this.margin.top - this.margin.bottom;

    this.chart = this.svg.append('g')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
  }
}

export class BasicBarChart extends BasicChart {
  constructor(data) {
    super(data);  // Run the constructor in BasicChart, attaching chart to `this.chart`

    let d3 = require('d3');

    let x = d3.scale.ordinal().rangeRoundBands([this.margin.left, this.width - this.margin.right], 0.1);
    let y = d3.scale.linear().range([this.height, this.margin.bottom]);

    x.domain(data.map(function(d) { return d.name }));
    y.domain([0, d3.max(data, function(d) { return d.population; })]);

    let xAxis = d3.svg.axis().scale(x).orient('bottom');
    let yAxis = d3.svg.axis().scale(y).orient('left');

    this.chart.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(0, ${this.height})`)
        .call(xAxis);

    this.chart.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(${this.margin.left}, 0)`)
        .call(yAxis);

    this.chart.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', (d) => { return x(d.name); })
        .attr('width', x.rangeBand())
        .attr('y', () => { return y(this.margin.bottom); })
        .attr('height', 0)
        .transition()
        .delay(function (d, i) { return i*20; })
        .duration(800)
        .attr('y', function (d) { return y(d.population); })
        .attr('height', (d) => {return this.height - y(d.population); }.bind(this));
  }
}


let data = require('./data/chapter1.json');

let totalNumbers = data.filter((obj) => {return obj.population.length; })
  .map((obj) => {
    return {
      name: obj.name,
      population: Number(obj.population[0].value)
    };
  });

new BasicBarChart(totalNumbers);
