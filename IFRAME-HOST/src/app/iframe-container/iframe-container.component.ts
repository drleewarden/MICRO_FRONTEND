import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-iframe-container',
  templateUrl: './iframe-container.component.html',
  styleUrls: ['./iframe-container.component.scss']
})
export class IframeContainerComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  runAction(){
    alert('wpwowowowowowow')
    window.parent.postMessage('message', '*');
  }
}
