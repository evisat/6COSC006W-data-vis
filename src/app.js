import css from './app.scss'
import Test from './components/test'
import data from './assets/data/uowdata_clean'

(new Test({
    data: data
})).run()
