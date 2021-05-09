import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  droppedData: string;
  constructor() {}

  ngOnInit(): void {
    let rect = d3.select('#rect');

    rect.call(this.drag(rect));
    let resizeRightBottom = rect.append('div').classed('right-bottom', true);
    console.log(resizeRightBottom);
    resizeRightBottom.call(this.resize(rect));
  }

  drag(rect) {
    let dragstart = false;
    let startX,
      startY,
      startRect = { left: null, top: null, right: null, bottom: null };
    let container = d3.select('#container');

    return d3
      .drag()
      .on('start', function (event) {

        startX = event.x;
        startY = event.y;

        let contentRect = (rect.node() as HTMLElement).getBoundingClientRect();
        let parentRect = (rect.node() as HTMLElement).parentElement.getBoundingClientRect();
        startRect = {
          left: contentRect.left - parentRect.left,
          right: contentRect.right - parentRect.left,
          top: contentRect.top - parentRect.top,
          bottom: contentRect.bottom - parentRect.top,
        };
      })
      .on('drag', function (event) {
        let offsetX = event.x - startX;
        let offsetY = event.y - startY;
        let parent = (rect.node() as HTMLElement).parentElement;

        if (
          startRect.left + offsetX >= 0 &&
          startRect.right + offsetX <= parent.offsetWidth
        ) {
          rect.style('left', startRect.left + offsetX + 'px');
        }
        if (
          startRect.top + offsetY >= 0 &&
          startRect.bottom + offsetY <= parent.offsetHeight
        ) {
          rect.style('top', startRect.top + offsetY + 'px');
        }
      })
      .on('end', function () {});
  }

  resize(item) {
    let startX, startY;
    let startWidth, startHeight, startRect;
    console.log(item);
    return d3
      .drag()
      .on('start', (event) => {
        console.log(event);
        startWidth = (item.node() as HTMLElement).offsetWidth;
        startHeight = (item.node() as HTMLElement).offsetHeight;
        startX = event.x;
        startY = event.y;
        // event.sourceEvent.stopPropagation();
      })
      .on('drag', (event) => {
        let offsetX = event.x - startX;
        let offsetY = event.y - startY;
        if (startWidth + offsetX > 15) {
          item.style('width', startWidth + offsetX + 'px');
        }
        if (startHeight + offsetY > 15) {
          item.style('height', startHeight + offsetY + 'px');
        }
        // event.sourceEvent.stopPropagation();
      });
  }
}
