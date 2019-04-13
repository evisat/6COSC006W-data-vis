import * as d3 from 'd3';

class RankCharts {
    constructor(config) {
        this.data = config.data;
        this.generateData(this.data);
    }

    groupBy(xs, key) {
        return xs.reduce(function(rv, x) {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
        }, {});
    }

    createRankChart(data) {
        console.log('data', data);
        const margin = {
            top: 50,
            right: 200,
            bottom: 100,
            left: 125
        };

        const width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        const svg = d3.select("#rank-charts").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        const cfg = {
            strokeWidth: 10
        };

        const colour = d3.scaleOrdinal(d3.schemeCategory10);

        // Use indexOf to fade in one by one
        const highlight = ["BA Film FT",
        "BA Television Production FT",
        "BA Fashion Design FT",
        "BA Public Relations and Advertising FT",
        "BA Fine Art Mixed Media FT",
        "BA Creative Writing and English Literature FT"];

        svg.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", width)
            .attr("height", height + cfg.strokeWidth);

        const x = d3.scaleLinear()
            .range([0, width]);

        const y = d3.scaleLinear()
            .range([0, height]);

        const voronoi = d3.voronoi()
            .x(d => x(d.year))
            .y(d => y(d.rank))
            .extent([
                [-margin.left / 2, -margin.top / 2],
                [width + margin.right / 2, height + margin.bottom / 2]
            ]);

        const line = d3.line()
            .x(d => x(d.year))
            .y(d => y(d.rank))
        // Uncomment this to use monotone curve
        //     	.curve(d3.curveMonotoneX);


        let parsedData = [];
        data.forEach((d) => {
            const dObj = {
                course: d.course,
                ranks: []
            };
            for (let year in d) {
                if (year != "course") {
                    if (d[year] != 0) {
                        dObj.ranks.push({
                            year: +year,
                            rank: d[year],
                            course: dObj
                        });
                    }
                }
            }
            parsedData.push(dObj);
        });


        const xTickNo = parsedData[0].ranks.length;
        x.domain(d3.extent(parsedData[0].ranks, d => d.year));

        colour.domain(data.map(d => d.course));

        // Ranks
        const ranks = 10;
        y.domain([0.5, ranks]);

        const axisMargin = 20;

        const xAxis = d3.axisBottom(x)
            .tickFormat(d3.format("d"))
            .ticks(xTickNo)
            .tickSize(0);

        const yAxis = d3.axisLeft(y)
            .ticks(ranks)
            .tickSize(0);

        const xGroup = svg.append("g");
        const xAxisElem = xGroup.append("g")
            .attr("transform", "translate(" + [0, height + axisMargin * 1.2] + ")")
            .attr("class", "x-axis")
            .call(xAxis);

        xGroup.append("g").selectAll("line")
            .data(x.ticks(xTickNo))
            .enter().append("line")
            .attr("class", "grid-line")
            .attr("y1", 0)
            .attr("y2", height + 10)
            .attr("x1", d => x(d))
            .attr("x2", d => x(d));

        const yGroup = svg.append("g");
        const yAxisElem = yGroup.append("g")
            .attr("transform", "translate(" + [-axisMargin, 0] + ")")
            .attr("class", "y-axis")
            .call(yAxis);
        yAxisElem.append("text")
            .attr("class", "y-label")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90) translate(" + [-height / 2, -margin.left / 3] + ")")
            .text("Courses ranking");

        yGroup.append("g").selectAll("line")
            .data(y.ticks(ranks))
            .enter().append("line")
            .attr("class", "grid-line")
            .attr("x1", 0)
            .attr("x2", width)
            .attr("y1", d => y(d))
            .attr("y2", d => y(d));

console.log('parsedData', parsedData);
        const lines = svg.append("g")
            .selectAll("path")
            .data(parsedData)
            .enter().append("path")
            .attr("class", "rank-line")
            .attr("d", function(d) { // the issue is here
                console.log('hey there', this)
                d.line = this;
                return line(d.ranks)
            })
            .attr("clip-path", "url(#clip)")
            .style("stroke", d => colour(d.course))
            .style("stroke-width", cfg.strokeWidth)
            .style("opacity", 0.1)
            .transition()
            .duration(500)
            .delay(d => (highlight.indexOf(d.course) + 1) * 500)
            .style("opacity", d => highlight.includes(d.course) ? 1 : 0.1);

        const endLabels = svg.append("g")
            .attr("class", "end-labels")
            .selectAll("text")
            .data(parsedData.filter(d => highlight.includes(d.course)))
            .enter().append("text")
            .attr("class", "end-label")
            .attr("x", d => x(d.ranks[d.ranks.length - 1].year))
            .attr("y", d => y(d.ranks[d.ranks.length - 1].rank))
            .attr("dx", 20)
            .attr("dy", cfg.strokeWidth / 2)
            .text(d => d.course)
            .style("opacity", 0)
            .transition()
            .duration(500)
            .delay(d => (highlight.indexOf(d.course) + 1) * 500)
            .style("opacity", 1);

        const endDots = svg.append("g")
            .selectAll("circle")
            .data(parsedData.filter(d => highlight.includes(d.course)))
            .enter().append("circle")
            .attr("class", "end-circle")
            .attr("cx", d => x(d.ranks[d.ranks.length - 1].year))
            .attr("cy", d => y(d.ranks[d.ranks.length - 1].rank))
            .attr("r", cfg.strokeWidth)
            .style("fill", d => colour(d.course))
            .style("opacity", 0)
            .transition()
            .duration(500)
            .delay(d => (highlight.indexOf(d.course) + 1) * 500)
            .style("opacity", 1);

        const tooltip = svg.append("g")
            .attr("transform", "translate(-100, -100)")
            .attr("class", "tooltip");
        tooltip.append("circle")
            .attr("r", cfg.strokeWidth);
        tooltip.append("text")
            .attr("class", "name")
            .attr("y", -20);

        const voronoiGroup = svg.append("g")
            .attr("class", "voronoi");

        voronoiGroup.selectAll("path")
            .data(voronoi.polygons(d3.merge(parsedData.map(d => d.ranks))))
            .enter().append("path")
            .attr("d", function(d) {
                return d ? "M" + d.join("L") + "Z" : null;
            })
            .on("mouseover", this.mouseover)
            .on("mouseout", this.mouseout);

        svg.selectAll(".rank-line")
            .each(d => highlight.includes(d.course) ? d.line.parentNode.appendChild(d.line) : 0);

        svg.select("g.end-labels").raise();
    }

    mouseover(d) {
        // Hide labels and dots from initial animation
        svg.selectAll(".end-label").style("opacity", 0);
        svg.selectAll(".end-circle").style("opacity", 0);

        svg.selectAll(".rank-line").style("opacity", 0.1);
        d3.select(d.data.course.line).style("opacity", 1);
        d.data.course.line.parentNode.appendChild(d.data.course.line);
        tooltip.attr("transform", "translate(" + x(d.data.year) + "," + y(d.data.rank) + ")")
            .style("fill", colour(d.data.course.course))
        tooltip.select("text").text(d.data.course.course)
            .attr("text-anchor", d.data.year == x.domain()[0] ? "start" : "middle")
            .attr("dx", d.data.year == x.domain()[0] ? -10 : 0)
    }

    mouseout(d) {
        svg.selectAll(".rank-line").style("opacity", d => highlight.includes(d.course) ? 1 : 0.1);

        svg.selectAll(".end-label").style("opacity", 1);
        svg.selectAll(".end-circle").style("opacity", 1);
        tooltip.attr("transform", "translate(-100,-100)");
    }

    getAverage(data, level) {
        const l = data.filter((d) => {
            return d['study_level'] == level;
        });


        const avgScore = l.reduce((sum, course) => {
            return sum + course['average_modulemark'];
        }, 0) / l.length;

        return avgScore.toFixed(2)
    }

    generateData(d) {

        for (let prop in d) {
            if (d.hasOwnProperty(prop)) {
                if (d[prop]['average_modulemark'] < 40) {
                    delete d[prop];
                }
            }
        };

        const groupedByCourse = this.groupBy(d, 'course_title')

        let newArr = [];
        for (let course in groupedByCourse) {
            let obj = {};
            obj.course = course;
            obj.level4 = this.getAverage(groupedByCourse[course], "Level 4");
            obj.level5 = this.getAverage(groupedByCourse[course], "Level 5");
            obj.level6 = this.getAverage(groupedByCourse[course], "Level 6");
            newArr.push(obj);
        }

        this.createRankChart(newArr);
    }
}
// obj.level4 = this.getAverage(groupedByCourse[course], "Level 4");
// obj.level5 = this.getAverage(groupedByCourse[course], "Level 5");
// obj.level6 = this.getAverage(groupedByCourse[course], "Level 6");

export default RankCharts
