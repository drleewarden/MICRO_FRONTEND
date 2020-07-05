export default class Header{
    constructor(data){
        this.data = data;
    }
    btnMessage=()=>{
        var popup = window
        popup.postMessage("The user is 'bob' and the password is 'secret'",
                  "https://secure.example.net");
        // function receiveMessage(event)
        //     {

        //     // Do we trust the sender of this message?  (might be
        //     // different from what we originally opened, for example).
        //     if (event.origin !== "http://example.com")
        //         return;

        //     // event.source is popup
        //     // event.data is "hi there yourself!  the secret response is: rheeeeet!"
        //     }
    // window.addEventListener("message", receiveMessage, false);

    
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