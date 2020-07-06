export default class Header{
    constructor(data){
        this.data = data;
    }
    btnMessage=()=>{
        window.postMessage('message', '*');
    }
    render=()=>{
        return `
        <div class="container">
                <h1 class="my-4 col-sm-4 col-md-2">
                    AGL
                    <small>Code Test</small>
                </h1>
                <button id="message"> test button one</button>
            
        </div>`;
    }
  
    
}