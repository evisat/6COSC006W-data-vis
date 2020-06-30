class HorizontalCharts {
    constructor(data) {
        this.data = data;
        this.container = document.querySelector('.dv-horizontal-container--chart');
        document.querySelector('.dv-horizontal-container--title').innerHTML =
            "Commute length and attendance";
        document.querySelector('.dv-horizontal-container--description').innerHTML =
            "The charts below show average module attendance and commute length for the top five courses based on average module marks."
            // BA Film shows to have the highest average module marks, however, the average attendance is quite low. BA Fashion Design also shows a low average attendance even though average module marks are high. So the positive relationship we have seen in the previous chart between the two variables proves to be weak. These results could be related to the type of course, and whether attendance is really required. It is has a larger commute length compared to the other 4 course, while also having the smallest average attendance, showing a weak positive correlation between the two variables.
        this.createKeys();
        this.generateData(this.data);
    }

    groupBy(xs, key) {
        return xs.reduce(function (rv, x) {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
        }, {});
    }

    getAverageAttendance(d) {
        let newArr = [];
        d.forEach((i) => {
            const courseName = i.course;

            const avgScore = this.groupedByCourse[courseName].reduce((sum, {
                perc_attendance
            }) => sum + perc_attendance, 0) / this.groupedByCourse[courseName].length;

            newArr.push({
                course: courseName,
                value: avgScore.toFixed(2)
            });
        });

        return newArr;
    }

    getAverageCommute(d) {
        let newArr = [];
        d.forEach((i) => {
            const courseName = i.course;

            const avgScore = this.groupedByCourse[courseName].reduce((sum, {
                commute_length
            }) => sum + commute_length, 0) / this.groupedByCourse[courseName].length;

            newArr.push({
                course: courseName,
                value: avgScore.toFixed(2)
            });
        });

        return newArr;
    }

    generateData(d) {
        this.groupedByCourse = this.groupBy(d, 'course_title');

        let newArr = [];
        for (let course in this.groupedByCourse) {
            const avgScore = this.groupedByCourse[course].reduce((sum, {
                average_modulemark
            }) => sum + average_modulemark, 0) / this.groupedByCourse[course].length;

            newArr.push({
                course: course,
                value: avgScore.toFixed(2)
            });
        }

        const sortedData = newArr.sort((a, b) => b['value'] - a['value']).slice(0, 5);

        this.createBarChart(sortedData);
    }

    createBarChart(d) {
        const averageAttendance = this.getAverageAttendance(d);
        const averageCommute = this.getAverageCommute(d);

        for (var x = 0; x < d.length; x++) {
            const attendance = averageAttendance[x];
            const commute = averageCommute[x];
            const averageAttValue = attendance.value;
            const averageCommValue = commute.value;

            const sectionContainer = document.createElement('div');
            sectionContainer.className = 'bar-chart_container';

            const label = document.createElement('p');
            label.className = 'bar-chart_label';
            label.tabIndex = '0';
            label.innerHTML = attendance.course.replace('FT', '')
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

            const bar = document.createElement('div');
            bar.className = 'bar-chart_bar';
            bar.style.width = `${averageAttValue}%`;
            bar.style.backgroundColor = '#ec7357';
            bar.setAttribute('aria-hidden', 'true');
            bar.setAttribute('data-percentage', `${averageAttValue}%`);
            barContainer.appendChild(bar);

            const value = document.createElement('span');
            value.className = 'bar-chart_value bar-tooltiptext';
            value.style.width = `${averageAttValue}%`;
            value.tabIndex = '0';
            value.innerHTML = `${(attendance.value)}%`;
            barContainer.appendChild(value);

            const barContainerThree = document.createElement('div');
            barContainerThree.className = 'bar-chart_barContainer';
            sectionContainer.appendChild(barContainerThree);

            const barthree = document.createElement('div');
            barthree.className = 'bar-chart_bar';
            barthree.style.width = `${averageCommValue}% `;
            barthree.style.backgroundColor = '#a6c766';
            barthree.setAttribute('aria-hidden', 'true');
            barthree.setAttribute('data-percentage', `${averageCommValue}%`);
            barContainerThree.appendChild(barthree);

            const valuethree = document.createElement('span');
            valuethree.className = 'bar-chart_value bar-tooltiptext';
            valuethree.style.width = `${averageCommValue}%`;
            valuethree.tabIndex = '0';
            valuethree.innerHTML = `${(commute.value)}miles`;
            barContainerThree.appendChild(valuethree);

            this.container.appendChild(sectionContainer);
        }

        this.animateRows();
    }

    animateRows() {
        // Results.barChartHasAnimated = true;
        const bars = this.container.querySelectorAll('.bar-chart_bar');
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

    createKeys() {
        const keys = ['Attendance', 'Commute Length'];
        keys.forEach((key) => {
            const div = document.createElement('div');
            div.setAttribute('class', `dv-horizontal-container--keys-${key.replace(' ', '')} key-item`);
            div.innerHTML = key;
            document.querySelector('.dv-horizontal-container--keys').appendChild(div);
        });

    }
}
export default HorizontalCharts
