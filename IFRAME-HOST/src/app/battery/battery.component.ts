import { Component, OnInit, Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import {
  HostMicroService,
  MessageType,
  IMessage,
  IGuest,
} from '../../../../IFRAME-COMMS/src/scripts/components/microFrontend';
@Injectable()
@Component({
  selector: 'app-battery',
  templateUrl: './battery.component.html',
  styleUrls: ['./battery.component.scss'],
})
export class BatteryComponent implements OnInit, IGuest {
  private frameIds: string[] = [];
  public textUpdate = 'Iframe Content';
  private colorChanges: number;
  private lsValue: number;
  public host: HostMicroService;
  public origin = 'http://localhost:4200';
  
  constructor(@Inject(DOCUMENT) private document) {
    const config = {
      origin: 'http://localhost:4200',
      guestWrapperId: 'iframe-container',
    };
    this.host = new HostMicroService(config.origin, config.guestWrapperId),
    this.host.init();
    this.host.resized();
    const heightOutput = document.querySelector('#height');
    const widthOutput = document.querySelector('#width');
    const results = document.getElementById('results');
  }

  private sameOriginTargetOrigin = this.document.location.href.includes(
    'localhost:808'
  )
    ? 'https://localhost:8080'
    : 'https://quarterly-test.myaccount.agl.com.au';
  private diffOriginTargetOrigin = this.document.location.href.includes(
    'localhost:808'
  )
    ? 'https://localhost:8081'
    : 'TODO';
  private resolveVisibleFrames(origin: string): any {
    return this.frameIds
      .map((id: string) => this.document.getElementById(`${id}`))
      .filter((e) => !!e)
      .filter(
        (e: any) => !!e.src.toLowerCase().startsWith(origin.toLowerCase())
      );
  }

  private resolveVisibleFrame(guestId: string): any {
    return this.frameIds
      .filter((id: string) => guestId.toLowerCase() === id.toLocaleLowerCase())
      .map((id: string) => this.document.getElementById(`${id}`))
      .find((e) => !!e);
  }
  ngOnInit(): void {
    this.host.listenForDomChanges('accordion');
  }
  public changeUrl(): void {
    // parent.document.location.replace('http://localhost:4200/guest');
    './battery'
    const route: IMessage = {
      id: 'change-the-route',
      type: MessageType.CHANGE_URL,
      payload: {
        updateUrl:{
          internal: true, // if its changing the url to an external site or internal page
          route: './battery'
        }
      },
    };

    window.parent.postMessage(route, 'http://localhost:4200');

  }

  public openParentModal() {
    //
    const modal: IMessage = {
      id: 'open-iframe',
      type: MessageType.MODAL,
      payload: {
        modal:{
          open: true, // this would be for a popup or modal
          title: 'title', // title of the message if needed
          paragraph: 'this is the content for the modal coming from the iframe thats goes throught the micro frontend', // name of the message
      }
      },
    };

    window.parent.postMessage(modal, 'http://localhost:4200');

  }

  public changeText() {
    const domChange: IMessage = {
      id: 'change-text',
      type: MessageType.DOM_MUTATION,
      payload: {
        domMutation:{
          target:'title',
          stateChange: true,
          text:'updated text for title'
        }
      },
    };

    window.parent.postMessage(domChange, 'http://localhost:4200');

  }

  public dirMessageGuest() {
    var ifrm: any = parent.document.getElementById('iframe-container-2');
    var win = ifrm.contentWindow; // reference to iframe 2 window
    // var doc = ifrm.contentDocument? ifrm.contentDocument: ifrm.contentWindow.document;
    win.postMessage(
      { messageType: 'local-storage-change', payload: undefined },
      'http://localhost:4200'
    );
  }
  
  public runAction() {
    let type = 'CHANGE_COLOUR';
    let payload = {
      color1: 'pink',
      color2: 'red',
      color3: 'blue',
      color4: 'yellow',
    };
    window.parent.postMessage(
      {
        messageType: type,
        payload: payload,
      },
      'http://localhost:4200'
    );
    const css: IMessage = {
      id: 'change_colour',
      type: MessageType.STYLING,
      payload: {
        css: {
          colour: 'red',
        },
      },
    };
    //this.host.styling(css);
    window.parent.postMessage(css, 'http://localhost:4200');
    const message: IMessage = {
      id: 'make_alert',
      type: MessageType.SET_COOKIES,
      payload: {
        sendMessage: {
          message: 'this is the message',
        },
      },
    };
    window.parent.postMessage(message, 'http://localhost:4200');
  }

  public changeSize(): void {
    const payloadData: any = {
      guestId: 'iframe-container',
      width: '200px',
      height: '200px',
    };
    window.parent.postMessage(
      { messageType: 'IFRAME_RESIZE', payload: payloadData },
      'http://localhost:4200'
    );
  }
  // post message to guest iframe
  private postMessage(messageType: string, payload?: {}): void {
    payload = Object.assign(payload || {}, {
      guestId: (window.frameElement || {}).id || 'unable-to-resolve',
    });
    parent.postMessage({ messageType, payload }, this.sameOriginTargetOrigin);
  }

  public changeBGColor(): void {
    const payloadData: any = { name: 'hello' };

    const newColor = this.colorChanges++ % 2 === 0 ? '#FFFF88' : '#F5F5F5';

    window.parent.postMessage(
      { messageType: 'color-change', payload: payloadData },
      'http://localhost:4200'
    );

    this.resolveVisibleFrames(this.sameOriginTargetOrigin).forEach((frame) =>
      frame.contentWindow.postMessage(
        { messageType: 'color-change', payload: newColor },
        this.sameOriginTargetOrigin
      )
    );

    this.resolveVisibleFrames(this.diffOriginTargetOrigin).forEach((frame) =>
      frame.contentWindow.postMessage(
        { messageType: 'color-change', payload: newColor },
        this.diffOriginTargetOrigin
      )
    );
  }
}
