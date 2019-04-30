import css from './app.scss';
import './components/section-two/section-two';
import ScatterCharts from './components/scatter-chart/scatter-chart';
import PredictGrades from './components/predict-grades/predict-grades';
import WaffleCharts from './components/waffle-chart/waffle-chart';
import HorizontalCharts from './components/horizontal-chart/horizontal-chart';
import './components/section-eight/section-eight';
import './components/section-nine/section-nine';
import DonutCharts from './components/donut-chart/donut-chart';
import data from './assets/data/uowdata_clean';
import fullpage from 'fullpage';

if (window.innerWidth < 1280) {
    document.querySelector('#mobile-compatible').style.display = 'block';
    document.querySelector('.main-content--container').style.display = 'none';
} else {
    document.querySelector('.main-content--container').style.display = 'block';
    document.querySelector('#mobile-compatible').style.display = 'none';

    document.querySelector('.title-container--title').innerHTML = "A Visual Analysis of Student Commute Length, Attendance and Performance at University";

    new ScatterCharts({
        data: JSON.stringify(data)
    })

    new PredictGrades({
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
        fitToSection: false,
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

    const scatterSection = document.querySelector('#scatterplot-container').offsetTop;
    const horizChartSection = document.querySelector('#horizchart-container').offsetTop;
    const donutChartSection = document.querySelector('#donut--container').offsetTop;

    let navWrap;
    let nav;
    let startPosition;
    let stopPosition;

    let str = '';

    function scrollDiv(scroll_pos) {
        const y = scroll_pos

        str = (y > scatterSection && y < horizChartSection) ? '' : (y > horizChartSection) ? 'Horiz' : '';

        str = (y > donutChartSection) ? 'Horiz' : '';

        navWrap = document.querySelector(`#navWrap${str}`);
        nav = document.querySelector(`#navwrapitem${str}`);

        startPosition = navWrap.offsetTop;
        stopPosition = document.querySelector(`#stopHere${str}`).offsetTop - nav.offsetHeight;

        if (y > startPosition + 10) {
            nav.setAttribute('class', 'sticky');
            nav.style.visibility = 'visible';
            if (y > stopPosition) {
                nav.style.top = `${stopPosition - y}px`;
            } else {
                nav.style.top = "10px";
            }
        } else {
            nav.setAttribute('class', '');
            nav.style.visibility = 'hidden';
        }
    }
}
