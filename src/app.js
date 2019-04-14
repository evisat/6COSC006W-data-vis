import css from './app.scss';
import WaffleCharts from './components/waffle-chart/waffle-chart';
import HorizontalCharts from './components/horizontal-chart/horizontal-chart';
import DonutCharts from './components/donut-chart/donut-chart';
import data from './assets/data/uowdata_clean';

// (new Test({
//     data: data
// })).run()

new WaffleCharts({
    data: JSON.stringify(data)
})

new HorizontalCharts({
    data: JSON.stringify(data)
})

new DonutCharts({
    data: JSON.stringify(data)
})
