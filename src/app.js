import fullpage from 'fullpage';
import data from './assets/data/uowdata_clean.json';
import './app.scss';
// polyfills
import 'core-js/es7/array';
import 'core-js/es6/array';
import 'core-js/es6/object';
import 'core-js/es6/set';
// components
import './components/introduction/introduction';
import ScatterCharts from './components/scatter-chart/scatter-chart';
import PredictGrades from './components/predict-grades/predict-grades';
import HorizontalCharts from './components/horizontal-chart/horizontal-chart';
import './components/methodology/methodology';
import './components/conclusion/conclusion';
import './components/credits/credits';

document.querySelector('.dv-title-container--title').innerHTML = "A Visual Analysis of Student Commute Length, Attendance and Performance at University";

new ScatterCharts(data);
new PredictGrades(data);
new HorizontalCharts(data);

window.addEventListener('load', () => {
    new fullpage('#fullpage', {
        navigation: false,
        easing: 'easeInOutCubic',
        scrollingSpeed: 1250,
        animateAnchor: true,
        touchSensitivity: 5,
        normalScrollElementTouchThreshold: 5,
        easing: 'easeInOutCubic',
        easingcss3: 'ease',
    });
})
