import * as d3 from 'd3';
import 'waypoints';

class Test {
    constructor(config) {
        this.data = config.data;
    }

    run() {
        console.log('My Data', this.data);

        //svg
            let svg = d3.select("svg");


            //svg width and height
            svg.attr('width',500)
                .attr('height',500)


            //set up grid spacing
            let spacing = 40;
            let rows = 10;
            let column = 10;
            let randnum = (min,max) => Math.round( Math.random() * (max-min) + min );



            //Create an array of objects
            let our_data = d3.range(20).map(i =>
            ({ 'device': i < 5 ? 'ios' : 'android',
                'city': i < 3 ? 'San Diegan' : 'Out of towners',
                'age': randnum(25, 65)
            }));


            //create group and join our data to that group
            let group = svg.selectAll('g')
              .data(our_data)
              .enter()
              .append("g")


            //create rectangles
            let rects = group.append("rect")

        //city data
        d3.selectAll('g')
          .append("text")
          .text( (d) => d["city"])
          .attr("fill", "gray")
          .attr("class", "city")
          .attr("dx", -500)

      //age data
      d3.selectAll('g')
        .append("text")
        .text( (d) => d["age"] )
        .attr("fill", "#fff")
        .attr("class", "age")
        .attr("dx", -500)

        // square grid
        let grid = () =>{
          rects
            .transition()
            .delay((d, i) => 10 * i)
            .duration(600)
            .ease(d3.easeLinear)
            .attr("width", 20)
            .attr("height", 20)
            .attr("rx", 5)
            .attr("ry", 5)
            .attr("x", (d, i) => i % column * spacing)
            .attr("y", (d, i) => Math.floor(i / 10) % rows * spacing)
            .attr("fill", (d, i) => (i < 40 ? "#394147" : "#99c125"))
            .attr("opacity", "1")
        }

        //circle grid
        let grid2 = () =>{
          rects
            .transition()
            .delay((d, i) => 10 * i)
            .duration(600)
            .ease(d3.easeLinear)
            .attr("width", 20)
            .attr("height", 20)
            .attr("rx", "50%")
            .attr("ry", "50%")
            .attr("x", (d, i) => i % column * spacing)
            .attr("y", (d, i) => Math.floor(i / 10) % rows * spacing)
            .attr("fill", (d, i) => (i < 8 ? "none" : "#99c125"))
        }


        //divide
        let divide = () =>{
          rects
            .transition()
            .delay((d, i) => 10 * i)
            .duration(600)
            .ease(d3.easeLinear)
            .attr("width", 10)
            .attr("height", 10)
            .attr("rx", 0)
            .attr("ry", 0)
            .attr("x", (d, i) => d['device'] == "ios" ? randnum(100, 150) :  randnum(300, 350))
            .attr("y", (d, i) => i * 20)
            .attr("fill", (d, i) => d['device'] == "ios" ? "#394147": "#99c125")
            .attr("opacity", (d,i)=> i < 12 ? 1 : 0 )//only show 12 people



            //age
            d3.selectAll('text.age')
              .transition()
              .delay( (d,i) => 40*i )
              .duration(900)
              .ease(d3.easeElastic)
              .attr("dx", -500)


            //city
            d3.selectAll('text.city')
              .transition()
              .delay( (d,i) => 40*i )
              .duration(900)
              .ease(d3.easeElastic)
              .attr("dx", -500)
        }





        //bar cart
        let barChart = () => {
          rects
            .attr("rx", 0 )
            .attr("ry", 0 )
            .transition()
            .delay( (d,i) => 20*i )
            .duration(900)
            .ease(d3.easeElastic)//linear, quad, cubic, sin, exp, circle, elastic, back, bounce
            .attr("x", (d,i) => 150 )
            .attr("y", (d,i) => i * 17 )
            .attr("width", (d,i) => d["age"])
            .attr("height", (d,i) => 15)
            .attr("fill", (d, i) => (i < 3 ? "#99c125" : "#394147"))
            .attr("opacity", 1)
            .attr("transform", "translate(0,0) rotate(0)")
            .attr("opacity", (d,i)=> i < 12 ? 1 : 0 )//only show 12 people


          //age text
          d3.selectAll('text.age')
            .transition()
            .delay( (d,i) => 20*i )
            .duration(900)
            .ease(d3.easeElastic)
            //align text right
            .attr("text-anchor", "start")
            .attr("dx", 160)
            .attr("dy", (d,i)=> (i * 17) + 12)
            .attr("opacity", (d,i)=> i < 12 ? 1 : 0 )//nly show 12 people



          //city text
          d3.selectAll('text.city')
            .transition()
            .delay( (d,i) => 20*i )
            .duration(900)
            .ease(d3.easeElastic)
            //align text left
            .attr("text-anchor", "end")
            .attr("dx", 140)
            .attr("dy", (d,i)=> (i * 17) + 12)
            .attr("opacity", (d,i)=> i < 12 ? 1 : 0 )//only show 12 people


        }




        //waypoints scroll constructor
        function scroll(n, offset, func1, func2){
          return new Waypoint({
            element: document.getElementById(n),
            handler: function(direction) {
               direction == 'down' ? func1() : func2();
            },
            //start 75% from the top of the div
            offset: offset
          });
        };



        //triger these functions on page scroll
        new scroll('div3', '75%', grid2, grid);
        new scroll('div5', '75%', divide, grid);
        new scroll('div7', '75%', barChart, divide);



        //start grid on page load
        grid();

        console.log("okayyy");
    }













}

export default Test
