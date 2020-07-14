interface IFooter {
    firstName?: string;
    lastName?: string;
}
export class Footer implements IFooter {
    constructor(
        public firstName: string, 
        public lastName: string
        ) {
     }

    render(){
        console.log(this.firstName)
        return `
        <footer class="container">
                <h1 class="my-4 col-sm-4 col-md-2">
                    AGL:
                    ${this.firstName}  ${this.firstName}
                </h1>
        </footer>`;
    }
}