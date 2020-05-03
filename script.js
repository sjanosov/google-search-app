const imagesDiv = document.querySelector("#imagesDiv");
const textsDiv = document.querySelector("#textsDiv");
const btnSearch = document.querySelector("#btnSearch");
const searchInput = document.querySelector(".search-input");
const contentContainer = document.querySelector(".content-container");
const btnPrevious = document.querySelector("#btnPrevious");
const btnNext = document.querySelector("#btnNext");
const pageNumber = document.querySelector("#pageNumber");

contentContainer.style = "display: none";
btnPrevious.style = "display: none";
btnNext.style = "display: none";
let startIndex = 1;
let lastQuery;
let apiKey = "AIzaSyCCI0VqrPeTIBNU6Z_hNnyrLOTjufkTpAc";
let customSearchId = "001070535140200413681:8sbflscrdn2";

async function search(query) {
  if (query === "" || query === null || query === undefined) {
    console.log("som tu");
    return;
  }
  let texts = await getTexts(query);
  let images = await getImages(query);
  let nothingFound = texts == undefined && images == undefined;
  if (nothingFound) {
    contentContainer.style = "display: none";
    btnPrevious.style = "display: none";
    btnNext.style = "display: none";

    return;
  } else {
    contentContainer.style = "display: flex";
  }
  appendTexts(texts);
  appendImages(images);
}

function onSearchClick(e) {
  e.preventDefault();
  let doCallout = true;

  if (e.target.id == btnSearch.id) {
    lastQuery = searchInput.value;
    startIndex = 1;
  } else if (lastQuery != searchInput.value) {
    doCallout = false;
  }
  pageNumber.innerHTML = (startIndex - 1) / 10 + 1;

  if (startIndex == 1) {
    btnPrevious.style = "visibility: hidden";
  } else {
    btnPrevious.style = "visibility: visible";
  }
  if (startIndex == 91) {
    btnNext.style = "visibility: hidden";
  } else {
    btnNext.style = "visibility: visible";
  }

  if (doCallout) {
    search(searchInput.value);
  }
}
btnSearch.addEventListener("click", onSearchClick);

function appendImages(imageItems) {
  imagesDiv.innerHTML = "";
  imageItems.forEach((imageItem) => {
    console.log(imageItem);
    imgDiv = document.createElement("div");
    imgDiv.classList.add("image-div");
    if (imageItem.fileFormat == "image/") {
      imgDiv.innerHTML = `<a target="_blank" href=${imageItem.link}><img src=${imageItem.image.thumbnailLink}></img></a>`;
    } else {
      imgDiv.innerHTML = `<a target="_blank" href=${imageItem.link}><img src=${imageItem.link}></img></a>`;
    }
    imagesDiv.appendChild(imgDiv);
  });
}

async function getImages(query) {
  let tmpUrl = new URL("https://www.googleapis.com/customsearch/v1");
  tmpUrl.searchParams.append("key", apiKey);
  tmpUrl.searchParams.append("cx", customSearchId);
  tmpUrl.searchParams.append("q", query);
  tmpUrl.searchParams.append("searchType", "image");
  tmpUrl.searchParams.append("start", startIndex);

  const dataFetch = await fetch(tmpUrl);
  const data = await dataFetch.json();
  return data.items;
}

function appendTexts(textItems) {
  textsDiv.innerHTML = "";
  textItems.forEach((textItem) => {
    let textDiv = document.createElement("div");
    textDiv.classList.add("text-div");
    textDiv.innerHTML = `<p>${textItem.htmlTitle}</p><a target="_blank" href="${textItem.link}">${textItem.link}</a>`;
    textsDiv.appendChild(textDiv);
  });
}

async function getTexts(query) {
  let tmpUrl = new URL("https://www.googleapis.com/customsearch/v1");
  tmpUrl.searchParams.append("key", apiKey);
  tmpUrl.searchParams.append("cx", customSearchId);
  tmpUrl.searchParams.append("q", query);
  tmpUrl.searchParams.append("start", startIndex);
  const dataFetch = await fetch(tmpUrl);
  const data = await dataFetch.json();
  return data.items;
}

function decreasePage(e) {
  startIndex = startIndex - 10;
  onSearchClick(e);
}

function increasePage(e) {
  startIndex = startIndex + 10;
  onSearchClick(e);
}

btnPrevious.addEventListener("click", decreasePage);
btnNext.addEventListener("click", increasePage);
