export default class Header{
    constructor(data){
        this.data = data;
    }
    render(){
        return `
        <div class="container">
                <h1 class="my-4 col-sm-4 col-md-2">
                    AGL
                    <small>Code Test</small>
                </h1>
            
        </div>`;
    }
    
}