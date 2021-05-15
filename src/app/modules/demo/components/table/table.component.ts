import { style } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent implements OnInit {
  table;
  ngOnInit() {
    let table = d3.select('table');
    this.table = table;
    let resizeCell = this.resiezeCell;

    let trs = table.selectAll('tr');
    trs.nodes().forEach((row: HTMLTableRowElement) => {
      let cells = Array.from(row.cells);
      let colPivot = -1;
      let rowIndex = row.rowIndex;
      cells.forEach((cell: HTMLTableCellElement) => {
        colPivot += cell.colSpan;
        cell.id = `${row.rowIndex}_${colPivot}_${rowIndex + cell.rowSpan - 1}`;
      });
    });
    let cols = table.selectAll('col');
    let pivot = 0;
    cols.nodes().forEach((col) => {
      col.id = `col_${pivot}`;
      let colSpan = col.colSpan ? col.col.span : 1;
      pivot += colSpan;
    });
    // let cells = table.selectAll('td').nodes();

    table.selectAll('td').each(function (d, i) {
      resizeCell(d3.select(this), cols, trs);
    });
  }
  resiezeCell(cell, cols, trs) {
    let contentContainer = cell
      .append('div')
      .style('height', '100%')
      .style('position', 'relative');

    let rightBar = contentContainer
      .append('div')
      .style('width', '5px')
      .style('cursor', 'col-resize')
      .style('height', '100%')
      .style('position', 'absolute')
      .style('right', '-2.5px');

    // let rightBar = contentContainer.append('div')
    //   .style('width', '2px')
    //   .style('cursor', 'pointer')
    //   .style('height', '100%')
    //   .style('position', 'absolute')
    //   .style('right', 0);

    let bottomBar = contentContainer
      .append('div')
      .style('height', '5px')
      .style('cursor', 'row-resize')
      .style('width', '100%')
      .style('position', 'absolute')
      .style('bottom', '-2.5px');

    // let bottomBar = contentContainer.append('div')
    //   .style('height', '2px')
    //   .style('cursor', 'pointer')
    //   .style('width', '100%')
    //   .style('position', 'absolute')
    //   .style('bottom', 0);

    function heightResize(td, trs) {
      let startHeight, nxtStartHeight;
      let startY;
      let row: HTMLTableRowElement = trs
        .nodes()
        .find((r: HTMLTableRowElement) => {
          return r.rowIndex == parseInt(td.node().id.split('_')[2], 10);
        });
      let nxtRow: HTMLTableRowElement = trs
        .nodes()
        .find((r: HTMLTableRowElement) => {
          return r.rowIndex == row.rowIndex + 1;
        });
      return d3
        .drag()
        .on('start', (e) => {
          startY = e.y;
          startHeight = row.offsetHeight;
          row.style.backgroundColor = 'red';
          if (nxtRow) {
            nxtStartHeight = nxtRow.offsetHeight;
          }
        })
        .on('drag', (e) => {
          if (!row) return;
          let offsetY = e.y - startY;
          // if (startWidth + offsetX > 15 && nxtStartWidth - offsetX >15) {

          // td.attr('width', startWidth + offsetX);

          row.style.height = startHeight + offsetY + 'px';
          if (nxtRow) {
            nxtRow.style.height = nxtStartHeight - offsetY + 'px';
          }
          // }
        })
        .on('end', (e) => {
          row.style.backgroundColor = null;
        });
    }

    function widthResize(td, cols) {
      /** col 起始寬度 */
      let startWidth, nxtStartWidth;
      /** mouse 起始X */
      let startX;
      let colGroup: HTMLTableCellElement = cols.nodes().find((x) => {
        return td.node().id.split('_')[1] == x.id.split('_')[1];
      });
      let nextColGroup = cols.nodes().find((col) => {
        let pivotColId = parseInt(colGroup.id.split('_')[1]);
        let colId = parseInt(col.id.split('_')[1]);
        return pivotColId + 1 == colId;
      });
      return d3
        .drag()
        .on('start', (e) => {
          startX = e.x;
          startWidth = colGroup.style.width
            ? parseFloat(colGroup.style.width)
            : 0;
          colGroup.style.backgroundColor = 'red';
          console.log(startWidth);
          if (nextColGroup) {
            nxtStartWidth = nextColGroup.style.width
              ? parseFloat(nextColGroup.style.width)
              : 0;
          }
        })
        .on('drag', (e) => {
          if (!colGroup) return;
          let offsetX = e.x - startX;
          // if (startWidth + offsetX > 15 && nxtStartWidth - offsetX >15) {

          // td.attr('width', startWidth + offsetX);

          colGroup.style.width = startWidth + offsetX + 'px';
          if (nextColGroup) {
            nextColGroup.style.width = nxtStartWidth - offsetX + 'px';
          }
          // }
        })
        .on('end', (e) => {
          colGroup.style.backgroundColor = null;
        });
    }

    rightBar.call(widthResize(cell, cols));
    bottomBar.call(heightResize(cell, trs));
  }
}
