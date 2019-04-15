import css from './app.scss';
import ScatterCharts from './components/scatter-chart/scatter-chart';
import WaffleCharts from './components/waffle-chart/waffle-chart';
import HorizontalCharts from './components/horizontal-chart/horizontal-chart';
import DonutCharts from './components/donut-chart/donut-chart';
import data from './assets/data/uowdata_clean';
import fullpage from 'fullpage';

document.querySelector('.title-container--title').innerHTML = "A Visual Analysis of Student Commute Time, Attendance and Performance at University";

new ScatterCharts({
    data: JSON.stringify(data)
})

new DonutCharts({
    data: JSON.stringify(data)
})

new HorizontalCharts({
    data: JSON.stringify(data)
})

new WaffleCharts({
    data: JSON.stringify(data)
})

new fullpage('#fullpage', {
    licenseKey: '',
    autoScrolling: false,
});

let last_known_scroll_position = 0;
let ticking = false;

window.addEventListener('scroll', function(e) {
    last_known_scroll_position = window.scrollY;

    if (!ticking) {
        window.requestAnimationFrame(function() {
            scrollDiv(last_known_scroll_position);
            ticking = false;
        });

        ticking = true;
    }
});

function scrollDiv(scroll_pos) {
        const navWrap = document.querySelector('#navWrap');
        const nav = document.querySelector('#navwrapitem');

        const startPosition = navWrap.offsetTop;
        const stopPosition = document.querySelector('#stopHere').offsetTop - nav.offsetHeight;

        const y = scroll_pos

        if (y > startPosition + 20) {
            nav.setAttribute('class', 'sticky');
            nav.style.display = 'block';
            if (y > stopPosition) {
                nav.style.top = `${stopPosition - y}px`;
            } else {
                nav.style.top = "90px";
            }
        } else {
            nav.setAttribute('class', '');
            nav.style.display = 'none';
        }
}
