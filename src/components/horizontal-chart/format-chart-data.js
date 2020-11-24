class FormatChartData {
  constructor() {
    this.rawData = {};
    this.dataFormatted = {};
    this.degree = "";
    this.course = "";
  }

  createDropdownLists(d) {
    this.rawData = d;

    const degreeData = this.createDegreeDropdown(d);
    return this.createCourseDropdown(degreeData);
  }

  createDegreeDropdown(d) {
    // create dropdownlist for degree type
    this.dropdownListDegreeType = document.createElement("select");
    this.dropdownListDegreeType.id = "select-degreeType-commute";
    document
      .querySelector(".degreeType-select-form-commute")
      .appendChild(this.dropdownListDegreeType);
    document.querySelector(".dropdown-degree-commute label").innerHTML =
      "Select degree";

    this.groupedByDegreeType = this.groupBy(d, "degree_type");

    Object.keys(this.groupedByDegreeType).forEach((i) => {
      const option = document.createElement("option");
      option.text = i;
      option.value = i;
      this.dropdownListDegreeType.appendChild(option);
    });

    this.degree = this.dropdownListDegreeType.options[
      this.dropdownListDegreeType.selectedIndex
    ].value;

    return this.groupedByDegreeType[this.degree];
  }

  getTop5data(i, course) {
    document.querySelector("#select-course-commute").innerHTML = "";
    this.degree = i.target.value;

    this.dataFormatted = this.groupedByDegreeType[this.degree];
    const data = this.dataFormatted.sort((a, b) =>
      a["course_title"].substr(a["course_title"].indexOf(" ") + 1) >
      b["course_title"].substr(b["course_title"].indexOf(" ") + 1)
        ? 1
        : b["course_title"].substr(b["course_title"].indexOf(" ") + 1) >
          a["course_title"].substr(a["course_title"].indexOf(" ") + 1)
        ? -1
        : 0
    );

    this.groupedByCourseName = this.groupBy(data, "course_title");

    Object.keys(this.groupedByCourseName).forEach((i) => {
      const option = document.createElement("option");
      option.text = i;
      option.value = i;
      this.dropdownListCourse.appendChild(option);
    });

    this.course = course;
    this.dataFormatted = this.groupedByCourseName[this.course];
    return this.groupedByCourseName[this.course];
  }

  createCourseDropdown(d) {
    // create dropdownlist for courses
    this.dropdownListCourse = document.createElement("select");
    this.dropdownListCourse.id = "select-course-commute";
    document
      .querySelector(".course-select-form-commute")
      .appendChild(this.dropdownListCourse);
    document.querySelector(".dropdown-course-commute label").innerHTML =
      "Select course";

    const data = d.sort((a, b) =>
      a["course_title"].substr(a["course_title"].indexOf(" ") + 1) >
      b["course_title"].substr(b["course_title"].indexOf(" ") + 1)
        ? 1
        : b["course_title"].substr(b["course_title"].indexOf(" ") + 1) >
          a["course_title"].substr(a["course_title"].indexOf(" ") + 1)
        ? -1
        : 0
    );

    this.groupedByCourseName = this.groupBy(data, "course_title");

    Object.keys(this.groupedByCourseName).forEach((i) => {
      const option = document.createElement("option");
      option.text = i;
      option.value = i;
      this.dropdownListCourse.appendChild(option);
    });

    this.course = this.dropdownListCourse.options[
      this.dropdownListCourse.selectedIndex
    ].value;
    this.dataFormatted = this.groupedByCourseName[this.course];
    return this.groupedByCourseName[this.course];
  }

  updateChartData(i) {
    this.course = i.target.value;
    const courseData = this.groupedByCourseName[this.course];
    this.dataFormatted = courseData;
    return courseData;
  }

  updateCourseDropdown(i) {
    document.querySelector("#select-course-commute").innerHTML = "";
    this.degree = i.target.value;

    this.dataFormatted = this.groupedByDegreeType[this.degree];
    const data = this.dataFormatted.sort((a, b) =>
      a["course_title"].substr(a["course_title"].indexOf(" ") + 1) >
      b["course_title"].substr(b["course_title"].indexOf(" ") + 1)
        ? 1
        : b["course_title"].substr(b["course_title"].indexOf(" ") + 1) >
          a["course_title"].substr(a["course_title"].indexOf(" ") + 1)
        ? -1
        : 0
    );

    this.groupedByCourseName = this.groupBy(data, "course_title");

    Object.keys(this.groupedByCourseName).forEach((i) => {
      const option = document.createElement("option");
      option.text = i;
      option.value = i;
      this.dropdownListCourse.appendChild(option);
    });

    this.course = this.dropdownListCourse.options[
      this.dropdownListCourse.selectedIndex
    ].value;
    this.dataFormatted = this.groupedByCourseName[this.course];
    return this.groupedByCourseName[this.course];
  }

  groupBy(xs, key) {
    return xs.reduce((rv, x) => {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  }

  getMaxCount(prop) {
    let maxofEachPerson = [];
    Object.keys(this.dataFormatted).forEach((i) => {
      maxofEachPerson.push(this.dataFormatted[i][prop]);
    });
    return Math.max.apply(null, maxofEachPerson);
  }

  getTop5Courses() {
    this.groupedByCourse = this.groupBy(this.rawData, "course_title");

    let newArr = [];
    for (let course in this.groupedByCourse) {
      const avgScore =
        this.groupedByCourse[course].reduce(
          (sum, { average_modulemark }) => sum + average_modulemark,
          0
        ) / this.groupedByCourse[course].length;

      newArr.push({
        course: course,
        degreeType: this.groupedByCourse[course][0]["degree_type"],
      });
    }

    const sortedData = newArr
      .sort((a, b) => b["value"] - a["value"])
      .slice(0, 5);

    return sortedData;
  }
}

export default FormatChartData;
