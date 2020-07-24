
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









