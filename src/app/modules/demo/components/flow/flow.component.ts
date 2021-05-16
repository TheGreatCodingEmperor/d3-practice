import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-flow',
  templateUrl: './flow.component.html',
  styleUrls: ['./flow.component.css']
})
export class FlowComponent implements OnInit {
  display = false;

  constructor() { }

  ngOnInit(): void {
    const svg = d3
      .select('svg')
      .attr('width', 400)
      .attr('height', 400)
      .style('background-color', 'black');
    const table1 = d3.select('#table1')
      .style('position', 'absolute')
      .style('width', '50px')
      .style('height', '50px')
      .style('left', '150px')
      .style('top', '150px')
      .style('background-color', 'grey')

    const table1EndPoint = table1.append('div')
      .style('position', 'absolute')
      .style('width', '5px')
      .style('height', '5px')
      .style('left', '-10px')
      .style('top', '50%')
      .style('background-color', 'grey')

    const table2 = d3.select('#table2')
      .style('position', 'absolute')
      .style('width', '50px')
      .style('height', '50px')
      .style('left', '50px')
      .style('top', '50px')
      .style('background-color', 'grey')

    const table2StartPoint = table2.append('div')
      .style('position', 'absolute')
      .style('width', '5px')
      .style('height', '5px')
      .style('right', '-10px')
      .style('top', '50%')
      .style('background-color', 'grey')
    console.log(table2StartPoint.node().offsetLeft)

    let pointCoordinate = (node : HTMLElement)=>{
      var nodeRect = node.getBoundingClientRect();
      let svgRect = svg.node().getBoundingClientRect();
      return {x:nodeRect.left-svgRect.left,y:nodeRect.top-svgRect.top}
    }


    let line = svg
      .append('line')
      .style('stroke', 'lightgreen')
      .style('stroke-width', 10)
      .attr('x1', pointCoordinate(table2StartPoint.node()).x)
      .attr('y1', pointCoordinate(table2StartPoint.node()).y)
      .attr('x2', pointCoordinate(table1EndPoint.node()).x)
      .attr('y2',  pointCoordinate(table1EndPoint.node()).y);

    
    
    line.on('click',e=>{
      this.display = true;
    });
  }

}
