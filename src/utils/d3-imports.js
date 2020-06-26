import { scaleLinear, scaleOrdinal } from 'd3-scale';
import { axisLeft, axisBottom } from 'd3-axis';
import { line } from 'd3-shape';
import { select, selectAll } from 'd3-selection';
import { max, min, range } from 'd3-array';

export default Object.assign({}, {
    scaleLinear,
    scaleOrdinal,
    axisLeft,
    axisBottom,
    line,
    select,
    selectAll,
    max,
    min,
    range,
});