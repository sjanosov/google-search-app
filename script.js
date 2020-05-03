const imagesDiv = document.querySelector("#imagesDiv");
const textsDiv = document.querySelector("#textsDiv");
const searchButton = document.querySelector(".search-button");
const searchInput = document.querySelector(".search-input");

async function search(query) {
  if (query === "" || query === null || query === undefined) {
    console.log("som tu");
    return;
  }
  let texts = await getTexts(query);
  let images = await getImages(query);

  appendTexts(texts);
  appendImages(images);
}
function onSearchClick(e) {
  e.preventDefault();
  search(searchInput.value);
}
searchButton.addEventListener("click", onSearchClick);

function appendImages(imageItems) {
  imagesDiv.innerHTML = "";
  imageItems.forEach((imageItem) => {
    console.log(imageItem);
    imgDiv = document.createElement("div");
    imgDiv.classList.add("image-div");
    imgDiv.innerHTML = `<img src=${imageItem.link}></img>`;
    imagesDiv.appendChild(imgDiv);
  });
}

async function getImages(query) {
  const dataFetch = await fetch(
    `https://www.googleapis.com/customsearch/v1?key=AIzaSyAzyZzUoVr7f9bT3I2w670FU4I5JawGIsw&cx=013951971749308929015:shiobss27n3&q=${query}&searchType=image`
  );
  const data = await dataFetch.json();
  return data.items;
}

function appendTexts(textItems) {
  textsDiv.innerHTML = "";
  textItems.forEach((textItem) => {
    let textDiv = document.createElement("div");
    textDiv.classList.add("text-div");
    textDiv.innerHTML = `<p>${textItem.htmlTitle}</p><a href="${textItem.link}">${textItem.link}</a>`;
    textsDiv.appendChild(textDiv);
  });
}

async function getTexts(query) {
  console.log(query);

  const dataFetch = await fetch(
    `https://www.googleapis.com/customsearch/v1?key=AIzaSyAzyZzUoVr7f9bT3I2w670FU4I5JawGIsw&cx=013951971749308929015:shiobss27n3&q=${query}&sort=date`
  );
  const data = await dataFetch.json();
  return data.items;
}
getTexts();
