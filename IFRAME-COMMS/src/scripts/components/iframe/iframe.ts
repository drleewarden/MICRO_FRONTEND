interface IIframe {
    url?: string;
    width?: string;
}

export class Iframe implements IIframe {
    
    constructor(public url: string, public width: string) {

     }

    render(){
        // console.log(this.url)
        return `
        <div>
            <iframe 
            src="${this.url}" 
            title="W3Schools Free Online Web Tutorials"
            allowfullscreen
            style="border:none;position:absolute;top:0;left:0;width:100%;height:100%;" 
            ></iframe>
        </div>
        `;
    }
}
