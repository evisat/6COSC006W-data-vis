import d3 from '../../utils/d3-imports';
import chartConfig from './chart-config-predict.json';
import FormatPredictChartData from './format-predict-chart-data';

class PredictGrades {
    constructor(data) {
        this.rawData = data;
        this.container = document.querySelector('.dv-prediction-container-form--chart');

        this.margin = {
            top: 25,
            right: 25,
            bottom: 40,
            left: 30,
        };

        this.dataFormatter = new FormatPredictChartData();
        this.data = this.dataFormatter.createDropdownLists(this.rawData);
        this.course = this.dataFormatter.course;

        document.querySelector('.dv-prediction-container-form--title').innerHTML =
            "What grade will you get?";
        document.querySelector('.dv-prediction-container-form--description').innerHTML =
            "Based on the results for the average module marks against average module attendance by students in your course, the following graph shows what your likely grade will be depending on your attendance.";

        // initial sizing (will resize to the viewport when drawn)
        this.width = chartConfig.width - this.margin.left - this.margin.right;
        this.height = chartConfig.height - this.margin.top - this.margin.bottom;

        // create chart
        this.drawScatterplot();
        this.createRangeSlider();
        this.addEventListeners();

        // resize to fit page & add resize listener
        this.resize();
        d3.select(window).on('resize.two', this.resize.bind(this));
    }

    drawScatterplot() {
        // create chart
        this.appendSVG();
        this.scaleX();
        this.scaleY();
        this.addXAxis();
        this.addYAxis();
        this.svg.append('g').attr('class', `container--${this.course.replace(/\s|\&|\:/g, '')}`);
        this.addDots(this.data);
        this.addTrendLine(this.data);
        this.addXAxisLabel();
        this.addYAxisLabel();
    }

    appendSVG() {
        this.svg = d3.select(this.container)
            .append('svg')
            .attr('class', 'predict-scatter-plot--svg')
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
            .attr('class', 'x-axis-predict');
        this.formatXAxis();
    }

    formatXAxis() {
        d3.select(document.querySelector('.x-axis-predict'))
            .attr('transform', `translate(-2,${this.height})`)
            .call(d3.axisBottom(this.x)
                .tickSizeOuter(0)
                .ticks(5));
    }

    addXAxisLabel() {
        this.svg.append('text')
            .attr('class', 'x-axis-predict-label')
            .attr('transform', 'translate(50, 225)')
            .text('% attendance');
    }

    addYAxis() {
        this.svg.append('g')
            .attr('class', 'y-axis-predict')
        this.formatYAxis();
    }

    formatYAxis() {
        d3.select(document.querySelector('.y-axis-predict'))
            .call(d3.axisLeft(this.y)
                .ticks(4)
                .tickSize([-this.width]));
    }

    addYAxisLabel() {
        this.svg.append('text')
            .attr('class', 'y-axis-predict-label')
            .attr('transform', 'translate(-20, -10)')
            .text('% marks');
    }

    addDots(course) {
        d3.select(`.container--${this.course.replace(/\s|\&|\:/g, '')}`)
            .append('g')
            .selectAll('.dot')
            .data(course)
            .attr('class', (d) => `dot-container-${d['course_code']}`)
            .enter()
            .append('circle')
            .attr('class', (d) => `dot dot-${d['course_code']}`)
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

        this.trendLineContainer = d3.select(`.container--${this.course.replace(/\s|\&|\:/g, '')}`).append('g');

        const line = d3.line()
            .x((d) => this.x(d.x))
            .y((d) => this.y(d.yhat));

        this.trendLineContainer.append('path')
            .datum(data)
            .attr('class', `line predict-trend-line-${course[0]['course_code']}`)
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
        this.b1 = b1;
        const b0 = y_mean - (b1 * x_mean);
        this.b0 = b0;

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

    updateScatterplot() {
        this.scaleX();
        this.scaleY();

        this.formatXAxis();
        this.formatYAxis();

        this.svg.append('g').attr('class', `container--${this.course.replace(/\s|\&|\:/g, '')}`);
        this.addDots(this.data);
        this.addTrendLine(this.data);
    }

    addEventListeners() {
        document.querySelector('#select-degreeType').addEventListener('change', (i) => {
            this.data = this.dataFormatter.updateCourseDropdown(i);
            d3.select(`.dv-prediction-container-form--chart .container--${this.course.replace(/\s|\&|\:/g, '')}`).remove();
            this.course = this.dataFormatter.course;
            this.updateScatterplot();
            this.updateRangeSlider();
        });

        document.querySelector('#select-course').addEventListener('change', (i) => {
            this.data = this.dataFormatter.updateChartData(i);
            d3.select(`.dv-prediction-container-form--chart .container--${this.course.replace(/\s|\&|\:/g, '')}`).remove();
            this.course = this.dataFormatter.course;
            this.updateScatterplot();
            this.updateRangeSlider();
        });

        document.querySelector('#slider-range').addEventListener('input', (i) => {
            // d3.selectAll(".small-scatter-plot--svg .linesOfIntersection").remove();
            this.updatePredictedMarks();
        });
    }

    createRangeSlider() {
        const predictedAverageTxt = document.querySelector('#predict-average-mark');
        // document.querySelector('.perc-select-form').innerHTML = '';

        this.rangeSlider = document.createElement('input');
        this.rangeSlider.type = 'range';
        this.rangeSlider.min = `${Math.min.apply(Math, this.data.map(function (o) { return o['perc_attendance'] }))}`;
        this.rangeSlider.max = `${Math.max.apply(Math, this.data.map(function (o) { return o['perc_attendance'] }))}`;
        this.rangeSlider.value = 50;
        this.rangeSlider.className = 'range-slider';
        this.rangeSlider.step = '0.01';
        this.rangeSlider.id = 'slider-range';
        document.querySelector('.perc-select-form').appendChild(this.rangeSlider);
        document.querySelector('.prediction-slider-label').innerHTML = "Select attendance";
        const perctsliderTxt = document.querySelector('#perct-slider-value');

        predictedAverageTxt.innerHTML = "Average module mark: <span id='pred-color'>" + this.getPredictedMarks(this.rangeSlider.value) + "%</span>";
        perctsliderTxt.innerHTML = `${this.rangeSlider.value}%`;
        this.updatePredictedMarks();
    }

    updateRangeSlider() {
        this.rangeSlider.min = `${Math.min.apply(Math, this.data.map(function (o) { return o['perc_attendance'] }))}`;
        this.rangeSlider.max = `${Math.max.apply(Math, this.data.map(function (o) { return o['perc_attendance'] }))}`;
        this.rangeSlider.value = 50;
        this.updatePredictedMarks();
    }

    getPredictedMarks(percValue) {
        this.percValue = percValue;
        this.pValue = (this.b0 + (this.percValue * this.b1)).toFixed(2);

        this.svg
            .append("line")
            .attr("class", "linesOfIntersection linesOfIntersection-y");

        this.svg
            .append("line")
            .attr("class", "linesOfIntersection linesOfIntersection-x");

        return this.pValue;
    }

    updatePredictedMarks() {
        const chart = d3.select(document.querySelector('.dv-prediction-container-form--chart svg'));
        this.percValue = this.rangeSlider.value;
        this.pValue = (this.b0 + (this.percValue * this.b1)).toFixed(2);

        chart.select(`.linesOfIntersection-y`)
            .attr("x1", this.x(parseFloat(this.percValue)))
            .attr("x2", this.x(parseFloat(this.percValue)))
            .attr("y1", this.y(0))
            .attr("y2", this.y(this.pValue));

        chart.select(`.linesOfIntersection-x`)
            .attr("x1", this.x(0))
            .attr("x2", this.x(parseFloat(this.percValue)) - 7)
            .attr("y1", this.y(this.pValue))
            .attr("y2", this.y(this.pValue))

        document.querySelector('#predict-average-mark').innerHTML = "Average module mark: <span id='pred-color'>" + this.pValue + "%</span>";
        document.querySelector('#perct-slider-value').innerHTML = `${this.percValue}%`;
    }

    resize() {
        const chart = d3.select(document.querySelector('.dv-prediction-container-form--chart svg'));
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

        chart.select('.x-axis-predict-label').attr('transform', `translate(${(this.width - this.margin.left - this.margin.right - 10) / 2}, 225)`);

        // update dots
        chart.selectAll(`.dot-${this.data[0]['course_code']}`)
            .attr('cx', (d) => this.x(d['perc_attendance']))
            .attr('cy', (d) => this.y(d['average_modulemark']));

        // update lines
        const line = d3.line()
            .x((d) => this.x(d.x))
            .y((d) => this.y(d.yhat));
        chart.select(`.predict-trend-line-${this.data[0]['course_code']}`)
            .attr('d', line);

        // update intersection lines
        chart.select(`.linesOfIntersection-y`)
            .attr("x1", this.x(parseFloat(this.percValue)))
            .attr("x2", this.x(parseFloat(this.percValue)))
            .attr("y1", this.y(0))
            .attr("y2", this.y(this.pValue));

        chart.select(`.linesOfIntersection-x`)
            .attr("x1", this.x(0))
            .attr("x2", this.x(parseFloat(this.percValue)) - 7)
            .attr("y1", this.y(this.pValue))
            .attr("y2", this.y(this.pValue))
    }
}

export default PredictGrades;
