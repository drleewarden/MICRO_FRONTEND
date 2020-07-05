
// Load up components
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../styles/index.scss';
import Template from './components/'
import Header from './components/header'

// quick api call
fetch('http://agl-developer-test.azurewebsites.net/people.json')
  .then(function(response) {
    return response.json();
  }).then(function(data) {
      //call render after products are ready
    createPage(data);
  })
  
function createPage (data){
    // components
    const header = new Header(data);
   
    //this is where we add the data template string to the dom
    const headerSection = document.getElementById('header');
    headerSection.innerHTML = header.render();

    // passing click events
    const button = document.getElementById('message');
    button.addEventListener('click', event => {
      header.btnMessage();
      button.innerHTML = `Click count: ${event.detail}`;  
    //   window.onmessage = function(e){
    //     if (e.data == 'hello') {
    //         alert('It works!');
    //     }
    // };
    });
}









