import * as d3 from 'd3';

class ScatterCharts {
    constructor(config) {
        this.data = JSON.parse(config.data);
        document.querySelector('#scatterplot-title').innerHTML = "Scatterplot showing the relationship between module attendance and marks for courses based in <span id='campusName'>Cavendish Campus</span>"
        document.querySelector('#scatterText-title').innerHTML = "Attendance and Performance"
        document.querySelector('#navwrapitem-text').innerHTML = "The scatterplots are showing a relationship between average module attendance and average module marks for each course in a given campus. The linear regression line shows a stronger positive correlation for courses held at Cavendish campus compared to those in the Harrow campus. Each circle on the chart represents one student."
        this.parentDIV = document.querySelector('.form-campus');

        this.generateData(this.data);
    }

    groupBy(xs, key) {
        return xs.reduce((rv, x) => {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
        }, {});
    }

    generateData(d) {
        for (var prop in d) {
            if (d.hasOwnProperty(prop)) {
                if ((d[prop]['average_modulemark'] > 70) ||
                    d[prop]['perc_attendance'] > 70) {
                    delete d[prop];
                }
            }
        };

        const dropdownList = document.createElement('select');
        dropdownList.id = 'campus-select';
        this.parentDIV.appendChild(dropdownList);

        document.querySelector('.dropdownList-label').innerHTML = "Select campus";

        const groupedByCampus = this.groupBy(d, 'campus_name');

        Object.keys(groupedByCampus).forEach((i) => {
            const option = document.createElement("option");
            option.text = i;
            option.value = i;
            dropdownList.appendChild(option);
        });

        let campusName = dropdownList.options[dropdownList.selectedIndex].value;

        dropdownList.addEventListener('change', (i) => {
            campusName = i.target.value
            document.getElementById("campusName").innerHTML = i.target.value;
            d3.selectAll('.scatter-plot svg').remove();
            this.getData(groupedByCampus[campusName], campusName);
        });

        this.getData(groupedByCampus[campusName], campusName);
    }

    getData(data, campusName) {
        const color = d3.scaleOrdinal()
            .domain(["Cavendish Campus", "Harrow Campus", "Marylebone Campus", "Regent Campus"])
            .range(["#EDAE49", "#D1495B", "#00798C", "#21323a"])

        const d = data.sort((a, b) => (a['course_title'].substr(a['course_title'].indexOf(' ') + 1) > b['course_title'].substr(b['course_title'].indexOf(' ') + 1)) ? 1 : ((b['course_title'].substr(b['course_title'].indexOf(' ') + 1) > a['course_title'].substr(a['course_title'].indexOf(' ') + 1)) ? -1 : 0));

        const groupedByCourse = this.groupBy(d, 'course_code')

        let courses;
        for (let course in groupedByCourse) {
            courses = groupedByCourse[course].sort();
            const title = groupedByCourse[course][0]['course_title'];
            this.generateScatterplot(courses, title, color(campusName));
        }
    }

    generateScatterplot(d, title, color) {
        const margin = {
            top: 50,
            right: 30,
            bottom: 40,
            left: 50
        };
        let width = 220 - margin.left - margin.right;
        let height = 240 - margin.top - margin.bottom;

        let svg = d3.select(".scatter-plot")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .attr("class", "scatter-plot--svg")
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
            .attr("x", width / 2 + margin.left + 20)
            .attr("y", height + margin.top - 20)
            .style("font-size", "10px")
            .text("Average module attendance (%)");

        // Y axis label:
        svg.append("text")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-90)")
            .attr("y", -margin.left + 20)
            .attr("x", -margin.top - height / 2 + 110)
            .style("font-size", "10px")
            .text("Average module mark (%)")

        svg.append("text")
            .attr("x", width / 2 + margin.right - 20)
            .attr("y", -20)
            .attr("class", "scatter-title")
            .attr("text-anchor", "middle")
            .style("font-size", "12px")
            .style("font-weight", "600")
            .text(title)
            .call(this.wrap, 160);

        // Add dots
        svg.append('g')
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
            .style("fill", color)

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

export default ScatterCharts;
