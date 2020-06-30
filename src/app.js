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

const p = document.createElement('p');
p.setAttribute('class', 'dv-title-container--cta');
p.innerHTML = 'Scroll down';

const div = document.createElement('div');
div.setAttribute('class', 'dv-title-container--chevron');
div.innerHTML = `<svg id="e2b708d4-248a-470c-b40c-9a10cdf9259b" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 352.01 233.96"class="bounce">
<defs>
    <style>
        .ff0a2598-635e-41d3-8246-10960f0d86c3{fill:url(#b9f996f4-1a09-45ad-b2a1-8d86f66e1654);}
    </style>
    <linearGradient id="b9f996f4-1a09-45ad-b2a1-8d86f66e1654" x1="176.01" x2="176.01" y2="233.96" gradientUnits="userSpaceOnUse">
        <stop class="colors" offset="0%" stop-color="#fff" />
        <stop class="colors" offset="100%" stop-color="#fff" />
    </linearGradient>
</defs>
<path class="ff0a2598-635e-41d3-8246-10960f0d86c3" d="M176.48,126.61,0,62.56,176.48,0,352,62.56ZM51.67,86.32v34.19c22.3,6,101.46,33.88,124.84,41.56l124.83-41.56V86.32L177.06,132.91Zm0,37.87v34.19c22.3,6,101.46,33.89,124.84,41.56l124.83-41.56V124.19l-124.28,46.6Zm-.5,37.88.5,27.19c22.3,6,101,37,124.34,44.7l124.83-44.7V162.07L176.56,208.66Zm-9.54,10.31a9.4,9.4,0,0,0,0-17.07V83.64l-8.36-2.45v74.26h.09a9.4,9.4,0,0,0-5.19,8.39,9.12,9.12,0,0,0,5.1,8.54h0a37.37,37.37,0,0,0-4.79,14.37l-4.39,37H51.17L47,186.7A31.43,31.43,0,0,0,41.63,172.38Z" transform="translate(0 0)" />
</svg>`;

document.querySelector('.dv-title-container').appendChild(p);
document.querySelector('.dv-title-container').appendChild(div);


new fullpage('#fullpage', {
    autoScrolling: false,
    fitToSection: false,
});
