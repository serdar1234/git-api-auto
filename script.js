class Search {
  constructor() {
    this.app = document.querySelector(".app");
    this.input = makeElement("input", "searchField");
    this.input.type = "text";
    this.input.autofocus = true;
    this.autocomplete = makeElement("ul", "autocomplete");
    this.repoWrapper = makeElement("div", "repoWrapper");
    this.githubSearchObject = null;

    this.svgCross = `<svg height="48" width="48" xmlns="http://www.w3.org/2000/svg">
      <line x1="3" y1="3" x2="42" y2="42" style="stroke:red;stroke-width:4"/>
      <line x1="42" y1="3" x2="3" y2="42" style="stroke:red;stroke-width:4"/>
      </svg>
      `;
    this.encodedSVG = encodeURIComponent(this.svgCross);
    this.dataURL = `data:image/svg+xml,${this.encodedSVG}`;

    this.app.append(this.input);
    this.app.append(this.autocomplete);
    this.app.append(this.repoWrapper);

    this.input.addEventListener("input", this.debouncedSearch());
    this.autocomplete.addEventListener("click", onLiClick.bind(this));
  }

  debouncedSearch() {
    return debounce(this.searchRepo.bind(this), 500);
  }

  async searchRepo() {
    const inputTrimmed = this.input.value.trimStart();
    if (!this.input.value || !inputTrimmed.length) {
      this.autocomplete.textContent = "";
      return;
    }

    try {
      const githubSearchJSONstring = await fetch(
        `https://api.github.com/search/repositories?q=${encodeURIComponent(
          inputTrimmed
        )}&sort=stars&order=desc&per_page=5`
      );

      if (!githubSearchJSONstring.ok) {
        throw new Error(`HTTP error: ${githubSearchJSONstring.status}`);
      }

      this.githubSearchObject = await githubSearchJSONstring.json();
      if (this.autocomplete) this.autocomplete.textContent = "";
      this.githubSearchObject.items.forEach((el) => {
        this.autocomplete__item = makeElement("li");
        this.autocomplete__item.innerHTML = el.name;
        this.autocomplete.append(this.autocomplete__item);
      });
    } catch (error) {
      console.error("Error:", error);
    }
  }
}

new Search();

function onLiClick(evt) {
  const targetLi = evt.target.closest("li");

  this.repa = makeElement("div", "repa");
  this.stats = makeElement("div", "stats");
  const repoWrapper = document.querySelector(".repoWrapper");
  repoWrapper.append(this.repa);
  this.repa.append(this.stats);
  this.cross = makeElement("img", "cross");
  this.cross.src = this.dataURL;
  this.repa.append(this.cross);
  this.cross.addEventListener("click", removeLiElement);

  const targetObj = this.githubSearchObject.items.find(
    (repo) => repo.name === targetLi.textContent
  );
  this.stats.insertAdjacentHTML(
    "beforeend",
    `
    <p>Name: ${targetObj.name}<br />
    Owner: ${targetObj.owner.login}<br />
    Stars: ${targetObj.stargazers_count}</p>
    `
  );
}

function makeElement(tagName, className) {
  const newElement = document.createElement(tagName);

  if (className) {
    newElement.classList.add(className);
  }
  return newElement;
}

function removeLiElement(evt) {
  const targetLi = evt.target.closest(".repa");
  targetLi.remove();
}

function debounce(fn, ms) {
  let timerID = null;

  return function wrapper() {
    const wrappedFn = () => fn.apply(this);
    clearTimeout(timerID);
    timerID = setTimeout(wrappedFn, ms);
  };
}
