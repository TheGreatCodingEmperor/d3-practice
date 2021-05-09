import { Component, OnInit } from '@angular/core';
import * as d3 from  'd3';

@Component({
  selector: 'app-resize',
  templateUrl: './resize.component.html',
  styleUrls: ['./resize.component.css']
})
export class ResizeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    let rect = d3.select('#rect');
    let resizeRightBottom = rect.append('div').classed('right-bottom', true);
    console.log(resizeRightBottom);
    resizeRightBottom.call(this.resize(rect));
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
