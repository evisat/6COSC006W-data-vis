import css from './app.scss';
// polyfills
import 'core-js/es7/array';
import 'core-js/es6/array';
import 'core-js/es6/object';
import 'core-js/es6/set';
// components
import './components/section-two/section-two';
import ScatterCharts from './components/scatter-chart/scatter-chart';
import PredictGrades from './components/predict-grades/predict-grades';
import WaffleCharts from './components/waffle-chart/waffle-chart';
import HorizontalCharts from './components/horizontal-chart/horizontal-chart';
import './components/section-eight/section-eight';
import './components/section-nine/section-nine';
import DonutCharts from './components/donut-chart/donut-chart';
import data from './assets/data/uowdata_clean.json';
import fullpage from 'fullpage';

document.querySelector('.title-container--title').innerHTML = "A Visual Analysis of Student Commute Length, Attendance and Performance at University";

new ScatterCharts(data);

new PredictGrades(data);

new DonutCharts(data);

new HorizontalCharts(data);

new WaffleCharts(data);

new fullpage('#fullpage', {
    navigation: false,
});
