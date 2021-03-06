class EpisodeObj {
  constructor(id, name, season, number) {
    this.id = id;
    this.name = name;
    this.number = number;
    this.season = season;
  }
}

class ShowObj {
  constructor (id, name, summary, image) {
    this.id = id;
    this.name = name;
    this.summary = summary; 
    this.image = image;
  }
}


async function searchShows(query) {
  // Searches for shows using the tvmaze api

  
  // populate the query string
  const qString = `http://api.tvmaze.com/search/shows?q=${query}`
  

    // make the get request
    let response = await axios.get(qString);

    let parseRes = function(response) {
      // parses the response from the tvmaze api


      // structure to hold query results
      let showArr = []

      let s = new ShowObj(
        response.data[0].show.id,
        response.data[0].show.name,
        response.data[0].show.summary,
        response.data[0].show.image.medium
      )

      showArr.push(s)
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

             <button id="episodes-btn" data-show-id="${show.id}" type="button">Show Episodes</button>
           </div>
         </div>
       </div>
      `
    );

    $showsList.append($item);

    let episodesBtn = document.getElementById('episodes-btn')
    episodesBtn.addEventListener("click", async function(e) {
      e.preventDefault()
      const showId = $(this).attr("data-show-id")
      const episodes = await getEpisodes(showId);
      populateEpisodes(episodes);
      })
  }
}


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
  const qString = `http://api.tvmaze.com/shows/${id}/episodes`


  // make the request
  let response = await axios.get(qString);
 

  // parses response results 
  var parseRes = function (response) {
    // array with results objects
      let episodeArr = []

    let episodeData = response.data
    //create new object using class for each episode
    for (episode of episodeData) {
      let e = new EpisodeObj(
        episode.id,
        episode.name,
        episode.season,
        episode.number,
      );
      episodeArr.push(e)
    }
    return episodeArr
  };
    const episodeArr = parseRes(response)
    return episodeArr;

}

// create new list items for each episode and append to UL 
const populateEpisodes = (episodes) => { 
  const list = document.getElementById('episodes-list')
  const episodeArea = document.getElementById("episodes-area");

  // iterate over episode list
  for (let episode of episodes) {
    let item = document.createElement('li')
    item.innerText = `${episode.name} (season${episode.season}, number ${episode.number})`
    list.append(item)
  }
  // replace UL style hidden with insline 
  episodeArea.style.display = "inline"
}