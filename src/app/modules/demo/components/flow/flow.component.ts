import { ThisReceiver } from '@angular/compiler';
import { nullSafeIsEquivalent } from '@angular/compiler/src/output/output_ast';
import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import * as d3 from 'd3';

enum JoinTypeEnum {
  innerJoin = 1,
  leftJoin = 2,
  rightJoin = 3,
  outterJoin = 4,
}

class LineSchema {
  fromTableId: number | string;
  toTableId: number | string;
  fromCol: string;
  toCol: string;
  joinType: JoinTypeEnum;
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
export class FlowComponent implements AfterViewInit {
  joinTypeDisplay = false;

  /** @summary 當前畫線 */
  drawLine = {
    fromTableId: null,
    toTableId: null,
    fromCol: null,
    toCol: null,
  };
  width: number | string = 700;
  height: number | string = 400;
  @Input() flow: { tables: TableSchema[]; lines: LineSchema[] } = {
    lines: [
      {
        fromTableId: '測試1',
        toTableId: '測試2',
        fromCol: 'col1',
        toCol: 'col2',
        joinType: JoinTypeEnum.innerJoin,
      },
    ],
    tables: [
      {
        id: '測試1',
        name: '測試1',
        cols: [
          {
            header: '第一欄',
            field: 'col1',
          },
          {
            header: '第二欄',
            field: 'col2',
          },
        ],
        left: 0,
        top: 50,
      },
      {
        id: '測試2',
        name: '測試2',
        cols: [
          {
            header:
              'fagaughuaihdghphape98gh9p8ehg998heg89hp98rhgvnrep89nf9p8jfphn98rghpwhgp98hg9p8hgp98hhp894hp98hp8h',
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

  templateTables: TableSchema[] = [
    {
      id: 123,
      name: 'test',
      cols: [{ field: 'fag', header: '223' }],
      left: 0,
      top: 0,
    },
    {
      id: 223,
      name: 'test1',
      cols: [{ field: 'argareg', header: '223' }],
      left: 0,
      top: 0,
    },
    {
      id: 323,
      name: 'test2',
      cols: [{ field: 'rgaa', header: '223' }],
      left: 0,
      top: 0,
    },
  ];

  lines: { line: any; schema: LineSchema; joinIcon: any }[] = [];
  tables: { id: number | string; table: any; schema: TableSchema }[] = [];
  /** @summary 當前選種 d3 element */
  selectedD3Element = { type: null, d3Element: null };
  /** @summary global svg */
  svg;
  /** @summary global g */
  g;
  /** @summary global container */
  container;

  tooltip;

  /** @summary 隱藏 rect(取得 translate) */
  rect;

  /** @summary 當前編輯 UI Line */
  currentLine;

  /** @summary Join 種類 */
  joinTypes = [
    { label: 'innerJoin', value: 'innerJoin' },
    { label: 'leftJoin', value: 'leftJoin' },
    { label: 'rightJoin', value: 'rightJoin' },
  ];

  constructor() {}

  ngAfterViewInit(): void {
    let svg = d3
      .select('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .style('border', '1px solid black')
      .on('click', (e) => {
        let lines = this.g.selectAll('line').style('stroke', 'lightgreen');
        let tables = this.container
          .selectAll('.ui-table')
          .classed('basic-table', true)
          .classed('selected-table', false);
        this.clearDrawLine();
        this.clearSelecteD3Element();
      });
    this.svg = svg;
    this.svg.call(this.zoom());
    this.container = d3.select('#container');
    this.tooltip = d3.select('#tooltip').style('opacity', 0);
    this.initSchema();

    /** @summary 設定 */
    let setTemplateDrag = (templateId: number | string) => {
      return d3.drag().on('end', (e) => {
        console.log('drop');
        let table = this.templateTables.find((x) => x.id == templateId);
        table = JSON.parse(JSON.stringify(table));
        let currentTransform = d3.zoomTransform(this.rect.node());
        table.left = e.x - currentTransform.x;
        table.top = e.y - currentTransform.y;
        this.onDrawTable(table);
      });
    };
    let templates = d3.selectAll('.templateTable').each(function (e) {
      let template = d3.select(this);
      template.call(setTemplateDrag(template.node().id));
    });
  }

  /** @summary 平移 */
  zoom() {
    return d3
      .zoom()
      .on('zoom', (event) => {
        let transform = event.transform;
        if (this.g) {
          this.g.selectAll('*').attr('transform', transform);
        }
        if (this.rect) {
          this.rect.attr('transform', transform);
        }
        this.container
          .select('#tooltip')
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
        this.container
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
  }

  /** @summary 根據 schema 匯入 ui element、更新 global tables/lines */
  initSchema() {
    this.clearAllLinesAndTables();
    this.g = this.svg.append('g');
    this.rect = this.g.append('rect');

    for (let tableSchema of this.flow.tables) {
      this.onDrawTable(tableSchema);
    }

    for (var lineSchema of this.flow.lines) {
      this.onDrawLine(lineSchema);
    }

    // for (var table of this.tables) {
    //   table.table.call(this.dragTable(table));
    // }
  }

  /** @summary 拖曳 UI table */
  dragTable(table: { id: number | string; table: any; schema: TableSchema }) {
    let startX, startY;
    let startLeft, startTop;
    let translateX, translateY;
    let schema = table.schema;
    let lines = d3.selectAll('line');
    let pointCoordinate = (node: HTMLElement) => {
      var nodeRect = node.getBoundingClientRect();
      let svgRect = this.svg.node().getBoundingClientRect();
      return {
        x: (nodeRect.left + nodeRect.right) / 2 - svgRect.left,
        y: (nodeRect.top + nodeRect.bottom) / 2 - svgRect.top,
      };
    };

    function getTranslateX(myElement) {
      var style = window.getComputedStyle(myElement);
      var matrix = new WebKitCSSMatrix(style.transform);
      return matrix.m41;
    }

    function getComputedTranslateY(myElement) {
      if (!window.getComputedStyle) return;
      var style = getComputedStyle(myElement),
        transform = style.transform || style.webkitTransform;
      var mat = transform.match(/^matrix3d\((.+)\)$/);
      if (mat) return parseFloat(mat[1].split(', ')[13]);
      mat = transform.match(/^matrix\((.+)\)$/);
      return mat ? parseFloat(mat[1].split(', ')[5]) : 0;
    }

    return d3
      .drag()
      .on('start', (e) => {
        startX = e.x;
        startY = e.y;
        startLeft = schema.left;
        startTop = schema.top;
        // translateX = getTranslateX(table.table.node());
        // translateY = getComputedTranslateY(table.table.node());
        translateX = d3.zoomTransform(this.rect.node()).x;
        translateY = d3.zoomTransform(this.rect.node()).y;
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

  //let drawLine = JSON.parse(JSON.stringify(this.drawLine));
  /** @summary 畫 UI 線
   * @todo 畫線(table start/end point)
   * @todo join Icon
   * @todo 註冊到 global lines
   * @todo 如果 flowSchema 不存在 line，新增到 schema、draw line 清空
   */
  onDrawLine(drawLine: LineSchema) {
    if (drawLine.fromTableId == drawLine.toTableId) {
      this.clearDrawLine();
      return;
    }
    this.lines
      .filter((line) => {
        let tables = [];
        tables.push(line.schema.fromTableId);
        tables.push(line.schema.toTableId);
        return (
          tables.includes(drawLine.fromTableId) &&
          tables.includes(drawLine.toTableId)
        );
      })
      .forEach((line) => {
        this.onDestroyLine(line.line);
      });

    let selectD3Item = (element) => {
      let lines = this.g.selectAll('line').style('stroke', 'lightgreen');
      element.style('stroke', 'green');
      let tables = this.container
        .selectAll('.ui-table')
        .classed('basic-table', true)
        .classed('selected-table', false);
      this.selectedD3Element = { d3Element: element, type: 'line' };
    };
    let pointCoordinate = (node: HTMLElement) => {
      var nodeRect = node.getBoundingClientRect();
      let svgRect = this.svg.node().getBoundingClientRect();
      return {
        x: (nodeRect.left + nodeRect.right) / 2 - svgRect.left,
        y: (nodeRect.top + nodeRect.bottom) / 2 - svgRect.top,
      };
    };

    let fromTable = this.tables.find((x) => x.id == drawLine.fromTableId);
    let toTable = this.tables.find((x) => x.id == drawLine.toTableId);
    let startCol = fromTable.table.select(`#${drawLine.fromCol}_start`);
    let endCol = toTable.table.select(`#${drawLine.toCol}_end`);
    let startCoor = pointCoordinate(startCol.node());
    let endCoor = pointCoordinate(endCol.node());

    let currentTransform = d3.zoomTransform(this.rect.node());
    let line = this.g
      .attr('id', `${drawLine.fromTableId}_${drawLine.toTableId}`)
      .append('line')
      .style('stroke', 'lightgreen')
      .style('stroke-width', 10)
      .style('cursor', 'pointer')
      .attr('x1', startCoor.x - currentTransform.x)
      .attr('y1', startCoor.y - currentTransform.y)
      .attr('x2', endCoor.x - currentTransform.x)
      .attr('y2', endCoor.y - currentTransform.y)
      .attr('transform', this.rect.attr('transform'))
      .on('click', function (d: MouseEvent, e) {
        d.stopPropagation();
        selectD3Item(d3.select(this));
      });

    let joinIcon = this.g
      .append('circle')
      .attr('id', `${drawLine.fromTableId}_${drawLine.toTableId}`)
      .attr('r', 10)
      .attr('stroke-width', 2)
      .attr('stroke', 'yellow')
      .attr('fill', 'red')
      .attr('cx', (parseInt(line.attr('x1')) + parseInt(line.attr('x2'))) / 2)
      .attr('cy', (parseInt(line.attr('y1')) + parseInt(line.attr('y2'))) / 2)
      .attr('transform', this.rect.attr('transform'));
    this.lines.push({ line: line, joinIcon: joinIcon, schema: drawLine });

    if (this.flow.lines.findIndex((x) => x == drawLine) < 0) {
      this.flow.lines.push(drawLine);
      this.clearDrawLine();
    }

    joinIcon.on('click', (e) => {
      this.joinTypeDisplay = true;
      this.currentLine = this.flow.lines.find((x) => x == drawLine);
    });
  }

  showSelect() {
    console.log(this.selectedD3Element);
  }

  /** @summary 刪除線
   * @todo 刪除 flow schema line
   * @todo 刪除 join icon
   * @todo 刪除 global lines
   * @todo 清空 selectedD3Element
   */
  onDestroyLine(line) {
    let existIndex = this.lines.findIndex((x) => x.line.node() == line.node());
    if (existIndex > -1) {
      line.remove();
      let flowIndex = this.flow.lines.findIndex(
        (x) => x == this.lines[existIndex].schema
      );
      if (flowIndex > -1) {
        this.flow.lines.splice(flowIndex, 1);
      }
      this.lines[existIndex].joinIcon.remove();
      this.lines.splice(existIndex, 1);
    }
    this.clearSelecteD3Element();
  }

  /** @summary 畫 UI table */
  onDrawTable(tableSchema: TableSchema) {
    let pointCoordinate = (node: HTMLElement) => {
      var nodeRect = node.getBoundingClientRect();
      let svgRect = this.svg.node().getBoundingClientRect();
      return {
        x: (nodeRect.left + nodeRect.right) / 2 - svgRect.left,
        y: (nodeRect.top + nodeRect.bottom) / 2 - svgRect.top,
      };
    };

    let selectD3Item = (element) => {
      let lines = this.g.selectAll('line').style('stroke', 'lightgreen');
      element.style('stroke', 'green');
      let tables = this.container
        .selectAll('.ui-table')
        .classed('basic-table', true)
        .classed('selected-table', false);
      element.classed('basic-table', false).classed('selected-table', true);
      this.selectedD3Element = { type: 'table', d3Element: element };
    };

    console.log(d3.zoomTransform(this.rect.node()));
    let currentTransform = d3.zoomTransform(this.rect.node());

    let tableD3Node = this.container
      .append('div')
      .attr('id', `${tableSchema.id}`)
      .style('position', 'absolute')
      .style('left', tableSchema.left + 'px')
      .style('top', tableSchema.top + 'px')
      .classed('basic-table', true)
      .classed('ui-table', true)
      .style(
        'transform',
        'translate(' +
          currentTransform.x +
          'px,' +
          currentTransform.y +
          'px) scale(' +
          currentTransform.k +
          ')'
      )
      .style('transform-origin', '0 0')
      .on('click', function (d) {
        selectD3Item(d3.select(this));
      });

    let tableLabel = tableD3Node
      .append('div')
      .text(tableSchema.name)
      .classed('table-name', true);
    // .style('background-color', 'grey');

    let table = {
      id: tableSchema.id,
      table: tableD3Node,
      schema: tableSchema,
    };

    this.tables.push(table);
    tableD3Node.call(this.dragTable(table));

    let pointTrigger = (point: {
      fromTableId?: string | number;
      toTableId?: string | number;
      fromCol?: string;
      toCol?: string;
    }) => {
      this.drawLine.fromTableId =
        point.fromTableId == null
          ? this.drawLine.fromTableId
          : point.fromTableId;
      this.drawLine.toTableId =
        point.toTableId == null ? this.drawLine.toTableId : point.toTableId;
      this.drawLine.fromCol =
        point.fromCol == null ? this.drawLine.fromCol : point.fromCol;
      this.drawLine.toCol =
        point.toCol == null ? this.drawLine.toCol : point.toCol;

      if (
        this.drawLine.fromTableId != null &&
        this.drawLine.toTableId != null &&
        this.drawLine.fromCol != null &&
        this.drawLine.toCol != null
      ) {
        this.onDrawLine(JSON.parse(JSON.stringify(this.drawLine)));
      }
    };

    for (let colSchema of tableSchema.cols) {
      let col = tableD3Node.append('div').style('position', 'relative');

      let coltext = col
        .append('div')
        .text(colSchema.header)
        .classed('column-text', true);

      let colStartPoint = col
        .append('div')
        .attr('id', `${colSchema.field}_start`)
        .style('position', 'absolute')
        .style('width', '10px')
        .style('height', '10px')
        .style('right', '-10px')
        .style('top', '50%')
        .style('background-color', 'grey')
        .classed('line-point', true)
        .on('click', function (e) {
          e.stopPropagation();
          pointTrigger({
            fromTableId: tableSchema.id,
            fromCol: colSchema.field,
          });
        });

      let colEndPoint = col
        .append('div')
        .attr('id', `${colSchema.field}_end`)
        .style('position', 'absolute')
        .style('width', '10px')
        .style('height', '10px')
        .style('left', '-10px')
        .style('top', '50%')
        .style('background-color', 'grey')
        .classed('line-point', true)
        .on('click', function (e) {
          e.stopPropagation();
          pointTrigger({ toTableId: tableSchema.id, toCol: colSchema.field });
        });
    }

    if (this.flow.tables.findIndex((x) => x == tableSchema) < 0) {
      this.flow.tables.push(tableSchema);
    }
  }

  /** @summary 刪除 UI table
   * @todo 刪除 table
   * @todo 刪除 table 已存在 line
   * @todo 刪除
   */
  onDestroyTable(table) {
    this.lines
      .filter((x) => {
        console.log(`table: ${x.schema.fromTableId},${x.schema.toTableId}`);
        console.log(table.attr('id'));
        return (
          `${x.schema.fromTableId}` == table.attr('id') ||
          `${x.schema.toTableId}` == table.attr('id')
        );
      })
      .forEach((line) => this.onDestroyLine(line.line));
    table.remove();
    let tableListIndex = this.tables.findIndex(
      (x) => x.table.node() == table.node()
    );
    let flowTableIndex = this.flow.tables.findIndex(
      (x) => x == this.tables[tableListIndex].schema
    );
    if (flowTableIndex > -1) {
      this.flow.tables.splice(flowTableIndex, 1);
    }
    this.tables.splice(tableListIndex, 1);
    this.clearSelecteD3Element();
  }

  onDestroy() {
    if (this.selectedD3Element.type) {
      switch (this.selectedD3Element.type) {
        case 'table': {
          this.onDestroyTable(this.selectedD3Element.d3Element);
          break;
        }
        case 'line': {
          this.onDestroyLine(this.selectedD3Element.d3Element);
          break;
        }
      }
    }
  }

  /** @summary 清空 以選取 d3 element */
  clearSelecteD3Element() {
    this.selectedD3Element = {
      type: null,
      d3Element: null,
    };
  }

  /** @summary 清空 draw line */
  clearDrawLine() {
    this.drawLine = {
      fromTableId: null,
      toTableId: null,
      fromCol: null,
      toCol: null,
    };
  }

  /** @summary 匯入 外部 schema */
  importSchema(importSchema: HTMLTextAreaElement) {
    try {
      this.flow = JSON.parse(importSchema.value);
      this.initSchema();
    } catch {}
  }

  /** @summary 清空UI 所有 element */
  clearAllLinesAndTables() {
    let svg = d3.select('svg');
    svg.selectAll('*').remove();
    d3.select('#container').selectAll('.ui-table').remove();
    this.svg.call(this.zoom().transform, d3.zoomIdentity);
    this.tables = [];
    this.lines = [];
  }

  /** @summary 匯出當前設計 schema */
  exportSchema() {
    console.log(JSON.stringify(this.flow, null, 2));
  }
}
