import * as d3 from 'd3';

class HorizontalCharts {
    constructor(config) {
        this.data = JSON.parse(config.data);
        this.total = 100;
                this.container = document.querySelector('.bar-chart-section-container--chart');

        this.generateData(this.data);

        this.animateRows(this.container);
    }

    groupBy(xs, key) {
        return xs.reduce(function(rv, x) {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
        }, {});
    }

    generateData(d) {
        for (let prop in d) {
            if (d.hasOwnProperty(prop)) {
                if (d[prop]['average_modulemark'] < 40) {
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
            return b['value'] - a['value']
        }).slice(0, 10);

        this.createBarChart(sortedData);
    }

    createBarChart(d) {
        for (var x = 0; x < d.length; x++) {
            const i = d[x];
            const percentageofTotal = i.value;

            const sectionContainer = document.createElement('div');
            sectionContainer.className = 'bar-chart_container';

            const label = document.createElement('p');
            label.className = 'bar-chart_label';
            label.tabIndex = '0';
            label.innerHTML = i.course;
            sectionContainer.appendChild(label);

            const barContainer = document.createElement('div');
            barContainer.className = 'bar-chart_barContainer';
            sectionContainer.appendChild(barContainer);

            const bar = document.createElement('div');
            bar.className = 'bar-chart_bar';
            bar.style.width = (this.isNewsApp || this.isAmp) ? `${percentageofTotal}%` : '0%';
            bar.setAttribute('aria-hidden', 'true');
            bar.setAttribute('data-percentage', `${percentageofTotal}%`);
            barContainer.appendChild(bar);

            const value = document.createElement('span');
            value.className = 'bar-chart_value';
            value.tabIndex = '0';
            value.innerHTML = `${(i.value)}%`;
            barContainer.appendChild(value);

            this.container.appendChild(sectionContainer);
        }

    }

    animateRows(container) {
        // Results.barChartHasAnimated = true;
        const bars = container.querySelectorAll('.bar-chart_bar');
        for (let t = 0; t < bars.length; t++) {
            const bar = bars[t];
            const width = bar.getAttribute('data-percentage');
            bar.style.width = width; // eslint-disable-line
            bar.setAttribute('aria-valuenow', width);
            // setTimeout(() => {
            //
            // }, t * 80);
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
