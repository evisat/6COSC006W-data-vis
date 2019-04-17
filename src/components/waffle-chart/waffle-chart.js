import * as d3 from 'd3';

class WaffleCharts {
    constructor(config) {
        this.data = JSON.parse(config.data);
        document.querySelector('.waffle-chart-container--title').innerHTML =
            "Average number of <span id='degreeValue'>BA</span> students per accommodation type";
        document.querySelector('#moreInfo').innerHTML =
            "*Term time postcode is not known or is located outside of the campus travel to work area (TTWA). Learn more about <a href='https://en.wikipedia.org/wiki/Travel_to_work_area' target='_blank'>TTWAs</a>"

        this.generateRadioButtons();
        this.generateData(this.data);
    }

    groupBy(xs, key) {
        return xs.reduce(function(rv, x) {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
        }, {});
    }

    generateRadioButtons() {
        const radioArray = ['BA', 'BEng', 'BMus', 'BSc', 'LLB'];

        const radios_container = document.querySelector('.radio-buttons-container');

        for (let i in radioArray) {
            const radioButton = document.createElement('div');
            radioButton.className = 'class-radio class-radio-inline';
            radios_container.appendChild(radioButton);

            const radioInput = document.createElement('input');
            radioInput.type = 'radio';
            radioInput.id = `radio-${radioArray[i]}`;
            radioInput.name = 'radio-class';
            radioInput.value = `${radioArray[i]}`;
            radioButton.appendChild(radioInput);

            const radioLabel = document.createElement('label');
            radioLabel.className = 'radio-label';
            radioLabel.setAttribute('for', `radio-${radioArray[i]}`);
            radioLabel.innerHTML = `${radioArray[i]}`;
            radioButton.appendChild(radioLabel);
        }

        document.querySelector('#radio-BA').checked = true;
    }

    getData(d) {
        const div = d3.select(".waffle-chart-container")
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0)

        const groupedByLevels = this.groupBy(d, 'study_level')

        let ordered = {};
        Object.keys(groupedByLevels).sort().forEach(function(key) {
            ordered[key] = groupedByLevels[key];
        });

        let levels;
        for (let level in ordered) {
            levels = ordered[level]
            this.bakeWaffles(this.waffleData(levels), level, div, this.getTotal(groupedByLevels));
        }

        this.generateLegend(this.waffleData(levels), this.getTotal(groupedByLevels))
    }

    waffleData(data) {
        let newArr = [];
        data.forEach(function(d, i) {
            let obj = {};
            obj.age = d['accomm_type'];
            newArr.push(obj);
        });

        const newobj = [{
                age: "UoW Halls",
                population: newArr.filter((obj) => obj.age === "UoW Halls").length
            },
            {
                age: "Commuter",
                population: newArr.filter((obj) => obj.age === "Commuter").length
            },
            {
                age: "Other inc. Private Halls",
                population: newArr.filter((obj) => obj.age === "Other inc. Private Halls").length
            },
            {
                age: "Unknown",
                population: newArr.filter((obj) => obj.age === "Unknown").length
            }
        ]

        return newobj
    }


    bakeWaffles(data, title, div, ttl) {
        const squareSize = window.innerWidth > 1800 ? 30 : window.innerWidth > 1400 ? 24 : 20;
        let total = 0;
        let width,
            height,
            widthSquares = 14,
            heightSquares = 7,
            squareValue = 0,
            gap = 1,
            theData = [];

        const myColors = d3.scaleOrdinal()
            .domain(["UoW Halls", "Commuter", "Other inc. Private Halls", "Unknown"])
            .range(["#EDAE49", "#D1495B", "#00798C", "#21323a"]);

        const ttColors = d3.scaleOrdinal()
            .domain(["UoW Halls", "Commuter", "Other inc. Private Halls", "Unknown"])
            .range(["#ba8839", "#91323f", "#014d59", "#121c21"]);
        //total
        total = d3.sum(data, function(d) {
            return d.population;
        });

        //value of a square
        squareValue = total / (widthSquares * heightSquares);
        //remap data
        data.forEach(function(d, i) {
            d.population = +d.population;
            d.units = Math.floor(d.population / squareValue);
            theData = theData.concat(
                Array(d.units + 1).join(1).split('').map(function() {
                    return {
                        squareValue: squareValue,
                        units: d.units,
                        population: d.population,
                        groupIndex: i
                    };
                })
            );
        });


        width = (squareSize * widthSquares) + widthSquares * gap + 25;
        height = (squareSize * heightSquares) + heightSquares * gap + 25;

        const svg = d3.select("#waffle-charts")
            .append("svg")
            .attr('class', 'waffle')
            .attr("width", width)
            .attr("height", height)

        svg.append("text")
            .attr("x", (width / 2.4))
            .attr("y", 30)
            .attr("dy", -10)
            .attr("class", "pie-title")
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("font-weight", "500")
            .text(title);

        svg.append("g")
            .attr('transform', "translate(0, 10)")
            .selectAll("div")
            .data(theData)
            .enter()
            .append("rect")
            .attr("width", squareSize)
            .attr("height", squareSize)
            .attr("class", d => 'class' + d.groupIndex + '' + title.replace(' ', ''))
            .attr("fill", d => myColors(data[d.groupIndex].age))
            .attr("x", function(d, i) {
                //group n squares for column
                let col = Math.floor(i / heightSquares);
                return (col * squareSize) + (col * gap);
            })
            .attr("y", function(d, i) {
                let row = i % heightSquares;
                return (heightSquares * squareSize) - ((row * squareSize) + (row * gap))
            })
            .on("mouseover", function(d) {
                const classNameOfNodes = 'class' + d.groupIndex + '' + title.replace(' ', '')
                div.transition()
                    .duration(100)
                    .style("opacity", 1)

                var element = d3.selectAll('.' + classNameOfNodes)['_groups'][0]


                element.forEach(function(target, i) {
                    element[i].setAttribute("fill", ttColors(data[d.groupIndex].age))

                    div.html("<span style = 'font-weight: bold'>" + (d["population"] / ttl[title] * 100).toFixed(2) + "%</span>")
                    div.style("visibility", "visible")
                        .style("left", (d3.event.pageX - 20) + "px")
                        .style("top", (d3.event.pageY - 35) + "px")
                });

            })
            .on("mousemove", function(d) {
                div.style("left", (d3.event.pageX - 20) + "px")
                    .style("top", (d3.event.pageY - 65) + "px")
            })
            .on("mouseout", function(d) {
                div.transition()
                    .duration(500)
                div.style("visibility", "hidden")
                const classNameOfNodes = 'class' + d.groupIndex + '' + title.replace(' ', '')

                var element = d3.selectAll('.' + classNameOfNodes)['_groups'][0]
                element.forEach(function(target, i) {
                    element[i].setAttribute("fill", myColors(data[d.groupIndex].age))
                });
            })
    }

    generateLegend(d) {
        const myColors = d3.scaleOrdinal()
            .domain(["UoW Halls", "Commuter", "Other inc. Private Halls", "Unknown"])
            .range(["#EDAE49", "#D1495B", "#00798C", "#21323a"]);


        const legendDiv = d3.select("#legend");

        const legendRow = legendDiv.selectAll("foo")
            .data(myColors.domain())
            .enter()
            .append("div")
            .attr('class', 'waffle-chart-legend--items')

        legendRow.append("div")
            .html("&nbsp")
            .attr("class", "rect")
            .style("background-color", d => myColors(d));

        legendRow.append("div")
            .attr('class', 'waffle-chart-legend--text')
            .html(d => d);

    }

    getTotal(d) {
        const newobj = {
            "Level 4": d['Level 4'].length,
             "Level 5": d['Level 5'].length,
             "Level 6": d['Level 6'].length
        }
        return newobj;
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

        document.querySelector('.radio-label-text').innerHTML = "Select degree type";
        const radios = document.getElementsByName('radio-class')

        for (let i = 0, max = radios.length; i < max; i++) {
            radios[i].onclick = () => {
                selectedDegree = groupedByDegree[radios[i].value];
                document.getElementById("degreeValue").innerHTML = radios[i].value;
                d3.selectAll('#waffle-charts svg').remove();
                d3.selectAll('#legend div').remove();
                this.getData(selectedDegree);
            }
        }
    }
}

export default WaffleCharts
