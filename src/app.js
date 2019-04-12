import css from './app.scss'
import WaffleCharts from './components/waffle-chart/waffle-chart'
import data from './assets/data/uowdata_clean'

// (new Test({
//     data: data
// })).run()

new WaffleCharts({
    data: data
})
