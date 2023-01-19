const search = document.querySelector('#search'); 
const form = document.querySelector('form');
const subButton = document.querySelector('#submit');
const results = document.querySelector('#results');
const clear = document.querySelector('#clear')
async function getter(searchTerm){
    const gifList =  await axios.get('http://api.giphy.com/v1/gifs/search', ({params:{q: searchTerm, api_key: 'MhAodEJIJxQMxW9XqxKjyXfNYdLoOIym'}}))
    console.log(gifList.data.data[1])
    return gifList.data.data[1].images.original.url;
}



const submitForm = form.addEventListener('submit',  async function(){
    const input = search.value;
    search.value = '';
    const getterInput = await getter(input);
    addImage(getterInput);
})
subButton.addEventListener('click', submitForm);
clear.addEventListener('click', function(){
    results.innerHTML = '';
})

function addImage(url){
    const newGif = document.createElement('img')
    newGif.setAttribute('src', url)
    results.appendChild(newGif);

}