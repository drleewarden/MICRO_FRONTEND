class Template {
    constructor(data){
        this.data = data;
    }
   
    pets(pets){
        return  `
        <div class="animals">
            <div class="group">
                <ul>
                    <li> ${pets.map(pet=> pet.name)}</li>
                </ul>
            </div>
        </div>`
    }

    cardsOrder(person){ 
             // bootstrap card component added to bing some styling
           return `
           <div class="col-lg-4 col-sm-12 mb-4">
           <div class="card h-100">
             <a href="#"><img class="card-img-top" src="../src/assets/Products/${person.productImage}" alt=""></a>
             <div class="card-body">
               <h4 class="card-title">
                 <a href="#">${person.name}</a>
               </h4>
               <h3>${person.gender}</h3>
             
               <div class="row col-sm-12">
               <hr class="col-sm-12">
               </div>
               <p class="card-text col-sm-12"><strong>Pets:</strong>
               ${person.pets != null ? this.pets(person.pets):` No pets`}</p>
               <button type="button" class="btn btn-dark">about ${person.name}</button>
             </div>
           </div>
           </div>`;
    }
    sortAlphabet(arr, merge){
        // merge and sort array
        let manipulatedArray = []
        arr = [].concat.apply([], merge)
        arr.map(catName=>{
            manipulatedArray.push(catName.name)
        })
        manipulatedArray = manipulatedArray.sort();
        return manipulatedArray
    }
    
    render(){
        // variable modifiers
        let cats;
        let catets;
        let males = {};
        males.people = [];
        males.cats = [];
        let females = {};
        females.people = [];
        females.cats = [];
        return `
            <div class="container">
                <div class="my-3">
                <h1>Male</h1>
               
                ${this.data.map(person =>{
                    if(person.gender === 'Male'){
                        males.people.push(person);
                        let malesCats = null; 
                        if(person.pets !== null){
                            malesCats = person.pets.filter(pet => {
                                
                                return pet.type === 'Cat' ? pet.name : ''
                            });
                            males.cats.push(malesCats);
                            
                        }
                                                
                        return this.cardsOrder(person)
                    }
                    }).join('')

            }
            <h3>GUYS WITH CATS:</h3><i> in alphabetical oder:</i>
            <hr>
            <ul>
            ${ 
                this.sortAlphabet(cats, males.cats).map(cat => {
                    return `<li><h4>${cat}</h4></li>`
                }).join('')
               }
               </ul>
            
                <hr>
                </div>
                <br><br>
                <div class="my-3">
                <h1>Female</h1>
               
                ${this.data.map(person =>{
                    if(person.gender === 'Female'){
                        females.people.push(person);
                        let femalesCats = null; 
                        if(person.pets !== null){
                            femalesCats = person.pets.filter(pet => {
                                return pet.type === 'Cat' ? pet.name : ''
                            });

                            females.cats.push(femalesCats);
                            catets = [].concat.apply([], females.cats)
                        }
                                                
                        return this.cardsOrder(person)
                    }
                    }).join('')
                }
                <h3>GIRLS WITH CATS:</h3><i> in alphabetical oder:</i>
                <hr>
                <ul class="pb-3">
                ${  
                    this.sortAlphabet(catets,females.cats).map(cat => {
                        return `<li><h4>${cat}</h4></li>`
                    }).join('')
                   }
                   <ul>
                   <br><br>
                
                </div>
            </div>
        `
    }
    
}
export default Template