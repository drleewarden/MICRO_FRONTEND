// This is just a starting point, the library for the guest andh the host is flexible to growth

// * Host Interfaces main variable that the library would need to know
export interface IHost { 
    iframes?: string[],// list of iframes being rendered
    MutationObservables?: string []// list of dom elements that need to be watched
    origin: string, // origin of where the iframe is hosted
}

// * Guest Interfaces main variable that the library would need to know
export interface IGuest {
    origin: string, // origin of where the iframe is hosted
    targets?: string [], //this is the placeholders id that the parent can target
    iframes?: string [],// list of iframes that are siblings
    MutationObservables?: string []// list of dom elements that need to be watched
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
    id: number,
    type: MessageType, // this would ref to a method in the host ie "CHANGE_URL"
    payload:{ // data from the post message
        name?: string, // name of the message if needed
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
            message?: string, // name of the message
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
          public iframes: string[],
          public MutationObservables: string[],
          public origin: string,
          private document,
          private domChanges: MutationObserver,
          private elementRef: HTMLElement,
          public store: IStore[],
          public observer: MutationObserver
          // Create an observer instance linked to the callback function
        

          ){
         
      }

  // ** COMMON LIB ** //
  // Recieve message action 
  private receiveMessage(
      data:IMessage,
      ){
          console.log('data recieved', data)
          // Do we trust the sender of this message?
      if (origin !== "http://localhost:8081")
      return;

      this.actionTypes( data.type, data )
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
  private resolveVisibleFrame(guestId: string): any {
      return this.iframes
          .filter((id: string) => guestId.toLowerCase() === id.toLocaleLowerCase())
          .map((id: string) => this.document.getElementById(`${id}`));
          
  }

  // resize the iframe take the width and height passed from the iframe
  private resizeIframe(payload: { target: string; width?: number; height?: number }) {
      const matchingIFrame = this.resolveVisibleFrame(payload.target);
      if (matchingIFrame) {
          console.log('matching IFrame size update ' + payload.target, payload.height);
          matchingIFrame.height = payload.height;
          matchingIFrame.width = payload.width;
      }
  }

  // Callback function to execute when mutations are observed
  private callbackAfterMutation(  mutationsList:MutationRecord[]  ) {
    // Use traditional 'for loops' for IE 11
      mutationsList.forEach((mutation: MutationRecord) => {
        if (mutation.type === 'childList') {
          console.log('A child node has been added or removed.');
      }
      else if (mutation.type === 'attributes') {
          console.log('The ' + mutation.attributeName + ' attribute was modified.');
      }
      console.log(
        'guest mutation detected',
        mutation
      );
      // const iframeEl = this.document.getElementById('iframe-container');
      // const payload = {
      //   display: true,
      //   text: 'This Message is coming from the parent containter',
      // };
      // iframeEl.contentWindow.postMessage(
      //   { payload: payload },
      //   'http://localhost:4200'
      // );
      // this.resizeIframe();
    });
  
  };
    private disconnect(){
      // stop observing
      this.observer.disconnect();
    }
    // listen to dom changes through mutations
    private listenForDomChanges(DOMEle:string): void {
      
    this.observer = new MutationObserver(this.callbackAfterMutation);
      // Select the node that will be observed for mutations
    const targetNode = document.getElementById(DOMEle);
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

  private changeUrl(path: string) {
    parent.document.location.replace(path);
  }

  private changeRoute(routeTemplate){
    // this.router.navigate('event-template')
    // this would need send a message that can access the parent route
  }

  // get to local storage
  private getLocalStorage(name){
    return localStorage.getItem(name) || 'not found';
  }

  private modal(payload){
      // this will need to inject the dom of the iframe

        // this.modalHeading = event.data.payload.message.heading;

        // this.modalParagraph = event.data.payload.message.paragraph;

        // this.showModal =  event.data.payload.modal.open;
  }
  
    private actionTypes(type: number, event:IMessage){

    switch (type) {
        case 0: //SEND_MESSAGE
          break

        case 1: //  CHANGE_URL
        event.payload.updateUrl.internal?
        this.changeRoute(event.payload.updateUrl.route):
        this.changeUrl(event.payload.updateUrl.path)
          
          break;

        case 2:// SET_SESSION_STORAGE
          break

        case 3:// SET_COOKIES
         break

        case 4: // MODAL
            this.modal(event.payload.modal)
            break;
        
        case 5: // RESIZE_IFRAME
        // pass the payload.size properties
         this.resizeIframe(event.payload.resizeIframe);
          break;

        case 6: //DOM_MUTATION
         // window.document.body.style.background = event.data.payload;
            break;

        case 7: // STYLING
            //  this.color1 = event.data.payload.color1
            break;

        case 8: // DESTROY_CONNECTION
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
         console.error(`unknown messageType received from host: ${event.id}`);
            break;
      }
    
}

        public init(){
        window.addEventListener("message", (event)=>{
            console.log('get data',event)
            this.receiveMessage(event.data)
        },false)
        console.log('test', origin)
        }

        //  ** HOST *** //
        // send message to guest
        private sendMessagesToGuest = (GuestId: string, message:IMessage) => {
            const iframeEl = this.document.getElementById(GuestId);
            iframeEl.contentWindow.postMessage(message, this.origin);   
        }

}
    

// export default HostMicroService