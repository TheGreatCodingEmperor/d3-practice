import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-drag-drop',
  templateUrl: './drag-drop.component.html',
  styleUrls: ['./drag-drop.component.css']
})
export class DragDropComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    let rect = d3.select('#rect');

    rect.call(this.drag(rect));
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

}
