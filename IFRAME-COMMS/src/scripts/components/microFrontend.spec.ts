import {HostMicroService,IMessage,MessageType} from './microFrontend'


const mediator = new HostMicroService('http://localhost:4200','test_iframe');
mediator.init();
mediator.registerGuestFrame('iframe-container');
var $window, listeners;
// export const createSpyObj = (baseName, methodNames) => {
//         let obj: any = {};
    
//         for (let i = 0; i < methodNames.length; i++) {
//             obj[methodNames[i]] = jest.fn();
//         }
    
//         return obj;
//     };
    beforeEach(function() {

        const map = {};
        window.addEventListener = jest.genMockFn().mockImpl((event, cb) => {
                map[event] = cb;
                console.log(event)
              });
              
        // window.addEventListener = jest.fn((event, cb) => {
        //   map[event] = cb;
        //   console.log(event)
        // });
        //        $window = createSpyObj('$window', ['addEventListener', 'postMessage']);
        //         $window.addEventListener.and.callFake(function(event, listener) {
        //                 console.log('event',event)
        //             listeners[event] = listener;
        //         });
        })
// this.host.resized();
document.body.innerHTML = `
<div id="test">
   <div id="container" class="panel-block">

   </div>
</div>`

describe('window post are added and being recieved, constructors are setup for manipulation',()=>{
        console.log(mediator)
        const message = {
                id: 'string',
                type: 0, // this would ref to a method in the host ie "CHANGE_URL"
                payload:{}
        }
        
        test('send window message',()=>{
                const message: IMessage = {
                        id: 'make_alert',
                        type: MessageType.SET_COOKIES,
                        payload: {
                          sendMessage: {
                            message: 'this is the message',
                          },
                        },
                      };
                      window.postMessage(message, '*');
                      
                //$window.postMessage(message, '*');
        })
        test( 'register Guest Frame by pushing array', () => {
                expect(mediator.iframes[0]).toBe('iframe-container')
           })

        test( 'register Guest Frame by pushing array', () => {
                expect(mediator.iframes[0]).toBe('iframe-container')
        })
           
        test( 'register Guest Frame by pushing array', () => {
                const sendMessage = mediator.resolveVisibleFrame('iframe-container');
                expect(sendMessage.length).toBe(1)
           })
        })
        

