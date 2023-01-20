"use strict";

const $showsList = $("#shows-list");
const $episodesArea = $("#episodes-area");
const $searchForm = $("#search-form");
const searchBar = document.querySelector('.form-control')


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
    const datatest = await axios.get(' https://api.tvmaze.com/search/shows?', {params: {q: term}})
    const showItems = datatest.data
    var result = [];
    for (let show of showItems){
       let showImage = (show.show.image != null) ? show.show.image.original : "https://clipartix.com/wp-content/uploads/2017/04/Television-clip-art-free-clipart-images-2.png"
        result.push({id: show.show.id, name: show.show.name, summary: show.show.summary, image: showImage })
        }
        return result;
}

/** Given list of shows, create markup for each and to DOM */

 async function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
        `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img 
              src= ${show.image}
              alt="show image" 
              class="w-25 mr-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn" style = "border: 1px solid black">
               View Episodes
             </button>
           </div>
         </div>  
       </div>
      `);

    // add episodes
    //first, define the div to append, then create ul and hide it, then loop through all the episode names for current show and add it to ul, append everything
    let $mediaBlock = $show.first();
    const episodes = await addEpisodes(show.id)
    let $mediaUL = $('<ul>')
    $mediaUL.hide();
    for (let episode of episodes){
        let $episodeName = $('<li>')
        $episodeName.text(episode);
        $mediaUL.append($episodeName);
    }
    $mediaBlock.append($mediaUL);
    $showsList.append($show);
}    
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#search-query").val();
  const shows = await getShowsByTerm(term);
  
  populateShows(shows);
}


$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
  searchBar.value = '';
});



// get an array of episode names for a show given the ID of the show
// this function will be run within populateShows(), which I made async to allow for that
async function addEpisodes(id){
    const episodeArray = [];
    const episodeList = await axios.get(`https://api.tvmaze.com/shows/${id}/episodes`)
    const episodes = episodeList.data
    for (let episode of episodes){
        episodeArray.push(episode.name)
    }
   return episodeArray
}


// toggle display attribute on episode UL
// toggle text within button
$showsList.on('click', '.btn', function(e){
    const containingDiv = e.target.parentElement.parentElement.parentElement;
    const thisList = containingDiv.querySelector('ul');
    if (thisList.style.display != 'none'){
        thisList.style.display = 'none'
        e.target.innerText = 'View Episodes'
    }
    else{
        thisList.style.display = '';
        e.target.innerText = 'Hide Episodes'
    }
})