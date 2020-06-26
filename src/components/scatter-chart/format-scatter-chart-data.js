import ScatterCharts from './scatter-chart';

class FormatChartData {
    constructor() {
        this.rawData = {};
        this.dataFormatted = {};
        this.campusName = '';
    }

    createDropdownList(d) { 
        this.rawData = d;
        // for (var prop in d) {
        //     if (d.hasOwnProperty(prop)) {
        //         if ((d[prop]['average_modulemark'] > 70) ||
        //             d[prop]['perc_attendance'] > 70) {
        //             delete d[prop];
        //         }
        //     }
        // };

        // create dropdownlist
        this.dropdownList = document.createElement('select');
        this.dropdownList.id = 'campus-select';
        document.querySelector('.form-campus').appendChild(this.dropdownList);

        document.querySelector('.dropdownList-label').innerHTML = "Select campus";

        this.groupedByCampus = this.groupBy(d, 'campus_name');

        Object.keys(this.groupedByCampus).forEach((i) => {
            const option = document.createElement("option");
            option.text = i;
            option.value = i;
            this.dropdownList.appendChild(option);
        });

        this.campusName = this.dropdownList.options[this.dropdownList.selectedIndex].value;
        return this.getDataByCourse(this.groupedByCampus[this.campusName], this.campusName);
    }

    updateChartData(i) {
        document.querySelector(".dot-scatter").classList.remove(`dot-${this.campusName.replace(' ', '')}`);
        this.campusName = i.target.value
        document.querySelector("#campusName").innerHTML = this.campusName;
        document.querySelector("#campusName").className = "";
        document.querySelector("#campusName").classList.add(`title-${this.campusName.replace(' ', '')}`);
        document.querySelector(".dot-scatter").classList.add(`dot-${this.campusName.replace(' ', '')}`);
        const courseData = this.getDataByCourse(this.groupedByCampus[this.campusName], this.campusName);
        return courseData;
    }

    getDataByCourse(data) {
        const d = data.sort((a, b) => (a['course_title'].substr(a['course_title'].indexOf(' ') + 1) > b['course_title'].substr(b['course_title'].indexOf(' ') + 1)) 
        ? 1 
        : ((b['course_title'].substr(b['course_title'].indexOf(' ') + 1) 
        > a['course_title'].substr(a['course_title'].indexOf(' ') + 1)) ? -1 : 0));

        const groupedByCourse = this.groupBy(data, 'course_code')

        this.dataFormatted = groupedByCourse;
        return groupedByCourse;
    }

    groupBy(xs, key) {
        return xs.reduce((rv, x) => {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
        }, {});
    }

    getMaxCount(prop) {
        let maxofEachCourse = [];
        Object.keys(this.dataFormatted).forEach((i) => {
            maxofEachCourse.push(Math.max.apply(null, this.dataFormatted[i].map((obj) => obj[prop])));
        });
        return Math.max.apply(null, maxofEachCourse);
    }
}

export default FormatChartData;