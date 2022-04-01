//offline data implementation
db.enablePersistence().catch(err => {
    if(err.code === 'failed-precondition'){
        //multiple tabs open
        console.log('persistence failed')
    }
    else if(err.code === 'unimplemented'){
        //browser is prob not supported
        console.log('persistence does not work on this browser')
    }
})



// real time event listener
db.collection('recipes').get().then(snapshot => {
    snapshot.docChanges().forEach(change => {
        console.log(change, change.doc.data())
        console.log(change.doc.id)
        if(change.type === 'added'){
            //add the document data to the web page
            renderRecipes(change.doc.data(), change.doc.id)
        }
        if(change.type === 'removed'){
            //remove the document data from the web page
            removeRecipe(change.doc.id);
        }
    })
})


//add data to database from the DOM
const form = document.querySelector('form');

form.addEventListener('submit', evt => {
    evt.preventDefault();

    //add the value of title and ingredients in an object
    const recipe = {
        title: form.title.value,
        ingredients: form.ingredients.value
    }

    //add recipe object into recipes database in firestore
    db.collection('recipes').add(recipe)
    .catch(err => console.log(err))

    form.title.value = '';
    form.ingredients.value = '';

    window.location.reload();
})

//remove data from database 

const recipeContainer = document.querySelector('.recipes')

recipeContainer.addEventListener('click', evt => {

    console.log(evt);
    //get the tagname of I 
    if(evt.target.tagName === 'I'){

        //get each div id 
        const id = evt.target.getAttribute('data-id')

        //delete specified data using the Id
        db.collection('recipes').doc(id).delete()

        window.location.reload();
    }
})