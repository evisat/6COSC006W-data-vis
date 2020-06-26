import d3 from './d3-imports';
import chartConfig from './chart-config';
import FormatScatterChartData from './format-scatter-chart-data';

class ScatterCharts {
    constructor(data) {
        this.rawData = data;
        this.container = document.querySelector('.scatterplot-container-charts--chart');

        this.margin = {
            top: 30,
            right: 35,
            bottom: 50,
            left: 30,
        };

        this.dataFormatter = new FormatScatterChartData();
        this.data = this.dataFormatter.createDropdownList(this.rawData);
        this.campusName = this.dataFormatter.campusName;

        document.querySelector('.scatterplot-container-charts--description').innerHTML = `The scatterplot shows a relationship between average module attendance and average module marks for courses based in <span class="title-${this.campusName.replace(' ', '')}" id="campusName">${this.campusName}</span>`;
        document.querySelector('.scatterplot-container-charts--title').innerHTML = 'Attendance and Performance';
        document.querySelector('.scatterplot-container-charts--description-two').innerHTML = `The linear regression line shows a stronger positive correlation for courses held at Cavendish campus compared to those in the Harrow campus. Based on individual <span class="dot-scatter dot-${this.campusName.replace(' ', '')}"></span> data of students.`;

        // initial sizing (will resize to the viewport when drawn)
        this.width = chartConfig.width - this.margin.left - this.margin.right;
        this.height = chartConfig.height - this.margin.top - this.margin.bottom;

        // create chart
        this.drawScatterplot();
        this.addEventListener();

        // resize to fit page & add resize listener
        this.resize();
        d3.select(window).on('resize', this.resize.bind(this));
    }

    drawScatterplot() {
        // create chart
        this.appendSVG();
        this.scaleX();
        this.scaleY();
        this.addXAxis();
        this.addYAxis();
        this.svg.append('g').attr('class', `container--${this.campusName.replace(' ', '')}`);
        Object.keys(this.data).forEach((course) => {
            this.addDots(this.data[course]);
            this.addTrendLine(this.data[course]);
        });
        this.addXAxisLabel();
        this.addYAxisLabel();
    }

    appendSVG() {
        this.svg = d3.select(this.container)
            .append('svg')
            .attr('class', 'scatter-plot--svg')
            .attr('width', this.width + this.margin.left + this.margin.right)
            .attr('height', this.height + this.margin.top + this.margin.bottom)
            .attr('aria-hidden', 'true')
            .append('g')
            .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
    }

    scaleX() {
        this.x = d3.scaleLinear()
            .domain([0, this.dataFormatter.getMaxCount('perc_attendance')])
            .range([0, this.width]);
    }

    scaleY() {
        this.y = d3.scaleLinear()
            .domain([0, this.dataFormatter.getMaxCount('average_modulemark')])
            .range([this.height, 0]);
    }

    addXAxis() {
        this.svg.append('g')
            .attr('class', 'x-axis');
        this.formatXAxis();
    }

    formatXAxis() {
        d3.select(document.querySelector('.x-axis'))
            .attr('transform', `translate(-2,${this.height})`)
            .call(d3.axisBottom(this.x)
                .tickSizeOuter(0)
                .ticks(5));
    }

    addXAxisLabel() {
        this.svg.append('text')
            .attr('class', 'x-axis-label')
            .attr('transform', 'translate(50, 270)')
            .text('% attendance');
    }

    addYAxis() {
        this.svg.append('g')
            .attr('class', 'y-axis')
        this.formatYAxis();
    }

    formatYAxis() {
        d3.select(document.querySelector('.y-axis'))
            .call(d3.axisLeft(this.y)
                .ticks(4)
                .tickSize([-this.width]));
    }

    addYAxisLabel() {
        this.svg.append('text')
            .attr('class', 'y-axis-label')
            .attr('transform', 'translate(-20, -10)')
            .text('% marks');
    }

    addDots(course) {
        const data = course;
        d3.select(`.container--${this.campusName.replace(' ', '')}`)
            .append('g')
            .selectAll('.dot')
            .data(data)
            .attr('class', `dot-container-${course[0].course_code}`)
            .enter()
            .append('circle')
            .attr('class', `dot dot-${course[0].course_code}`)
            .attr('cx', (d) => this.x(d['perc_attendance']))
            .attr('cy', (d) => this.y(d['average_modulemark']))
            .attr('r', 1.5);
    }

    addTrendLine(course) {
        const data = this.calcLinearRegression(course);
        data.forEach((dta) => {
            dta.x = +dta.x;
            dta.y = +dta.y;
            dta.yhat = +dta.yhat;
        });

        this.trendLineContainer = d3.select(`.container--${this.campusName.replace(' ', '')}`).append('g')
            .attr('class', `line-container-${course[0].course_code}`);

        const line = d3.line()
            .x((d) => this.x(d.x))
            .y((d) => this.y(d.yhat));

        this.trendLineContainer.append('path')
            .datum(data)
            .attr('class', `line trend-line-${course[0].course_code}`)
            .attr('d', line)
            .style('stroke-width', 1.5)
            .style('fill', 'none');
    }

    calcLinearRegression(data) {
        let x = [];
        let y = [];
        let n = data.length;
        let x_mean = 0;
        let y_mean = 0;
        let term1 = 0;
        let term2 = 0;
        let i;
        // create x and y values
        for (i = 0; i < n; i++) {
            y.push(data[i]['average_modulemark'])
            x.push(data[i]['perc_attendance']);
            x_mean += x[i]
            y_mean += y[i]
        }
        // calculate mean x and y
        x_mean /= n;
        y_mean /= n;

        // calculate coefficients
        let xr = 0;
        let yr = 0;
        for (i = 0; i < x.length; i++) {
            xr = x[i] - x_mean;
            yr = y[i] - y_mean;
            term1 += xr * yr;
            term2 += xr * xr;
        }

        const b1 = term1 / term2;
        const b0 = y_mean - (b1 * x_mean);

        // perform regression
        let yhat = [];
        // fit line using coeffs
        for (i = 0; i < x.length; i++) {
            yhat.push(b0 + (x[i] * b1));
        }


        let newData = [];
        for (i = 0; i < y.length; i++) {
            newData.push({
                "yhat": yhat[i],
                "y": y[i],
                "x": x[i]
            })
        }

        return (newData);
    }

    updateScatterplot(courseData) {
        this.scaleX();
        this.scaleY();

        this.formatXAxis();
        this.formatYAxis();

        this.svg.append('g').attr('class', `container--${this.campusName.replace(' ', '')}`);
        Object.keys(courseData).forEach((course) => {
            this.addDots(courseData[course]);
            this.addTrendLine(courseData[course]);
        });
    }

    addEventListener() {
        document.querySelector('#campus-select').addEventListener('change', (i) => {
            this.data = this.dataFormatter.updateChartData(i);
            d3.select(`.scatterplot-container-charts--chart .container--${this.campusName.replace(' ', '')}`).remove();
            this.campusName = this.dataFormatter.campusName;
            this.updateScatterplot(this.data);
        });
    }

    resize() {
        const chart = d3.select(document.querySelector('.scatterplot-container-charts--chart svg'));
        const width = parseInt(this.container.clientWidth, 10);
        this.width = width - this.margin.left - this.margin.right;

        // resize the chart
        chart
            .style('height', `${this.height + this.margin.top + this.margin.bottom}px`)
            .style('width', `${this.width + this.margin.left + this.margin.right}px`);

        // update X and Y range
        this.x.range([0, this.width]);
        this.y.range([this.height, 0]);

        // update axes
        this.formatXAxis();
        this.formatYAxis();

        chart.select('.x-axis-label').attr('transform', `translate(${(this.width - this.margin.left - this.margin.right - 10) / 2}, 270)`);

        // update dots
        Object.keys(this.data).forEach((course) => {
            chart.selectAll(`.dot-${course}`)
                .attr('cx', (d) => this.x(d['perc_attendance']))
                .attr('cy', (d) => this.y(d['average_modulemark']));
        });

        // update lines
        Object.keys(this.data).forEach((course) => {
            const line = d3.line()
                .x((d) => this.x(d.x))
                .y((d) => this.y(d.yhat));
            chart.select(`.trend-line-${course}`)
                .attr('d', line);
        });
    }
}

export default ScatterCharts;
