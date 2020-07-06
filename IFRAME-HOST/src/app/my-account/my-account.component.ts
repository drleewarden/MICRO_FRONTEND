import { Component, OnInit, Inject, HostListener, AfterViewInit, ElementRef, OnDestroy } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
declare let window: Window;

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss']
})

export class MyAccountComponent implements OnInit, OnDestroy, AfterViewInit {

  public dynamicStyle = '';
  public currentHref = '';
  public messageCount = 0;
  public localStorageData = '';
  public sessionStorageData = '';
  private colorChanges = 0;
  private targetOrigin = this.document.location.href.includes('localhost:4200') ?
      'https://localhost:4200' :
      'http://localhost:8080/';  
  private domChanges: MutationObserver;
  private previouslyPublishedWindowSize: { width: number, height: number};  
  
  constructor(
    @Inject(DOCUMENT) 
    private document, 
    private elementRef: ElementRef
    ) 
    {
      window.addEventListener("message", this.receiveMessage, false);
   }  
  
  @HostListener('window:resize', ['$event'])
  
  private listenForDomChanges(): void {
    let element = this.elementRef.nativeElement;
    this.domChanges = new MutationObserver((mutations: MutationRecord[]) => {
          mutations.forEach((mutation: MutationRecord) => {
            console.log(`guest mutation detected (${(window.frameElement || {}).id || 'unable-to-resolve'})`, mutation);
            this.resized();
          });
        }
    );      
    
    this.domChanges.observe(element, {
      attributes: true,
      childList: true,
      characterData: true,
      subtree: true,
    });
  }  

  ngOnDestroy(): void {
    this.domChanges.disconnect();
  }  

  public sendMessageToParent(): void {
    const newColor = this.colorChanges++ % 2 === 0 ? '#AAFFFF' : '#FFFFFF';
    this.postMessage('color-change', newColor);
  }  

  public foo(): void {
    const newColor = this.colorChanges++ % 2 === 0 ? '#AAFFFF' : '#FFFFFF';
    this.document.body.style.background = newColor;
  }  

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
    this.initMessageHandler();
  }  
  
  toggleFont() {
    this.dynamicStyle = this.dynamicStyle ? '' : 'font-size: 2.5em; color: green';
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
        case 'color-change':
          this.document.body.style.background = event.data.payload;
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
     event.source.postMessage({ messageType: 'ping-back', payload: 'foo'}, event.origin);    
    });
  } // required for lazy dom changes like agl-ds-button
}
