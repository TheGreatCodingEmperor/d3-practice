import { style } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  table;
  constructor() { }

  ngOnInit(): void {
    this.table = d3.select('table');
    console.log(this.table);
    console.log(d3.select('td'))
    let resizeCell = this.resiezeCell;
    let cells = this.table.selectAll('td')
      .each(function (d, i) {
        console.log(d3.select(this))
        resizeCell(d3.select(this))
      })
  }

  resiezeCell(cell) {
    let contentContainer = cell.append('div')
      .style('width', '100%')
      .style('height', '100%')
      .style('position', 'relative');

    let leftBar = contentContainer.append('div')
      .style('width', '2px')
      .style('cursor', 'pointer')
      .style('height', '100%')
      .style('position', 'absolute')
      .style('left', 0);

    let rightBar = contentContainer.append('div')
      .style('width', '2px')
      .style('cursor', 'pointer')
      .style('height', '100%')
      .style('position', 'absolute')
      .style('right', 0);

    let topBar = contentContainer.append('div')
      .style('height', '2px')
      .style('cursor', 'pointer')
      .style('width', '100%')
      .style('position', 'absolute')
      .style('top', 0);

    let bottomBar = contentContainer.append('div')
      .style('height', '2px')
      .style('cursor', 'pointer')
      .style('width', '100%')
      .style('position', 'absolute')
      .style('bottom', 0);

  }

}
