declare global {
  interface Window {
    angularComponentRef: any;
  }
}
// This is just a starting point, the library for the guest andh the host is flexible to growth
// * Host Interfaces main variable that the library would need to know
export interface IHost { 
    iframes: string[],// list of iframes being rendered
    //MutationObservables?: string []// list of dom elements that need to be watched
    origin: string, // origin of where the iframe is hosted
}

// * Guest Interfaces main variable that the library would need to know
export interface IGuest {
    origin: string, // origin of where the iframe is hosted
    targets?: string [], //this is the placeholders id that the parent can target
    iframes?: string [],// list of iframes that are siblings
   
}
// the enums would indicate the methods available, this is a short list I have started
// the message type would push to the appropriate method also the methods available would be differnt for guest / host
export enum MessageType { // actions
    SEND_MESSAGE  = 0, // post message
    CHANGE_URL = 1, // routing path only problem is maintaining the back button memory so we need to identify if the link in internal or external
    SET_SESSION_STORAGE = 2, // set session storage
    SET_COOKIES = 3, // set cookies
    MODAL = 4, // open a modal
    RESIZE_IFRAME = 5, // update the size of the iframe, this may have issues if we dont no what the height will be , it will create a jumping effect
    DOM_MUTATION = 6, // mutation of the dom structure directly without post message
    STYLING = 7, // passing css attributes to host or another iframe
    DESTROY_CONNECTION = 8, //destroy connection of listener or observer
    INTERCOM_IFRAME = 9, // talk direct to another iframe
    LOCAL_STORAGE = 10, /// set local storage
}
// * this is what I have so far for the message method interface, this would have appropriate variables that need to be accessed by the  host or guest
export interface IMessage{
    id: string,
    type: MessageType, // this would ref to a method in the host ie "CHANGE_URL"
    payload:{ // data from the post message
        name?: string, // name guest or host
        target?: string // if manipulating a target
        message?: string, // name of the message
        sendMessage?:{
            open?: boolean, // this would be for a popup or modal
            title?: string, // title of the message if needed
            message?: string, // name of the message
        }
        modal?:{
            open?: boolean, // this would be for a popup or modal
            title?: string, // title of the message if needed
            paragraph?: string, // name of the message
        }
        css?: { // apparently ab testing requires changes to the css coming from the host
            colour?: string, // stlying attributes will be added here
            fontSize?: string,
        },
        resizeIframe?:{
            target: string,
            width?: number,
            height?: number,
        },
        updateUrl?:{
          internal:boolean // if its changing the url to an external site or internal page
          path?: string,
          route?: string
        },
        domMutation?:{
          stateChange: boolean // this is used it the state needs to handle the change
          target:string // if its changing the url to an external site or internal page
          text?: string,
          html?: string
        },
        sessionStorage?:{
          get: boolean,
          name: string,
          content?: string
      },
      cookies?:{
        get: boolean,
        name: string,
        content?: string
    }
        localStorage?:{
            get: boolean,
            name: string,
            content?: string
        }
    }
}

  export interface IStore {
      name: string,
      payload: string
  }

  export class HostMicroService implements IHost {
      constructor(
          public origin: string,
          public guestWrapperId?: string, //the guest needs to know the wrapper Id so it can update its size
          public iframes: string[] = [],
          private document?,
          public iframeHeight?: string,
          public store?: IStore[],
          public observer?: MutationObserver,
          
          // Create an observer instance linked to the callback function
        

          ){
         
      }
  public init(){
        // on load init create widow event to listern to window events
        window.addEventListener("message", (event)=>{
            this.receiveMessage(event.origin, event.data)
        },false)
    
      }
// host must register the iframe
  public registerGuestFrame =(id: string):void => {
     this.iframes.push(id);
     // it needs to change the state of the array in the constructor so we can have a referance.
  }

  private previouslyPublishedWindowSize: { width: number; height: number };
  // ** COMMON LIB ** //
  // Recieve message action 
  private receiveMessage(
    messageOrigin:string,
    data:IMessage,
      ){
          // Do we trust the sender of this message?
          if (messageOrigin !== origin)
          return;

      this.actionTypes( data )
  }

  // this is a ng model template. 
  public modalAG (){
      return `<!-- Modal -->
      <div [ngClass]="{'show': showModal}" class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">{{modalHeading}}</h5>
              <button type="button" class="close" (click)="showModal=false" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              {{modalParagraph}}
            </div>
            <div class="modal-footer">
              <button type="button" (click)="showModal=false" class="btn btn-secondary" data-dismiss="modal">Close</button>
              <button type="button" (click)="addToSession(modalHeading)" class="btn btn-primary">Save changes</button>
            </div>
          </div>
        </div>
      </div>
      `
  }
  // get id of the iframe in the list
  public resolveVisibleFrame(guestId: string): any {
       const x = this.iframes
          .filter((id: string) => guestId.toLowerCase() === id.toLocaleLowerCase())
          .map((id: string) => document.getElementById(`${id}`));
          return x
          
  }
  public resized(): void {
    const newValues = {
      width: document.body.scrollWidth,
      height: document.body.scrollHeight,
    };
    if (
      !this.previouslyPublishedWindowSize ||
      this.previouslyPublishedWindowSize.height !== newValues.height ||
      this.previouslyPublishedWindowSize.height !== newValues.height
    ) {
      this.previouslyPublishedWindowSize = newValues;
      
    }
  }

  // resize the iframe take the width and height passed from the iframe
  private resizeIframe(payload: { target: string; width?: number; height?: number }) {
      const matchingIFrame = this.resolveVisibleFrame(payload.target);
      if (matchingIFrame) {
          //console.log('matching IFrame size update ' + payload.target, payload.height);
          if(payload.height)
          matchingIFrame[0].height = payload.height;

          if(payload.width)
          matchingIFrame[0].width = payload.width;
      }
  }
 
  // Callback function to execute when mutations are observed
  private callbackAfterMutation=(  mutationsList:MutationRecord[]  ) =>{
    // Use traditional 'for loops' for IE 11

      mutationsList.forEach((mutation: MutationRecord) => {
        if (mutation.type === 'childList') {
         // console.log('A child node has been added or removed.');
      }
      else if (mutation.type === 'attributes') {
        //  console.log('The ' + mutation.attributeName + ' attribute was modified.');
         if(mutation.attributeName === 'style'){
         
           // this will re post a message to the parent to resize the iframe
           // this is what makes it look seemless when an accordion is opened
          const sizeUpdate: IMessage = {
            id:'guest-size-changed',
            type: MessageType.RESIZE_IFRAME, // resize event
            payload:{
             resizeIframe:{
               target: this.guestWrapperId, // register the iframe that needs to be passed
               height: mutation.target.ownerDocument.scrollingElement.scrollHeight, // mass the height from the window of the dom element that is changing
             },
            }
           }
           window.parent.postMessage(
            sizeUpdate,
            this.origin
          );
          
         } 

      }
     
    });
  
  };
    public disconnect(){
      // stop observing
      this.observer.disconnect();
    }
    // listen to dom changes through mutations
    public listenForDomChanges(DOMEle:string): void {
      
       const targetNode = document.getElementById(DOMEle);
      this.observer = new MutationObserver(this.callbackAfterMutation);
        // Select the node that will be observed for mutations
     
      // Options for the observer (which mutations to observe)
      const config = { 
        attributes: true, 
        childList: true,
        characterData: true,
        subtree: true };

      // Start observing the target node for configured mutations
      this.observer.observe(targetNode, config);

    }

  // add to local storage
  private setLocalStorage(name, payload): void {
    localStorage.setItem(name, JSON.stringify(payload));
    this.store.push({name , payload})
  }
  // get to local storage
  private getLocalStorage(name){
    return localStorage.getItem(name) || 'not found';
  }
  // add to local storage
  private setSessionStorage(name, payload): void {
    sessionStorage.setItem(name, JSON.stringify(payload));
    this.store.push({name , payload})
  }
  // get to local storage
  private getSessionStorage(name){
    return sessionStorage.getItem(name) || 'not found';
  }
  
  private changeUrl(path: string) {
    parent.document.location.replace(path);
  }

  private changeRoute(routeTemplate){
    // this.router.navigate('event-template')
    // this would need send a message that can access the parent route
    window.angularComponentRef.component.router.navigate([routeTemplate]);
  }


  
  public styling(css: { // apparently ab testing requires changes to the css coming from the host
      colour?: string; // stlying attributes will be added here
      fontSize?: string;
    }){
      const styes = {
        messageType:'STYLES',
        colour:[css.colour]
      }
   
    window.angularComponentRef.zone.run(() => {
      window.angularComponentRef.component.callFromOutside(styes);
    })
    
    // ng.getComponent($0).title = 'css.colour'
    // ng.applyChanges($0)
    return css
  }
private modal(payload){

        payload.messageType = 'MODAL'
        window.angularComponentRef.component.callFromOutside(payload);
  }
private domMutation(payload){
  const {target, text} = payload
  
    window.angularComponentRef.zone.run(() => {
      window.angularComponentRef.component[target] = text;
    })

}
private actionTypes(event:IMessage){

// this is the where the message type gets processesed
    switch (event.type) {
        case 0: //SEND_MESSAGE
          this.postMessage(event,this.origin)
          break

        case 1: //  CHANGE_URL
        event.payload.updateUrl.internal?
        this.changeRoute(event.payload.updateUrl.route):
        this.changeUrl(event.payload.updateUrl.path)
          
          break;

        case 2:// SET_SESSION_STORAGE
            event.payload.localStorage.get ?
            this.getSessionStorage(event.payload.sessionStorage.name)
            :
            this.setSessionStorage(event.payload.sessionStorage.name, event.payload.sessionStorage.content)
            
          break

        case 3:// SET_COOKIES
          document.cookie = event.payload.cookies.content
         break

        case 4: // MODAL
            this.modal(event.payload.modal)
            break;
        
        case 5: // RESIZE_IFRAME
        // pass the payload.size properties
         this.resizeIframe(event.payload.resizeIframe);
          break;

        case 6: //DOM_MUTATION
          this.domMutation(event.payload.domMutation)
            break;

        case 7: // STYLING
            this.styling(event.payload.css)
            //  this.color1 = event.data.payload.color1
            break;

        case 8: // DESTROY_CONNECTION
            this.disconnect()
            break;

        case 9: // INTERCOM_IFRAME
            break;

        case 10: // LOCAL_STORAGE
            event.payload.localStorage.get ?
            this.getLocalStorage(event.payload.localStorage.name)
            :
            this.setLocalStorage(event.payload.localStorage.name, event.payload.localStorage.content)
            
            break;

        default:
         console.error(`unknown messageType received: ${event.type}`);
            break;
      }
    
}

        //  ** HOST *** //
        // send message to guest
        private sendMessagesToGuest = (GuestId: string, message:IMessage) => {
            const iframeEl = this.document.getElementById(GuestId);
            iframeEl.contentWindow.postMessage(message, this.origin);   
        }
        //post message
         public postMessage(message:IMessage, postOrigin:string){
            window.parent.postMessage(
              message,
              postOrigin
            );
         }

}
    

// export default HostMicroService