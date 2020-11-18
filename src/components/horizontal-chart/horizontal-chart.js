import d3 from '../../utils/d3-imports';
import chartConfig from './chart-config-commute.json';
import FormaChartData from './format-chart-data';

class CommuteAttendance {
    constructor(data) {
        this.rawData = data;
        this.container = document.querySelector('.dv-horizontal-container-form--chart');

        this.margin = {
            top: 25,
            right: 25,
            bottom: 50,
            left: 30,
        };

        this.dataFormatter = new FormaChartData();
        this.data = this.dataFormatter.createDropdownLists(this.rawData);
        this.course = this.dataFormatter.course;

        document.querySelector('.dv-horizontal-container-form--title').innerHTML =
            "Commute length and attendance";
        document.querySelector('.dv-horizontal-container-form--description').innerHTML =
        "The scatterplot below shows a relationship between average commute length and average module marks."
        document.querySelector('.dv-horizontal-container-form--description-two').innerHTML = "Below are the top 5 course by average module mark: <i>(Click on a course)</i>";
        // initial sizing (will resize to the viewport when drawn)
        this.width = chartConfig.width - this.margin.left - this.margin.right;
        this.height = chartConfig.height - this.margin.top - this.margin.bottom;

        // create chart
        this.drawScatterplot();
        this.addEventListeners();
        this.createTop5buttons();

        // resize to fit page & add resize listener
        this.resize();
        d3.select(window).on('resize.three', this.resize.bind(this));
    }

    createTop5buttons() {
        const topFiveCourse = this.dataFormatter.getTop5Courses();

        topFiveCourse.forEach(course => {
            const button = document.createElement('button');
            button.setAttribute('class', 'five-buttons');
            button.value = course.degreeType;
            button.innerHTML = course.course;

            button.addEventListener('click', (e) => {
                this.dataFormatter.degree = e.target.value;
                this.dataFormatter.course = e.target.innerHTML;

                // update dataset for selected course
                this.data = this.dataFormatter.getTop5data(e, e.target.innerHTML);
                
                // remove selected from all options
                const degreeOptions = Array.from(document.querySelectorAll("#select-degreeType-commute option"));
                degreeOptions.forEach(option => option.removeAttribute('selected'));

                // update degree dropdown
                const selectedDegree = degreeOptions.filter((option) => option.value === this.dataFormatter.degree);
                selectedDegree[0].setAttribute('selected', '');

                // remove selected from all options
                const courseOptions = Array.from(document.querySelectorAll("#select-course-commute option"));
                courseOptions.forEach(option => option.removeAttribute('selected'));

                // update course dropdown
                const selectedCourse = courseOptions.filter((option) => option.value === this.dataFormatter.course);
                selectedCourse[0].setAttribute('selected', '');

                d3.select(`.dv-horizontal-container-form--chart .container--${this.course.replace(/\s|\&|\:|\(Sandwich\)/g, '')}-commute`).remove();
                this.updateScatterplot();
            });

            document.querySelector('.dv-horizontal-container-form--buttons').appendChild(button);
        })
    }

    drawScatterplot() {
        // create chart
        this.appendSVG();
        this.scaleX();
        this.scaleY();
        this.addXAxis();
        this.addYAxis();
        this.svg.append('g').attr('class', `container--${this.course.replace(/\s|\&|\:|\(Sandwich\)/g, '')}-commute`);
        this.addDots(this.data);
        this.addXAxisLabel();
        this.addYAxisLabel();
    }

    appendSVG() {
        this.svg = d3.select(this.container)
            .append('svg')
            .attr('class', 'commute-scatter-plot--svg')
            .attr('width', this.width + this.margin.left + this.margin.right)
            .attr('height', this.height + this.margin.top + (this.margin.bottom - 40))
            .attr('aria-hidden', 'true')
            .append('g')
            .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
    }

    scaleX() {
        this.x = d3.scaleLinear()
            .domain([0, this.dataFormatter.getMaxCount('commute_length')])
            .range([0, this.width]);
    }

    scaleY() {
        this.y = d3.scaleLinear()
            .domain([0, this.dataFormatter.getMaxCount('average_modulemark')])
            .range([this.height, 0]);
    }

    addXAxis() {
        this.svg.append('g')
            .attr('class', 'x-axis-commute');
        this.formatXAxis();
    }

    formatXAxis() {
        d3.select(document.querySelector('.x-axis-commute'))
            .attr('transform', `translate(-2,${this.height})`)
            .call(d3.axisBottom(this.x)
                .tickSizeOuter(0)
                .ticks(4));
    }

    addXAxisLabel() {
        this.svg.append('text')
            .attr('class', 'x-axis-commute-label')
            .text('% commute length');
    }

    addYAxis() {
        this.svg.append('g')
            .attr('class', 'y-axis-commute')
        this.formatYAxis();
    }

    formatYAxis() {
        d3.select(document.querySelector('.y-axis-commute'))
            .call(d3.axisLeft(this.y)
                .ticks(4)
                .tickSize([-this.width]));
    }

    addYAxisLabel() {
        this.svg.append('text')
            .attr('class', 'y-axis-commute-label')
            .attr('transform', 'translate(-20, -10)')
            .text('% marks');
    }

    addDots(course) {
        d3.select(`.container--${this.course.replace(/\s|\&|\:|\(Sandwich\)/g, '')}-commute`)
            .append('g')
            .selectAll('.dot')
            .data(course)
            .attr('class', (d) => `dot-container-${d['course_code']}`)
            .enter()
            .append('circle')
            .attr('class', (d) => `dot dot-${d['course_code']}`)
            .attr('cx', (d) => this.x(d['commute_length']))
            .attr('cy', (d) => this.y(d['average_modulemark']))
            .attr('r', 2.5);
    }

    updateScatterplot() {
        this.scaleX();
        this.scaleY();

        this.formatXAxis();
        this.formatYAxis();

        this.svg.append('g').attr('class', `container--${this.course.replace(/\s|\&|\:|\(Sandwich\)/g, '')}-commute`);
        this.addDots(this.data);
    }

    addEventListeners() {
        document.querySelector('#select-degreeType-commute').addEventListener('change', (i) => {
            this.data = this.dataFormatter.updateCourseDropdown(i);
            d3.select(`.dv-horizontal-container-form--chart .container--${this.course.replace(/\s|\&|\:|\(Sandwich\)/g, '')}-commute`).remove();
            this.course = this.dataFormatter.course;
            this.updateScatterplot();
        });

        document.querySelector('#select-course-commute').addEventListener('change', (i) => {
            this.data = this.dataFormatter.updateChartData(i);
            d3.select(`.dv-horizontal-container-form--chart .container--${this.course.replace(/\s|\&|\:|\(Sandwich\)/g, '')}-commute`).remove();
            this.course = this.dataFormatter.course;
            this.updateScatterplot();
        });
    }

    resize() {
        const chart = d3.select(document.querySelector('.dv-horizontal-container-form--chart svg'));
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

        chart.select('.x-axis-commute-label').attr('transform', `translate(${((this.width - this.margin.left - this.margin.right) / 2) - 50}, 220)`);

        // update dots
        chart.selectAll(`.dot-${this.data[0]['course_code']}`)
            .attr('cx', (d) => this.x(d['commute_length']))
            .attr('cy', (d) => this.y(d['average_modulemark']));
    }
}

export default CommuteAttendance;
