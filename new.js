// sfortunatamente ho preso di mia spontanea volontà la decisione di svolgere l'esercizio creando un search e sfruttare il localStorage per mantenere 
// le mie preferenze.... inutile dire che questo weekend non ho fatto altro che scervellarmi per farlo funzionare.
// ovviamente il carosello di bootstrap non poteva funzionare normalmente di conseguenza gli album si possono aggiungere con il "+"
// ma non rimangono salvati :(, comunque avrei messo selling england by the pound, Wish You Were Here e probabilmente Toxicity



const API_STRIVES_SCHOOL = `https://striveschool-api.herokuapp.com/api/deezer/search`

window.onload = (event) => {
    if (!localStorage.getItem("favourites")) {
        localStorage.setItem("favourites", "[]")
    }
    if (!localStorage.getItem("favourites1")) {
        localStorage.setItem("favourites1", "[]")
    }
    renderFavouritesArtist()
    renderFavouritesSongs()
};

function handleSearchOnClick (){
    document.querySelector('.containerJs1').innerHTML = " "
    let form1Text = document.getElementById("form1").value
    let queryToSearch = API_STRIVES_SCHOOL + '?q=' + form1Text
    
    //console.log(queryToSearch);
    songSearch(queryToSearch)
}

const songSearch = (input) => {
    fetch(input)
    .then((res) => {
        if (res.ok) {
            return res.json();
        } else {
            console.error("la richiesta non e andata a buon fine");
        }
    })
    .then((jsonPromise) => {
        let data = jsonPromise.data;
        console.log(data);
        data.forEach(element => {
            let listReference = document.querySelector('.containerJs1')
            listReference.innerHTML += containerAlbum(
                element.title_short,
                element.album.cover_big,
                element.artist.name,
                element.album.title,
                element.artist.picture
            )
        })
    })
}

function containerAlbum(songTitle, albumCover, artistName, albumtitle, artistPicture) {
    return `
    <div class="classCont col-12 col-md-3 text-light">
        <div class="card shadow my-3 position-relative border-0 bg-dark m-3" >
            <h5 class="card-title fw-bold m-3 text-center h-25">${songTitle}</h5>
            <img src=${albumCover} class="card-img-top w-100 border-3">
            <button class=" border-0 artist position-absolute badge rounded-rounded bg-success end-0 bottom-0 fs-6 m-2 text-light" onclick='handleArtistFunc("${songTitle}", "${artistName}", "${albumCover}")'>Add Album</button>
            <button class=" border-0 song position-absolute badge rounded-rounded bg-danger start-0 bottom-0 fs-6 m-2 text-light" onclick='handleSongsFunc("${songTitle}", "${artistName}", "${albumCover}")'>Add song</button>
            <button class=" border-0 album position-absolute badge rounded-rounded bg-primary end-0 top-0 fs-6 my-5 text-light" onclick='handleCauroselFunc("${songTitle}", "${artistName}", "${albumCover}")'>+</button>
            <div class="d-flex">
                <div class="col-6">
                    <h5 class="card-title text-primary fw-bold my-4 text-center">${artistName}</h5>
                    <h5 class="card-title fs-6 my-3 text-center">${albumtitle}</h5>
                </div>
                <img class="col-6 my-4" src=${artistPicture}>
            </div>
        </div>
    </div>`
}

function handleArtistFunc(title, name, cover, insert = 1, elIndex = -1) {
    let favId = `id="fav${elIndex}"`
    if (elIndex === -1){
        let favv = localStorage.getItem("favourites")
        favv = JSON.parse(favv)
        elIndex = favv.length 
        favId = `id="fav${elIndex}"`
        console.log(favId);
    }
    if (insert) {
        addFavourite([title, name, cover])
    }
    let artists = document.querySelector('.favArtist');
    artists.innerHTML += `
    <div class=" classCont col-6 col-md-3 m-4 d-flex flex-wrap" ${favId}>
      <div class="card shadow my-3 position-relative border-0" >
      <button class="album position-absolute badge rounded-rounded bg-primary end-0 top-0 fs-6 text-light" onclick='removeFavourite(${elIndex})'>X</button>
        <h5 class="card-title fw-bold m-4 text-center">${title}</h5>
        <img class="col-6 mt-3 w-100" src=${cover}>
        <h5 class="card-title m-1 text-center">${name}</h5>
      </div>
    </div>
    `
}

function handleSongsFunc(title, name, cover, insert = 1, elIndex = -1) {
    let favId = `id="favour${elIndex}"`
    if (elIndex === -1){
        let favv = localStorage.getItem("favourites1")
        favv = JSON.parse(favv)
        elIndex = favv.length
        console.log(elIndex);
        favId = `id="favour${elIndex}"`
    }
    if (insert) {
        addFavourite1([title, name, cover])
    } 
    let songs = document.querySelector('.favSong');
    songs.innerHTML += `
    <div class=" classCont col-4 col-md-3 mx-2 d-flex" ${favId}>
      <div class="card shadow my-3 position-relative border-0" >
      <button class="album position-absolute badge rounded-rounded bg-primary ms-50 fs-6 my-5 text-light" onclick='removeFavourite1(${elIndex})'>X</button>
        <h5 class="card-title fw-bold m-3 text-center h-25">Song Title: ${title}</h5>
        <h5 class="card-title fw-bold m-3 text-center h-25">Artist: ${name}</h5>
        <div class="d-flex">
            <img class="col-6 my-4" src=${cover}>
        </div>
      </div>
    </div>
    `
}

function handleCauroselFunc(title, name, cover, insert = 1, elIndex = -1) {
    if (insert) {
        addFavourite([title, name, cover])
    } 
    if (elIndex === -1){
        let favv = localStorage.getItem("favourites")
        favv = JSON.parse(favv)
        elIndex = favv.length
        console.log(elIndex);
        var favId = `id="car${elIndex}"`
    }
    let carousel = document.querySelector('.carousel-inner');
    carousel.innerHTML += `
    <div class="carousel-item active" ${favId}>
        <img src="${cover}" class="d-block w-100">
        <div class="carousel-caption d-none d-md-block">
          <h5 class="bg-dark-subtle">${name}</h5>
          <p class="bg-dark-subtle">${title}</p>
        </div>
    </div>
    `
}

function addFavourite(arr) {
    let favourites = JSON.parse(localStorage.getItem("favourites"))
    favourites.push(arr)
    localStorage.setItem("favourites", JSON.stringify(favourites))
}
function addFavourite1(arr) {
    let favourites = JSON.parse(localStorage.getItem("favourites1"))
    favourites.push(arr)
    localStorage.setItem("favourites1", JSON.stringify(favourites))
}

function renderFavouritesArtist() {
    let fav = JSON.parse(localStorage.getItem("favourites"))
    fav.forEach((element, i) => {
        let title = element[0]
        let name = element[1]
        let cover = element[2]
        handleArtistFunc(title, name, cover, 0, i)
    });
}
function renderFavouritesSongs() {
    let fav = JSON.parse(localStorage.getItem("favourites1"))
    fav.forEach((element, i) => {
        let title = element[0]
        let name = element[1]
        let cover = element[2]
        handleSongsFunc(title, name, cover, 0, i)
    });
}

function removeFavourite(elIndex) {
    if (elIndex === -1){
        return
    } 
    document.getElementById(`fav${elIndex}`).remove()
    let session = localStorage.getItem("favourites")
    let favs = JSON.parse(session)
    favs.splice(elIndex, 1)
    console.log(favs);
    localStorage.setItem("favourites", JSON.stringify(favs))
    window.location.reload()
}

function removeFavourite1(elIndex) {
    if (elIndex === -1){
        return
    } 
    document.getElementById(`favour${elIndex}`).remove()
    let session1 = localStorage.getItem("favourites1")
    let favs = JSON.parse(session1)
    favs.splice(elIndex, 1)
    console.log(favs);
    localStorage.setItem("favourites1", JSON.stringify(favs))
    window.location.reload()
}
