import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

class LineSchema {
  fromTableId: number | string;
  toTableId: number | string;
  fromCol: string;
  toCol: string;
}

class TableSchema {
  id: number | string;
  name: string;
  cols: { header: string; field: string }[];
  left: number;
  top: number;
}

@Component({
  selector: 'app-flow',
  templateUrl: './flow.component.html',
  styleUrls: ['./flow.component.css'],
})
export class FlowComponent implements OnInit {
  display = false;

  /** @summary 畫線 */
  drawLine = {
    start: null,
    end: null,
  };

  flow = {
    lines: [
      {
        fromTableId: 0,
        toTableId: 1,
        fromCol: 'col1',
        toCol: 'col2',
      },
    ],
    tables: [
      {
        id: 0,
        name: 'table1',
        cols: [
          {
            header: 'hello',
            field: 'col1',
          },
          {
            header: 'hello2',
            field: 'col2',
          },
        ],
        left: 0,
        top: 50,
      },
      {
        id: 1,
        name: 'table2',
        cols: [
          {
            header: 'hello',
            field: 'col1',
          },
          {
            header: 'hello2',
            field: 'col2',
          },
        ],
        left: 50,
        top: 150,
      },
    ],
  };

  tables: { id: number; table: any; schema: TableSchema }[] = [];
  lines: { line: any; schema: LineSchema; joinIcon: any }[] = [];

  constructor() {}

  ngOnInit(): void {
    let svg = d3
      .select('svg')
      .attr('width', 400)
      .attr('height', 400)
      .style('border', '1px solid black');
    this.initSchema();
  }

  /** @summary 根據 schema 匯入 ui element、更新 global tables/lines */
  initSchema() {
    this.clearAllLinesAndTables();
    const svg = d3.select('svg');
    const container = d3.select('#container');
    const g = svg.append('g').attr('cursor', 'grab');
    const zoom = d3
      .zoom()
      .on('zoom', (event) => {
        let transform = event.transform;
        g.selectAll('*').attr('transform', transform);
        container
          .selectAll('.ui-table')
          .style(
            'transform',
            'translate(' +
              transform.x +
              'px,' +
              transform.y +
              'px) scale(' +
              transform.k +
              ')'
          )
          .style('transform-origin', '0 0');
      })
      .scaleExtent([1, 1]);
    svg.call(zoom);
    console.log(svg);
    // .style('background-color', 'black');

    for (let tableSchema of this.flow.tables) {
      let tableD3Node = container
        .append('div')
        .attr('id', `${tableSchema.id}`)
        .style('position', 'absolute')
        .style('left', tableSchema.left + 'px')
        .style('top', tableSchema.top + 'px')
        .style('border', '1px solid black')
        .classed('ui-table', true);
      // .style('background-color', 'grey');

      let table = {
        id: tableSchema.id,
        table: tableD3Node,
        schema: tableSchema,
      };

      this.tables.push(table);

      for (let colSchema of tableSchema.cols) {
        let col = tableD3Node
          .append('div')
          .text(colSchema.header)
          .style('position', 'relative');

        let colStartPoint = col
          .append('div')
          .attr('id', `${colSchema.field}_start`)
          .style('position', 'absolute')
          .style('width', '5px')
          .style('height', '5px')
          .style('right', '-10px')
          .style('top', '50%')
          .style('background-color', 'grey')
          .classed('line-point', true);

        let colEndPoint = col
          .append('div')
          .attr('id', `${colSchema.field}_end`)
          .style('position', 'absolute')
          .style('width', '5px')
          .style('height', '5px')
          .style('left', '-10px')
          .style('top', '50%')
          .style('background-color', 'grey')
          .classed('line-point', true);
      }
    }

    let pointCoordinate = (node: HTMLElement) => {
      var nodeRect = node.getBoundingClientRect();
      let svgRect = svg.node().getBoundingClientRect();
      return {
        x: (nodeRect.left + nodeRect.right) / 2 - svgRect.left,
        y: (nodeRect.top + nodeRect.bottom) / 2 - svgRect.top,
      };
    };

    for (var lineSchema of this.flow.lines) {
      let fromTable = this.tables.find((x) => x.id == lineSchema.fromTableId);
      let toTable = this.tables.find((x) => x.id == lineSchema.toTableId);
      let startCol = fromTable.table.select(`#${lineSchema.fromCol}_start`);
      let endCol = toTable.table.select(`#${lineSchema.toCol}_end`);
      let startCoor = pointCoordinate(startCol.node());
      let endCoor = pointCoordinate(endCol.node());
      let line = g
        .attr('id', `${lineSchema.fromTableId}_${lineSchema.toTableId}`)
        .append('line')
        .style('stroke', 'lightgreen')
        .style('stroke-width', 10)
        .attr('x1', startCoor.x)
        .attr('y1', startCoor.y)
        .attr('x2', endCoor.x)
        .attr('y2', endCoor.y);

      let joinIcon = g
        .append('circle')
        .attr('id', `${lineSchema.fromTableId}_${lineSchema.toTableId}`)
        .attr('r', 10)
        .attr('stroke-width', 2)
        .attr('stroke', 'yellow')
        .attr('fill', 'red')
        .attr('cx', (parseInt(line.attr('x1')) + parseInt(line.attr('x2'))) / 2)
        .attr(
          'cy',
          (parseInt(line.attr('y1')) + parseInt(line.attr('y2'))) / 2
        );
      this.lines.push({ line: line, joinIcon: joinIcon, schema: lineSchema });

      joinIcon.on('click', (e) => {
        this.display = true;
      });
    }

    for (var table of this.tables) {
      table.table.call(this.dragTable(table));
    }
  }

  /** @summary 拖曳 UI table */
  dragTable(table: { id: number; table: any; schema: TableSchema }) {
    let startX, startY;
    let startLeft, startTop;
    let translateX, translateY;
    let schema = table.schema;
    let lines = d3.selectAll('line');
    let svg = d3.select('svg');
    let pointCoordinate = (node: HTMLElement) => {
      var nodeRect = node.getBoundingClientRect();
      let svgRect = svg.node().getBoundingClientRect();
      return {
        x: (nodeRect.left + nodeRect.right) / 2 - svgRect.left,
        y: (nodeRect.top + nodeRect.bottom) / 2 - svgRect.top,
      };
    };

    function getTranslateX(myElement) {
      var style = window.getComputedStyle(myElement);
      var matrix = new WebKitCSSMatrix(style.transform);
      console.log('translateX: ', matrix.m41);
      return matrix.m41;
    }

    function getComputedTranslateY(myElement) {
      if (!window.getComputedStyle) return;
      var style = getComputedStyle(myElement),
        transform = style.transform || style.webkitTransform;
      var mat = transform.match(/^matrix3d\((.+)\)$/);
      if (mat) return parseFloat(mat[1].split(', ')[13]);
      mat = transform.match(/^matrix\((.+)\)$/);
      console.log('translateY: ', mat ? parseFloat(mat[1].split(', ')[5]) : 0);
      return mat ? parseFloat(mat[1].split(', ')[5]) : 0;
    }

    return d3
      .drag()
      .on('start', (e) => {
        startX = e.x;
        startY = e.y;
        startLeft = schema.left;
        startTop = schema.top;
        translateX = getTranslateX(table.table.node());
        translateY = getComputedTranslateY(table.table.node());
      })
      .on('drag', (e) => {
        let offsetX = e.x - startX;
        let offsetY = e.y - startY;
        schema.left = startLeft + offsetX;
        schema.top = startTop + offsetY;
        table.table.style('left', schema.left + 'px');
        table.table.style('top', schema.top + 'px');

        this.lines.forEach((x) => {
          let mode = null;
          if (x.schema.fromTableId == table.id) {
            mode = 'start';
            let fromTable = table.table;
            let startPoint = fromTable.select(`#${x.schema.fromCol}_start`);
            let startCoor = pointCoordinate(startPoint.node());
            x.line
              .attr('x1', startCoor.x - translateX)
              .attr('y1', startCoor.y - translateY);

            x.joinIcon
              .attr(
                'cx',
                (parseInt(x.line.attr('x1')) + parseInt(x.line.attr('x2'))) / 2
              )
              .attr(
                'cy',
                (parseInt(x.line.attr('y1')) + parseInt(x.line.attr('y2'))) / 2
              );
          } else if (x.schema.toTableId == table.id) {
            mode = 'end';
            let toTable = table.table;
            let endCol = toTable.select(`#${x.schema.toCol}_end`);
            let endCoor = pointCoordinate(endCol.node());
            x.line
              .attr('x2', endCoor.x - translateX)
              .attr('y2', endCoor.y - translateY);

            x.joinIcon
              .attr(
                'cx',
                (parseInt(x.line.attr('x1')) + parseInt(x.line.attr('x2'))) / 2
              )
              .attr(
                'cy',
                (parseInt(x.line.attr('y1')) + parseInt(x.line.attr('y2'))) / 2
              )
              .classed('join-icon', true);
          } else {
            return;
          }
        });
      })
      .on('end', (e) => {});
  }

  /** @summary 匯入 外部 schema */
  importSchema(importSchema: HTMLTextAreaElement) {
    console.log(importSchema.value);
    try {
      this.flow = JSON.parse(importSchema.value);
      this.initSchema();
    } catch {}
  }

  /** @summary 清空UI 所有 element */
  clearAllLinesAndTables() {
    d3.select('svg').selectAll('*').remove();
    d3.select('#container').selectAll('div').remove();
    this.tables = [];
    this.lines = [];
  }

  /** @summary 匯出當前設計 schema */
  exportSchema() {
    console.log(JSON.stringify(this.flow, null, 2));
  }
}
