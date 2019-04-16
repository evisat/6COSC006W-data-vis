import * as d3 from 'd3';

class PredictGrades {
    constructor(config) {
        this.data = JSON.parse(config.data);
        this.parentDIV = document.querySelector('.prediction-options-container');
        this.b0 = 0;
        this.b1 = 0;
        this.createDegreeTypeDropdown(this.data);
    }

    groupBy(xs, key) {
        return xs.reduce((rv, x) => {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
        }, {});
    }

    createRangeSlider(d) {
        const self = this;
        const predictedAverageTxt = document.querySelector('#predict-average-mark');

        document.querySelector('.perc-select-form').innerHTML = '';

        const rangeSlider = document.createElement('input');
        rangeSlider.type = 'range';
        rangeSlider.min = `${Math.min.apply(Math, d.map(function(o) { return o['perc_attendance']}))}`;
        rangeSlider.max = `${Math.max.apply(Math, d.map(function(o) { return o['perc_attendance']}))}`;
        rangeSlider.value = '50';
        rangeSlider.className = 'range-slider';
        rangeSlider.step = '0.01';
        rangeSlider.id = 'slider-range';
        document.querySelector('.perc-select-form').appendChild(rangeSlider);
        document.querySelector('#prediction-sliderPercAtten label').innerHTML = "Select attendance";
        const perctsliderTxt = document.querySelector('#perct-slider-value');

        rangeSlider.oninput = function() {
            d3.selectAll(".small-scatter-plot--svg .linesOfIntersection").remove();
            let predictedMarks = self.getPredictedMarks(this.value, d);
            predictedAverageTxt.innerHTML = "Average module mark: <span id='pred-color'>" + predictedMarks + "%</span>";
            perctsliderTxt.innerHTML = `${rangeSlider.value}%`;
        }
    }

    getPredictedMarks(percValue, d) {
        const x = d3.scaleLinear()
            .domain([-1 * 1.95, d3.max(d, d => d['perc_attendance'])])
            .range([0, 440])

        const y = d3.scaleLinear()
            .domain([0, d3.max(d, d => d['average_modulemark'])])
            .range([450, 0])
            .nice()

        const pValue = (this.b0 + (percValue * this.b1)).toFixed(2);

        const svg = d3.select(".small-scatter-plot--svg");

        svg
            .append("line")
            .attr("class", "linesOfIntersection")
            .attr("x1", x(parseFloat(percValue)))
            .attr("x2", x(parseFloat(percValue)))
            .attr("y1", y(0))
            .attr("y2", y(pValue))
            .style("stroke-width", 2)
            .style("stroke", "#000")
            .attr("transform",
                "translate(" + 50 + ", " + 50 + ")")
            .style("stroke-dasharray", (3, 3));

        svg
            .append("line")
            .attr("class", "linesOfIntersection")
            .attr("x1", x(0))
            .attr("x2", x(parseFloat(percValue)) - 7)
            .attr("y1", y(pValue))
            .attr("y2", y(pValue))
            .style("stroke-width", 2)
            .style("stroke", "#000")
            .attr("transform",
                "translate(" + 50 + ", " + 50 + ")")
            .style("stroke-dasharray", (3, 3));

        return pValue;
    }

    createCourseDropdown(d) {
        document.querySelector('.course-select-form').innerHTML = '';

        const dropdownListCourse = document.createElement('select');
        dropdownListCourse.id = 'select-course';
        document.querySelector('.course-select-form').appendChild(dropdownListCourse);
        document.querySelector('#prediction-dropdownCourse label').innerHTML = "Select course";

        const data = d.sort((a, b) => (a['course_title'].substr(a['course_title'].indexOf(' ') + 1) > b['course_title'].substr(b['course_title'].indexOf(' ') + 1)) ? 1 : ((b['course_title'].substr(b['course_title'].indexOf(' ') + 1) > a['course_title'].substr(a['course_title'].indexOf(' ') + 1)) ? -1 : 0));

        const groupedByCourseName = this.groupBy(data, 'course_title');

        Object.keys(groupedByCourseName).forEach((i) => {
            const option = document.createElement("option");
            option.text = i;
            option.value = i;
            dropdownListCourse.appendChild(option);
        });

        let courseName = dropdownListCourse.options[dropdownListCourse.selectedIndex].value;
        this.generateScatterplot(groupedByCourseName[courseName], courseName);
        this.createRangeSlider(groupedByCourseName[courseName]);

        const rangeSlider = document.querySelector('#slider-range');
        const predictedAverageTxt = document.querySelector('#predict-average-mark');
        const perctsliderTxt = document.querySelector('#perct-slider-value');

        // d3.select(".small-scatter-plot--svg .linesOfIntersection").remove();

        let predictedMarks = this.getPredictedMarks(rangeSlider.value, groupedByCourseName[courseName]);
        predictedAverageTxt.innerHTML = "Average module mark: <span id='pred-color'>" + predictedMarks + "%</span>";
        perctsliderTxt.innerHTML = `${rangeSlider.value}%`;

        dropdownListCourse.addEventListener('change', (i) => {
            courseName = i.target.value;
            d3.selectAll('.small-scatter-plot svg').remove();
            this.generateScatterplot(groupedByCourseName[courseName], courseName);
            this.createRangeSlider(groupedByCourseName[courseName]);
            predictedMarks = this.getPredictedMarks(rangeSlider.value, groupedByCourseName[courseName]);
            predictedAverageTxt.innerHTML = "Average module mark: <span id='pred-color'>" + predictedMarks + "%</span>";
            perctsliderTxt.innerHTML = `${rangeSlider.value}%`;
        });
    }

    createDegreeTypeDropdown(d) {
        const dropdownListDegreeType = document.createElement('select');
        dropdownListDegreeType.id = 'select-degreeType';
        document.querySelector('.degreeType-select-form').appendChild(dropdownListDegreeType);
        document.querySelector('#prediction-dropdownDegreeType label').innerHTML = "Select degree type";

        const groupedByDegreeType = this.groupBy(d, 'degree_type');

        Object.keys(groupedByDegreeType).forEach((i) => {
            const option = document.createElement("option");
            option.text = i;
            option.value = i;
            dropdownListDegreeType.appendChild(option);
        });

        let degreeType = dropdownListDegreeType.options[dropdownListDegreeType.selectedIndex].value;
        this.createCourseDropdown(groupedByDegreeType[degreeType]);

        dropdownListDegreeType.addEventListener('change', (i) => {
            degreeType = i.target.value;
            d3.selectAll('.small-scatter-plot svg').remove();
            this.createCourseDropdown(groupedByDegreeType[degreeType]);
        });
    }

    generateScatterplot(d, title) {
        const margin = {
            top: 50,
            right: 30,
            bottom: 40,
            left: 50
        };
        let width = 520 - margin.left - margin.right;
        let height = 540 - margin.top - margin.bottom;

        let svg = d3.select(".small-scatter-plot")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .attr("class", "small-scatter-plot--svg")
            .append("g")
            .attr("transform",
                "translate(" + margin.left + ", " + margin.top + ")")

        svg
            .append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("class", "scatterplot-back")
            .attr("height", height)
            .attr("width", width + 10)
            .style("fill", "#EBEBEB")

        // Add X axis
        const x = d3.scaleLinear()
            .domain([-1 * 1.95, d3.max(d, d => d['perc_attendance'])])
            .range([0, width])
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).tickSize(-height).ticks(7))
            .select(".domain").remove()

        // Add Y axis
        const y = d3.scaleLinear()
            .domain([0, d3.max(d, d => d['average_modulemark'])])
            .range([height, 0])
            .nice()
        svg.append("g")
            .call(d3.axisLeft(y).tickSize(-width).ticks(7))
            .select(".domain").remove()

        // Customization
        svg.selectAll(".tick line").attr("stroke", "white")

        // Add X axis label:
        svg.append("text")
            .attr("text-anchor", "end")
            .attr("x", width / 2 + margin.left + 70)
            .attr("y", height + margin.top - 20)
            .style("font-size", "14px")
            .text("Average module attendance (%)");

        // Y axis label:
        svg.append("text")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-90)")
            .attr("y", -margin.left + 20)
            .attr("x", -margin.top - height / 2 + 140)
            .style("font-size", "14px")
            .text("Average module mark (%)")

        svg.append("text")
            .attr("x", width / 2 + margin.right - 20)
            .attr("y", -20)
            .attr("class", "scatter-title")
            .attr("text-anchor", "middle")
            .style("font-size", "14px")
            .style("font-weight", "600")
            .text(title)
            .call(this.wrap, 260);

        // Add dots
        svg.append('g')
            .attr('class', 'small-plot-circles')
            .selectAll("dot")
            .data(d)
            .enter()
            .append("circle")
            .attr("cx", (d) => {
                return x(d['perc_attendance']);
            })
            .attr("cy", (d) => {
                return y(d['average_modulemark']);
            })
            .attr("r", 2)
            .style("fill", '#D1495B')

        let lineData = this.calcLinear(d);
        lineData.forEach((dta) => {
            dta.x = +dta.x;
            dta.y = +dta.y;
            dta.yhat = +dta.yhat;
        });

        let line = d3.line()
            .x(function(dta) {
                return x(dta.x);
            })
            .y(function(dta) {
                return y(dta.yhat);
            });

        svg.append("path")
            .datum(lineData)
            .attr("class", "line")
            .attr("d", line)
            .attr("stroke", "black")
            .attr("stroke-width", 1);
    }

    calcLinear(data) {
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

        this.b1 = term1 / term2;
        this.b0 = y_mean - (this.b1 * x_mean);

        // perform regression
        let yhat = [];
        // fit line using coeffs
        for (i = 0; i < x.length; i++) {
            yhat.push(this.b0 + (x[i] * this.b1));
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

    wrap(text, width) {
        text.each(function() {
            const text = d3.select(this);
            let words = text.text().split(/\s+/).reverse();
            let word;
            let line = [];
            let lineNumber = 0;
            const lineHeight = 1.1;
            const x = text.attr("x");
            const y = text.attr("y");
            const dy = 0;

            let tspan = text.text(null)
                .append("tspan")
                .attr("x", x)
                .attr("y", y)
                .attr("dy", dy + "em");

            while (word = words.pop()) {
                line.push(word);
                tspan.text(line.join(" "));
                if (tspan.node().getComputedTextLength() > width) {
                    line.pop();
                    tspan.text(line.join(" "));
                    line = [word];
                    tspan = text.append("tspan")
                        .attr("x", x)
                        .attr("y", y)
                        .attr("dy", ++lineNumber * lineHeight + dy + "em")
                        .text(word);
                }
            }
        });
    }
}

export default PredictGrades;
