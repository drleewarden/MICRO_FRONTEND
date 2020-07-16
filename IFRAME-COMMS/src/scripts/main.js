
// Load up components
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../styles/index.scss';
import {Iframe} from './components/iframe/iframe';
import {Footer} from './components/footer';
import {HostMicroService} from './components/microFrontend';
// import {IHost} from './components/microFrontend';
/*
 * In the popup's scripts, running on <http://example.com>:
 */

// Called sometime after postMessage is called
// function receiveMessage(event)
// {

//   // Do we trust the sender of this message?
//   if (event.origin !== "http://localhost:8081")
//     return;

//     alert('milk')
//   // event.source is window.opener
//   // event.data is "hello there!"

//   // Assuming you've verified the origin of the received message (which
//   // you must do in any case), a convenient idiom for replying to a
//   // message is to call postMessage on event.source and provide
//   // event.origin as the targetOrigin.
//   event.source.postMessage("hi there yourself!  the secret response " +
//                            "is: rheeeeet!",
//                            event.origin);
// }
// sendMessages = () => {

// }
// window.addEventListener("message", receiveMessage, false);


  
function createPage (){
    // components
    const iframe = new Iframe('http://localhost:8081/');
    const footer = new Footer('Micro', ' Frontend');
    const host = new HostMicroService(
      {
        origin:'http://localhost:8081/',
        iframes: ['first-iframe']
    }
      );
    host.init();
    //this is where we add the data template string to the dom
    const templateLoadingArea = document.getElementById('root');
    const footerSection = document.getElementById('footer');
    templateLoadingArea.innerHTML = iframe.render();
    footerSection.innerHTML = footer.render();
  }

  createPage();









