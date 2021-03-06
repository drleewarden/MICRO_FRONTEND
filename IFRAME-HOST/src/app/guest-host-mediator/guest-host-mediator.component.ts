import { Injectable, Inject , Component, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
@Injectable()
@Component({
  selector: 'app-guest-host-mediator',
  templateUrl: './guest-host-mediator.component.html',
  styleUrls: ['./guest-host-mediator.component.scss']
})
export class GuestHostMediatorComponent implements OnInit {

  private frameIds: string[] = [];
  private colorChanges: number = 0;
  private lsValue: number = 0;    
  private sameOriginTargetOrigin = this.document.location.href.includes('localhost:808')
      ? 'https://localhost:8080'
      : 'https://quarterly-test.myaccount.agl.com.au';    
  private diffOriginTargetOrigin = this.document.location.href.includes('localhost:808') ? 'https://localhost:8081' : 'TODO';    
  private resolveVisibleFrames(origin: string): any {
      return this.frameIds
          .map((id: string) => this.document.getElementById(`${id}`))
          .filter((e) => !!e)
          .filter((e: any) => !!e.src.toLowerCase().startsWith(origin.toLowerCase()));
  }    private resolveVisibleFrame(guestId: string): any {
      return this.frameIds
          .filter((id: string) => guestId.toLowerCase() === id.toLocaleLowerCase())
          .map((id: string) => this.document.getElementById(`${id}`))
          .find((e) => !!e);
  }    
  constructor(@Inject(DOCUMENT) private document) {
      window.addEventListener(
          'message',
          (event) => {
              alert('dfdf')
              if (!event.origin.startsWith(this.sameOriginTargetOrigin) && !event.origin.startsWith(this.diffOriginTargetOrigin)) {
                  return;
              } else if (!event.data.messageType) {
                  return;
              }                
              console.log('received response', {
                  messageType: event.data.messageType,
                  guestId: ((event.data || {}).payload || {}).guestId,
                  origin: event.origin,
                  data: event.data
              });                switch (event.data.messageType) {
                  case 'color-change':
                      window.document.body.style.background = event.data.payload;
                      break;
                  case 'ping-back':
                  case 'loaded':
                      break;
                  case 'resized':
                      // this.resizeIframes(event.source);
                      this.resizeIframe(event.data.payload);
                      break;
                  default:
                      console.error(`unknown messageType received from guest: ${event.data.messageType}`);
                      break;
              }
          },
          false
      );
  }    
  public registerGuestFrame(id: string) {
      this.frameIds.push(id);
  }    
  private resizeIframe(payload: { guestId: string; width: number; height: number }) {
      
    const matchingIFrame = this.resolveVisibleFrame(payload.guestId);
        if (matchingIFrame) {
            console.log('matchingIFrame ' + payload.guestId, payload.height);
            matchingIFrame.height = payload.height + 0; // don't know why I need the 1
        }
  }    
  public changeGuestDom(addLongerContent: boolean): void {
      this.resolveVisibleFrames(this.sameOriginTargetOrigin).forEach((frame) => {
          const targetElement = frame.contentWindow.document.querySelector('#injectionPlaceholder');
          if (addLongerContent) {
              targetElement.innerHTML += `<br>Injected '${++this.lsValue}' from host javascript (not window.postMessage)`;
          } else {
              targetElement.innerHTML = `Injected '${++this.lsValue}' from host javascript (not window.postMessage)`;
          }
      });
  }   
   public setLocalStorage(): void {
      localStorage.setItem('sharedDataWithGuest', `host value ${++this.lsValue}`);
      this.resolveVisibleFrames(this.sameOriginTargetOrigin).forEach((frame) =>
          frame.contentWindow.postMessage({ messageType: 'local-storage-change', payload: undefined }, this.sameOriginTargetOrigin)
      );
  }    
  public setSessionStorage(): void {
      sessionStorage.setItem('sharedDataWithGuest', `host value ${++this.lsValue}`);
      this.resolveVisibleFrames(this.sameOriginTargetOrigin).forEach((frame) =>
          frame.contentWindow.postMessage({ messageType: 'session-storage-change', payload: undefined }, this.sameOriginTargetOrigin)
      );
  }    
  public changeBGColor(): void {
      const newColor = this.colorChanges++ % 2 === 0 ? '#FFFF88' : '#F5F5F5';        
      this.resolveVisibleFrames(this.sameOriginTargetOrigin).forEach((frame) =>
          frame.contentWindow.postMessage({ messageType: 'color-change', payload: newColor }, this.sameOriginTargetOrigin)
      );        
      this.resolveVisibleFrames(this.diffOriginTargetOrigin).forEach((frame) =>
          frame.contentWindow.postMessage({ messageType: 'color-change', payload: newColor }, this.diffOriginTargetOrigin)
      );
  }

  ngOnInit(): void {
  }

}

