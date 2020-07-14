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
    SET_LOCAL_STORAGE = 10, /// set local storage
}
// * this is what I have so far for the message method interface, this would have appropriate variables that need to be accessed by the  host or guest
export interface IMessage{
    id: number,
    type: MessageType, // this would ref to a method in the host ie "CHANGE_URL"
    payload:{ // data from the post message
        name?: string, // name of the message if needed
        title?: string, // title of the message if needed
        target?: string // if manipulating a target
        message?: string, // name of the message
        open?: boolean, // this would be for a popup or modal
        css?: { // apparently ab testing requires changes to the css coming from the host
            colour?: string, // stlying attributes will be added here
            fontSize?: string,
        }
    }
}

export class HostMicroService implements IHost {
    constructor(
        public iframes: string[],
        public MutationObservables: string[],
        public origin: string,
        private document
        
        ){
        //origin = origin
    }

   
    /*
 * In the popup's scripts, running on <http://example.com>:
 */

// Recieve message action 
public receiveMessage(
    data:IMessage,
    ){

        console.log('data recieved',data)
         // Do we trust the sender of this message?
    if (origin !== "http://localhost:8081")
    return;

// event.source is window.opener
// event.data is "hello there!"

// Assuming you've verified the origin of the received message (which
// you must do in any case), a convenient idiom for replying to a
// message is to call postMessage on event.source and provide
// event.origin as the targetOrigin.
    
//   event.source.postMessage("hi there yourself!  the secret response " +
//                            "is: rheeeeet!",
//                            event.origin);
 
 
}

private sendMessages = (event:any) => {
    event.source.postMessage("hi there yourself!  the secret response " +
                           "is: rheeeeet!",
                           event.origin);
}


public init(){
    window.addEventListener("message", (event)=>{
        console.log('get data',event)
        this.receiveMessage(event.data)
    },false)
    console.log('test', origin)
}

}
    

// export default HostMicroService