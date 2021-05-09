import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-draw-line',
  templateUrl: './draw-line.component.html',
  styleUrls: ['./draw-line.component.css'],
})
export class DrawLineComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    const svg = d3
      .select('svg')
      .attr('width', 400)
      .attr('height', 400)
      .style('background-color', 'black');

    svg
      .append('line')
      .style('stroke', 'lightgreen')
      .style('stroke-width', 10)
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', 200)
      .attr('y2', 200);

    var data = [
      { x: 10, y: 10 },
      { x: 50, y: 100 },
      { x: 60, y: 50 },
      { x: 100, y: 30 },
    ];

    var line = d3
      .line()
      .x(function (d) {
        return d.x;
      })
      .y(function (d) {
        return d.y;
      });

    svg.append('path').attr({
      d: line(data),
      y: 0,
      stroke: '#000',
      'stroke-width': '5px',
      fill: 'none',
    });

    var linkGen = d3.linkHorizontal();
    var singleLinkData = { source: [25, 25], target: [75, 75] };
    var multiLinkData = [
      {source: [50,50], target: [175,25]},
      {source: [50,50], target: [175,50]},
      {source: [50,50], target: [175,75]},
  ];

    // 在 svg 中插入一個 path
    svg
    .selectAll("path")
    .data(multiLinkData)
    .join("path")
    .attr("d", linkGen)
    .attr("fill", "none")
    .attr("stroke", "white");

    // 在 svg 中插入一個 path
    svg
      .append('path')
      .attr('d', line(data))
      .attr('y', 0)
      .style('fill', 'none')
      .style('stroke', 'yellow')
      .style('stroke-width', '5px');

    // 在 svg 中插入一個 path
    svg
      .append('path')
      .attr('d', 'M50 150H200C150 0 450 0 400 150H550')
      .style('fill', 'none')
      .style('stroke', 'purple')
      .style('stroke-width', 2);
  }
}
