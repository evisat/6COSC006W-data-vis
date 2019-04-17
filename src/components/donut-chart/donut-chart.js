import * as d3 from 'd3';

class DonutCharts {
    constructor(config) {
        this.data = JSON.parse(config.data);
        document.querySelector('.donut-charts-container--title').innerHTML =
            "Overall classifications of <span id='degreeValue'>BA</span> students per level of study";
        document.querySelector('#donutText-title').innerHTML = "Degree classification of students";
        document.querySelector('#donut-explain-text').innerHTML =
            "The charts below show the percentage of students that were awarded each overall degree classification on each of the different levels of undergraduate degree types. A degree type … what is it (footnote) Talk about the progression to final year and possible reason for it. BEng has higher first than LLB - There is a large proportion of students that get a 1st in STEM subjects compared to non STEM subjects.";

        this.generateRadioButtons();
        this.generateData(this.data);
    }

    groupBy(xs, key) {
        return xs.reduce(function(rv, x) {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
        }, {});
    }

    getData(d) {
        const groupedByLevels = this.groupBy(d, 'study_level')

        let ordered = {};
        Object.keys(groupedByLevels).sort().forEach(function(key) {
            ordered[key] = groupedByLevels[key];
        });

        let levels;
        for (let level in ordered) {
            levels = ordered[level]

            this.bakeDonut(this.pieChartData(levels), level);
        }
        this.createLegend(this.pieChartData(levels))
    }

    generateRadioButtons() {
        const radioArray = ['BA', 'BEng', 'BMus', 'BSc', 'LLB'];

        const radios_container = document.querySelector('.donut-radio-buttons-container');

        for (let i in radioArray) {
            const radioButton = document.createElement('div');
            radioButton.className = 'donut-class-radio donut-class-radio-inline';
            radios_container.appendChild(radioButton);

            const radioInput = document.createElement('input');
            radioInput.type = 'radio';
            radioInput.id = `donut-radio-${radioArray[i]}`;
            radioInput.name = 'donut-radio-class';
            radioInput.value = `${radioArray[i]}`;
            radioButton.appendChild(radioInput);

            const radioLabel = document.createElement('label');
            radioLabel.className = 'radio-label';
            radioLabel.setAttribute('for', `donut-radio-${radioArray[i]}`);
            radioLabel.innerHTML = `${radioArray[i]}`;
            radioButton.appendChild(radioLabel);
        }

        document.querySelector('#donut-radio-BA').checked = true;
    }

    getTotal(d) {
        let sum = 0
        for (let i in d) {
            sum += d[i].value
        }
        return sum
    }

    pieChartData(data) {
        return d3.nest()
            .key(function(d) {
                return d.degree_class;
            })
            .rollup(function(c) {

                return c.length
            })
            .entries(data);
    }

    bakeDonut(d, title) {
        let margin,
            width,
            height;
        const Total = this.getTotal(d);

        const myColors = d3.scaleOrdinal()
            .domain(["1st", "2:i", "2:ii", "3rd"])
            .range(["#EDAE49", "#D1495B", "#00798C", "#21323a"]);

        if (window.innerWidth >= 1800) {
            margin = {
                top: 30,
                right: 20,
                bottom: 30,
                left: 20
            };

            width = 480 - margin.left - margin.right;
            height = 450 - margin.top - margin.bottom;
        } else if (window.innerWidth > 1400 & window.innerWidth < 1800) {
            margin = {
                top: 30,
                right: 20,
                bottom: 30,
                left: 20
            };

            width = 430 - margin.left - margin.right;
            height = 400 - margin.top - margin.bottom;
        } else {
            margin = {
                top: 20,
                right: 10,
                bottom: 20,
                left: 10
            };

            width = 360 - margin.left - margin.right;
            height = 330 - margin.top - margin.bottom;
        }

        let activeSegment;
        const data = d,
            viewWidth = width,
            viewHeight = height,
            svgWidth = viewHeight,
            svgHeight = viewHeight,
            thickness = window.innerWidth >= 1800 ? 80 : (window.innerWidth > 1400 & window.innerWidth < 1800) ? 80 : 60,
            el = d3.select('#donut-charts'),
            radius = Math.min(svgWidth, svgHeight) / 2,
            color = myColors

        const max = d3.max(data, (maxData) => maxData.value);

        const svg = el.append('svg')
            .attr('viewBox', `0 0 350 ${viewHeight + thickness}`)
            .attr('class', 'pie')
            .attr('width', viewWidth)
            .attr('height', svgHeight);

        svg.append("text")
            .attr("x", (viewWidth / 2))
            .attr("y", 30)
            .attr("dy", -10)
            .attr("class", "pie-title")
            .attr("text-anchor", "middle")
            .style("font-size", "20px")
            .style("font-weight", "500")
            .text(title);

        const g = svg.append('g')
            .attr('transform', `translate( ${ (svgWidth / 2) + (thickness / 2) }, ${ (svgHeight / 2) + (thickness / 2) + 15})`);

        const arc = d3.arc()
            .innerRadius(radius - thickness)
            .outerRadius(radius);

        const arcHover = d3.arc()
            .innerRadius(radius - (thickness))
            .outerRadius(radius + 8);

        const pie = d3.pie()
            .value(function(pieChartData) {
                return pieChartData.value;
            })
            .sort(null);


        const path = g.selectAll('path')
            .data(pie(data))
            .enter()
            .append('g')
            .attr('class', 'data-group')
            .each(function(pathData, i) {
                const group = d3.select(this)

                group.append('text')
                    .text(`${(pathData.data.value / Total * 100).toFixed(2)}%`)
                    .attr('class', 'data-text data-text__value')
                    .attr('text-anchor', 'middle')
                    .attr('dy', '1rem')
                    .style("fill", (d, i) => color(d.data.key))

                // Set default active segment
                if (pathData.value === max) {
                    const textVal = d3.select(this).select('.data-text__value')
                        .classed('data-text--show', true);
                }

            })
            .append('path')
            .attr('d', arc)
            .attr('fill', (d, i) => color(d.data.key))
            .attr('class', (d => "data-path path" + d.data.key.replace(':', '')))
            .on('mouseover', function(d) {
                const classNameOfNodes = "path" + d.data.key.replace(':', '');

                var element = d3.selectAll('.' + classNameOfNodes)['_groups'][0]
                const _thisPath = this,
                    parentNode = _thisPath.parentNode;

                const dataTexts = d3.selectAll('.data-text')
                    .classed('data-text--show', false);

                element.forEach(function(target, i) {
                    const paths = d3.selectAll('.data-path')
                        .transition()
                        .duration(250)
                        .attr('d', arc);

                    d3.selectAll(element)
                        .transition()
                        .duration(250)
                        .attr('d', arcHover);

                    const thisDataValue = d3.select(element[i].parentNode.querySelectorAll('.data-text__value')[0])
                        .classed('data-text--show', true);
                });


            })
            .each(function(v, i) {
                if (v.value === max) {
                    const maxArc = d3.select(this)
                        .attr('d', arcHover);
                    activeSegment = this;
                }
                this._current = i;
            });
    }

    createLegend(d) {
        const myColors = d3.scaleOrdinal()
            .domain(["1st", "2:i", "2:ii", "3rd"])
            .range(["#EDAE49", "#D1495B", "#00798C", "#21323a"]);


        const legendDiv = d3.select("#donut-legend");

        const legendRow = legendDiv.selectAll("foo")
            .data(myColors.domain())
            .enter()
            .append("div")
            .attr('class', 'donut-chart-legend--items');

        legendRow.append("div")
            .html("&nbsp")
            .attr("class", "rect")
            .style("background-color", d => myColors(d));

        legendRow.append("div")
            .attr('class', 'donut-chart-legend--text')
            .html(d => d);

    }

    generateData(d) {

        for (let prop in d) {
            if (d.hasOwnProperty(prop)) {
                if (d[prop]['average_modulemark'] < 40) {
                    delete d[prop];
                }
            }
        };

        const groupedByDegree = this.groupBy(d, 'degree_type');
        let selectedDegree = groupedByDegree['BA'];


        this.getData(selectedDegree);

        document.querySelector('.donut-radio-label-text').innerHTML = "Select degree type";
        const radios = document.getElementsByName('donut-radio-class')

        for (let i = 0, max = radios.length; i < max; i++) {
            radios[i].onclick = () => {
                selectedDegree = groupedByDegree[radios[i].value];
                document.getElementById("degreeValue").innerHTML = radios[i].value;
                d3.selectAll('#donut-charts svg').remove();

                d3.selectAll('#donut-legend div').remove();
                this.getData(selectedDegree);
            }
        }
    }
}

export default DonutCharts
