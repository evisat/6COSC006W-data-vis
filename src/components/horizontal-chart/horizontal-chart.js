class HorizontalCharts {
    constructor(config) {
        this.data = JSON.parse(config.data);
        this.parentDIV = document.querySelector('.horiz-chart-container');

        this.chartData(this.data);
    }

    groupBy(xs, key) {
        return xs.reduce(function(rv, x) {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
        }, {});
    }

    chartData(d) {
        const chartData = [
            {
                title: "Top 10 courses by average module marks",
                id: "top-10-avg",
                filter: "average_modulemark",
                sort: "top",
                color: "#D1495B",
                symbol:"%"
            },
            {
                title: "Bottom 10 courses by average module marks",
                id: "bottom-10-avg",
                filter: "average_modulemark",
                sort: "bottom",
                color: "#D1495B",
                symbol:"%"
            },
            {
                title: "Top 10 courses by average module attendance",
                id: "top-10-att",
                filter: "perc_attendance",
                sort: "top",
                color: "#EDAE49",
                symbol:"%"
            },
            {
                title: "Bottom 10 courses by average module attendance",
                id: "bottom-10-att",
                filter: "perc_attendance",
                sort: "bottom",
                color: "#EDAE49",
                symbol:"%"
            },
            {
                title: "Top 10 courses by commute length",
                id: "top-10-comm",
                filter: "commute_length",
                sort: "top",
                color: "#00798C",
                symbol:"miles"
            },
            {
                title: "Bottom 10 courses by commute length",
                id: "bottom-10-comm",
                filter: "commute_length",
                sort: "bottom",
                color: "#00798C",
                symbol:"miles"
            }
        ];

        for (let chart in chartData) {
            this.generateData(this.data, chartData[chart]);
        };
    }

    generateData(d, chart) {
        for (let prop in d) {
            if (d.hasOwnProperty(prop)) {
                if (d[prop][chart.filter] < 40) {
                    delete d[prop];
                }
            }
        };

        const groupedByCourse = this.groupBy(d, 'course_title');

        let newArr = [];
        for (let data in groupedByCourse) {
            const avgScore = groupedByCourse[data].reduce((sum, {
                average_modulemark
            }) => sum + average_modulemark, 0) / groupedByCourse[data].length;

            newArr.push({
                course: data,
                value: avgScore.toFixed(2)
            });
        }

        const sortedData = newArr.sort(function(a, b) {
            return chart.sort == "top" ? b['value'] - a['value'] : a['value'] - b['value'];
        }).slice(0, 10);

        this.createBarChart(sortedData, chart);
    }

    createBarChart(d, chart) {
        const container = document.createElement('div');
        container.className = 'horizontal-chart-container--chart';
        container.id = chart.id;
        container.tabIndex = '0';
        this.parentDIV.appendChild(container);

        const title = document.createElement('h2');
        title.className = 'horizontal-chart-container--title';
        title.tabIndex = '0';
        title.innerHTML = `${(chart.title)}`;
        container.appendChild(title);

        for (var x = 0; x < d.length; x++) {
            const i = d[x];
            const percentageofTotal = i.value;

            const sectionContainer = document.createElement('div');
            sectionContainer.className = 'bar-chart_container';

            const label = document.createElement('p');
            label.className = 'bar-chart_label';
            label.tabIndex = '0';
            label.innerHTML = i.course.replace('FT', '')
            .replace('and', '&')
            .replace(/Communications|Communication/, 'Comm.')
            .replace('Management', 'Mngmt')
            .replace('Quantity', 'Qty')
            .replace('Commercial', 'Cml')
            .replace('& Architecture', '& Arch');
            sectionContainer.appendChild(label);

            const barContainer = document.createElement('div');
            barContainer.className = 'bar-chart_barContainer';
            sectionContainer.appendChild(barContainer);

            const value = document.createElement('span');
            value.className = 'bar-chart_value bar-tooltiptext';
            value.style.width = `${percentageofTotal}%`;
            value.tabIndex = '0';
            value.innerHTML = `${(i.value)}${chart.symbol}`;
            barContainer.appendChild(value);

            const bar = document.createElement('div');
            bar.className = 'bar-chart_bar';
            bar.style.width = `${percentageofTotal}%`;
            bar.style.backgroundColor = chart.color;
            bar.style.border = `1px solid ${chart.color}`
            bar.setAttribute('aria-hidden', 'true');
            bar.setAttribute('data-percentage', `${percentageofTotal}%`);
            barContainer.appendChild(bar);

            container.appendChild(sectionContainer);
        }

        this.animateRows(container);
    }

    animateRows(container) {
        // Results.barChartHasAnimated = true;
        const bars = container.querySelectorAll('.bar-chart_bar');
        for (let t = 0; t < bars.length; t++) {
            const bar = bars[t];
            const width = bar.getAttribute('data-percentage');
            bar.style.width = width;
            bar.setAttribute('aria-valuenow', width);
        }
    }

    //     animateRows(container) {
    //         Results.barChartHasAnimated = true;
    //         const bars = container.querySelectorAll('.bar-chart_bar');
    //         for (let t = 0; t < bars.length; t++) {
    //             const bar = bars[t];
    //             setTimeout(() => {
    //                 const width = bar.getAttribute('data-percentage');
    //                 bar.style.width = width; // eslint-disable-line
    //                 bar.setAttribute('aria-valuenow', width);
    //             }, t * 80);
    //         }
    //     }

}
export default HorizontalCharts
