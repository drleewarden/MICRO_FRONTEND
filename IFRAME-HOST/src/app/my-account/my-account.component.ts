import { Component, OnInit, Inject, HostListener, AfterViewInit, ElementRef, OnDestroy } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
declare let window: Window;

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss']
})
// this is the Host Library
export class MyAccountComponent implements OnInit, OnDestroy, AfterViewInit {
  public color1 = '#dfeb76';
  public color2 = '#e9350c';
  public color3 = '#57970d';
  public color4 = '#3c3c97';
  public modalHeading = '';
  private frameIds: string[] = [];
  public modalParagraph = '';
  public showModal = false;
  public dynamicStyle = '';
  public currentHref = '';
  public messageCount = 0;
  public localStorageData = '';
  public sessionStorageData = '';
  private colorChanges = 0;
  private lsValue: number = 0;    
  // private sameOriginTargetOrigin = this.document.location.href.includes('localhost:808')
  //     ? 'https://localhost:8080'
  //     : 'https://quarterly-test.myaccount.agl.com.au';    
  private targetOrigin = this.document.location.href.includes('localhost:4200') ?
      'http://localhost:4200' :
      'http://localhost:8080/';  
  private domChanges: MutationObserver;
  private previouslyPublishedWindowSize: { width: number, height: number};  
  
  constructor(
    @Inject(DOCUMENT) 
    private document, 
    // public iframeEl = document.getElementById('iframe-container'),
    private elementRef: ElementRef
    ) {
   }  
  
  @HostListener('window:resize', ['$event'])
  // register the iframes on the page
  public registerGuestFrame(id: string) {
        this.frameIds.push(id);
    }   
  // listen to dom changes through mutations  
  private listenForDomChanges(): void {
    let element = this.elementRef.nativeElement;
    this.domChanges = new MutationObserver((mutations: MutationRecord[]) => {
          mutations.forEach((mutation: MutationRecord) => {
            console.log(`guest mutation detected (ll|| 'unable-to-resolve'})`, mutation);
            const iframeEl = this.document.getElementById('iframe-container');
            const payload = {
              display: true,
              text: 'This Message is coming from the parent containter'
            }
            iframeEl.contentWindow.postMessage({payload:payload}, 'http://localhost:4200');
            this.resized();
          });
        }
    );      
  // watch changes
    this.domChanges.observe(element, {
      attributes: true,
      childList: true,
      characterData: true,
      subtree: true,
    });
  }  
  // observer disconnect
  ngOnDestroy(): void {
    this.domChanges.disconnect();
  }  


  // post message to guest iframe
  private postMessage(messageType: string, payload?: {}): void {
    payload = Object.assign(payload || {}, { guestId: (window.frameElement || {}).id || 'unable-to-resolve' });
    parent.postMessage({ messageType, payload}, this.targetOrigin);
  }

  onResize(event): void {
    console.log('window:resize');
    this.resized();
  }  
  
  ngAfterViewInit(): void {
    this.postMessage('loaded');
    this.listenForDomChanges();
  }  
  
  ngOnInit(): void {
    this.localStorageData = localStorage.getItem('sharedDataWithGuest');
    this.sessionStorageData = sessionStorage.getItem('sharedDataWithGuest');
    this.currentHref = this.document.location.href;
    this.registerGuestFrame('iframe-container');
    this.registerGuestFrame('iframe-container-2');
    this.initMessageHandler();
  }  

  private resized(): void {
    const newValues = { width: this.document.body.scrollWidth, height: this.document.body.scrollHeight };
    if (!this.previouslyPublishedWindowSize
        || this.previouslyPublishedWindowSize.height !== newValues.height
        || this.previouslyPublishedWindowSize.height !== newValues.height) {
      this.previouslyPublishedWindowSize = newValues;
      this.postMessage('resized',  {
        width: newValues.width,
        height: newValues.height
      });
    }
  }

public receiveMessage=(event)=>{
  // Do we trust the sender of this message?
  if (event.origin !== "http://localhost:4200")
    return;
  console.log('message',event)
}

public addToSession(text): void {
  sessionStorage.setItem('store',text);
}

private resolveVisibleFrames(origin: string): any {
    return this.frameIds
      .map((id: string) => this.document.getElementById(`${id}`))
      .filter((e) => !!e)
      .filter((e: any) => !!e.src.toLowerCase().startsWith(origin.toLowerCase()));
}

private resolveVisibleFrame(guestId: string): any {
    return this.frameIds
        .filter((id: string) => guestId.toLowerCase() === id.toLocaleLowerCase())
        .map((id: string) => this.document.getElementById(`${id}`))
        .find((e) => !!e);
}
//resize the iframe take the width and height passed from the iframe
private resizeIframe(payload: { guestId: string; width: number; height: number }) {
    const matchingIFrame = this.resolveVisibleFrame(payload.guestId);
    if (matchingIFrame) {
        console.log('matchingIFrame ' + payload.guestId, payload.height);
        matchingIFrame.height = payload.height;
        matchingIFrame.width = payload.width;
    }
}
// add to local storage
public setLocalStorage(): void {
  localStorage.setItem('sharedDataWithGuest', `host value ${++this.lsValue}`);

  this.resolveVisibleFrames(this.targetOrigin).forEach((frame) =>
      frame.contentWindow.postMessage({ messageType: 'local-storage-change', payload: undefined }, this.targetOrigin)
  );
}
// change the guest dom
public changeGuestDom(content?: boolean): void {
  this.resolveVisibleFrames(this.targetOrigin).forEach(frame => {
      let targetElement = frame.contentWindow.document.querySelector('#update-section') != null ? frame.contentWindow.document.querySelector('#update-section') : false;
      
      
      if (targetElement===false) {
         return
      } else {
          targetElement.innerHTML = `Injected '${++this.lsValue}' from host javascript (not window.postMessage)`;
      }
  });
}    
// listen for any message from iframe
private initMessageHandler(): void {
    window.addEventListener('message', (event: any) => {
      this.receiveMessage(event);
      
      console.log('guest received', event);
      
    if (!event.origin.startsWith(this.targetOrigin)) {
        console.error(`we ignore window.postMessage messages from ${event.origin} - we only accept ${this.targetOrigin}`);
        return;
      }

      if (!event.data.messageType) {
        console.error(`messageType must be specified`, event.data);
        return;
      }      
      
      this.messageCount += 1;
      switch (event.data.messageType) {
        case 'MODAL':
          debugger
          this.modalHeading = event.data.payload.message.heading;
          this.modalParagraph = event.data.payload.message.paragraph;
          this.showModal =  event.data.payload.modal.open;
          break
        case 'CHANGE_COLOUR':
          this.color1 = event.data.payload.color1
          this.color2 = event.data.payload.color2
          this.color3 = event.data.payload.color3
          this.color4 = event.data.payload.color4
          //window.document.body.style.background = event.data.payload;
          break;
        case 'IFRAME_RESIZE':
          this.resizeIframe(event.data.payload);
          break

        case 'ping-back':
        case 'loaded':
            break;
        
        case 'local-storage-change':
          this.localStorageData = localStorage.getItem('sharedDataWithGuest') || 'not found';
          break;
        case 'session-storage-change':
          this.sessionStorageData = sessionStorage.getItem('sharedDataWithGuest') || 'not found';
          break;
        default:
          console.error(`unknown messageType received from host: ${event.data.messageType}`);
          break;
      }
    // event.source.postMessage({ messageType: 'ping-back', payload: 'foo'}, event.origin);    
    }, false);
  } // required for lazy dom changes like agl-ds-button
}
