import { Component, OnInit, Injectable, Inject  } from '@angular/core';
import { DOCUMENT } from '@angular/common';
@Injectable()
@Component({
  selector: 'app-battery',
  templateUrl: './battery.component.html',
  styleUrls: ['./battery.component.scss']
})
export class BatteryComponent {
    private frameIds: string[] = [];
    public textUpdate: string = 'Iframe Content'
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
    }    
    
    private resolveVisibleFrame(guestId: string): any {
        return this.frameIds
            .filter((id: string) => guestId.toLowerCase() === id.toLocaleLowerCase())
            .map((id: string) => this.document.getElementById(`${id}`))
            .find((e) => !!e);
    }    
  
    constructor(
        
      @Inject(DOCUMENT) private document) {
        
        const results = document.getElementById('results');
        window.addEventListener(
            'message',
            (event) => {
                this.changeTxt(event)
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
                });                
                
              
            },
            false
        );
      
    }
    public openParentModal(){
        let type = 'MODAL';
        let payload = {
            message:{
                heading:'this text is coming from the iframe',
                paragraph:'this is the content for the modal coming from the iframe',
               
            },
            modal: {
                open: true,
                target:'#exampleModal'
            },
        }
      window.parent.postMessage({ messageType: type, payload:payload}, 'http://localhost:4200');
    }
    public changeTxt(e){
        if (e.data.payload.display) {
            console.log('test', e.data.payload.text);
            this.textUpdate = e.data.payload.text
        }
    }
    public dirMessageGuest(){
        var ifrm = parent.document.getElementById('iframe-container-2');
        var win = ifrm.contentWindow; // reference to iframe 2 window
        // var doc = ifrm.contentDocument? ifrm.contentDocument: ifrm.contentWindow.document;
        win.postMessage({ messageType: 'local-storage-change', payload: undefined }, 'http://localhost:4200')
    }
    public runAction(){
    let type = 'CHANGE_COLOUR';
    let payload = {color1:'pink',color2:'red', color3:'blue', color4:'yellow'}
      window.parent.postMessage(
          {
            messageType:type,
            payload:payload
        }, 
          'http://localhost:4200'
          );
    }

    
    public changeSize(): void {
        let payloadData:any = {
            guestId:"iframe-container",
            width:"200px",
            height: "200px"
        }
        window.parent.postMessage({messageType: 'IFRAME_RESIZE', payload: payloadData},'http://localhost:4200' );
    }
     // post message to guest iframe
  private postMessage(messageType: string, payload?: {}): void {
    payload = Object.assign(payload || {}, { guestId: (window.frameElement || {}).id || 'unable-to-resolve' });
    parent.postMessage({ messageType, payload}, this.sameOriginTargetOrigin);
  }

    public changeBGColor(): void {
        let payloadData:any = {name:"hello"}

        const newColor = this.colorChanges++ % 2 === 0 ? '#FFFF88' : '#F5F5F5';    

        window.parent.postMessage({messageType: 'color-change', payload: payloadData},'http://localhost:4200' );

        this.resolveVisibleFrames(this.sameOriginTargetOrigin).forEach((frame) =>
            frame.contentWindow.postMessage({ messageType: 'color-change', payload: newColor }, this.sameOriginTargetOrigin)
        );        
        
        this.resolveVisibleFrames(this.diffOriginTargetOrigin).forEach((frame) =>
            frame.contentWindow.postMessage({ messageType: 'color-change', payload: newColor }, this.diffOriginTargetOrigin)
        );
    }
}

