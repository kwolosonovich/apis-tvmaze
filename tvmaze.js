/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
  // Searches for shows using the tvmaze api

  // populate the query string
  const qString = `http://api.tvmaze.com/search/shows?q=${query}`
  

    // make the get request
    let response = await axios.get(qString);

    var parseRes = function(response) {
      // parses the response from the tvmaze api


      // structure to hold query results
      let showArr = [
        {
          id: undefined,
          name: undefined,
          summary: undefined,
          image: "images/default.png",
        },
      ];

      // assign attributes to the object
      let id = response.data[0].show.id;
      let name = response.data[0].show.name;
      let summary = response.data[0].show.summary;
      let image = response.data[0].show.image.medium
      showArr[0].id = id;
      showArr[0].name = name 
      showArr[0].summary = summary
      showArr[0].image = image
      return showArr
    }

    // get the query results
    var showArr = parseRes(response)

    return showArr
}

/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
         <img class="card-img-top" src="${show.image}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>

             <button id="episodes-btn" type="button">Show Episodes</button>
           </div>
         </div>
       </div>
      `
    );

    $showsList.append($item);
    // const episodesBtn = document.getElementById('episodes-btn')
    // episodesBtn.addEventListener('click', function(e) {
    //   e.preventDefault()
    //   appen
    // })

  }
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);
  populateShows(shows);
});


async function getEpisodes(id) {
  // searches the api for show episodes using the show ID
  let qString = `http://api.tvmaze.com/shows/${show_id}/episodes`

  // make the request
  let response = await axios.get(qString);


  // parses response results 
  var parseRes = function (response) {
    // array with an object to hold results
    let episodesArr = [
      {
        id: undefined,
        name: undefined,
        season: undefined,
        number: undefined,
      },
    ];


    // assign atributes to the object
    let id = response.data[0].id;
    let name = response.data[0].name;
    let season = response.data[0].season;
    let number = response.data[0].number;
    episodesArr[0].id = id;
    episodesArr[0].name = name;
    episodesArr[0].season = season;
    episodesArr[0].number = number;
    return episodesArr;
  };

  // get results
  const getEpisodes = parseRes(response)
  return getEpisodes
}

const populateEpisodes = () => {

}