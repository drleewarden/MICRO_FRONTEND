export default class Header{
    constructor(data){
        this.data = data;
    }
    btnMessage(){
        window.parent.postMessage({data:'hello'},"http://localhost:8080/");
        console.log('message posted');
    }
    render(){
        return `
        <div class="container">
                <h1 class="my-4 col-sm-4 col-md-2">
                    iFrame content 1
                    <small>micro</small>
                </h1>
                <button class="btn btn-primary" id="message"> test button one</button>
            
        </div>`;
    }
  
    
}