class Search {
  constructor() {
    this.app = document.querySelector(".app");
    this.input = this.makeElement("input", "searchField");
    this.autocomplete = this.makeElement("ul", "autocomplete");
    this.repoWrapper = this.makeElement("div", "repoWrapper");

    this.svgCross = `<svg height="48" width="48" xmlns="http://www.w3.org/2000/svg">
      <line x1="3" y1="3" x2="42" y2="42" style="stroke:red;stroke-width:4"/>
      <line x1="42" y1="3" x2="3" y2="42" style="stroke:red;stroke-width:4"/>
      </svg>`;
    this.encodedSVG = encodeURIComponent(this.svgCross);
    this.dataURL = `data:image/svg+xml,${this.encodedSVG}`;

    this.app.append(this.input);
    this.app.append(this.autocomplete);
    this.app.append(this.repoWrapper);

    this.debouncedSearch = debounce(this.searchRepo.bind(this), 500);
    this.input.addEventListener("input", this.debouncedSearch);
  }

  async searchRepo() {
    const inputTrimmed = this.input.value.trimStart(); // input has leading spaces?
    if (!inputTrimmed.length) {
      this.autocomplete.textContent = "";
      return;
    }

    try {
      const response = await fetch(
        `https://api.github.com/search/repositories?q=${encodeURIComponent(
          inputTrimmed
        )}&sort=stars&order=desc&per_page=5`
      );

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const githubSearchObject = await response.json();
      this.autocomplete.textContent = "";

      githubSearchObject.items.forEach((el) => {
        const li = this.makeElement("li");
        li.innerHTML = el.name;
        li.setAttribute("data-name", el.name); // Store repo name in a data attribute
        this.autocomplete.append(li);
      });

      // this.autocomplete.replaceWith(this.autocomplete.cloneNode(true)); // delete old event listeners
      this.autocomplete.addEventListener("click", async (evt) => {
        const targetLi = evt.target.closest("li");
        if (!targetLi) return;

        this.repa = this.makeElement("div", "repa");
        this.stats = this.makeElement("div", "stats");
        this.cross = this.makeElement("img", "cross");
        this.cross.src = this.dataURL;

        this.repoWrapper.append(this.repa);
        this.repa.append(this.stats);
        this.repa.append(this.cross);

        const targetRepoName = targetLi.getAttribute("data-name");
        const targetObj = githubSearchObject.items.find(
          (item) => item.name === targetRepoName
        );

        this.stats.insertAdjacentHTML(
          "beforeend",
          `
          <p>Name: ${targetObj.name}<br />
          Owner: ${targetObj.owner.login}<br />
          Stars: ${targetObj.stargazers_count}</p>
          `
        );
      });
    } catch (error) {
      console.error("Error:", error);
    }
  }

  makeElement(tagName, className) {
    const newElement = document.createElement(tagName);
    if (className) {
      newElement.classList.add(className);
    }
    return newElement;
  }
}

new Search();

function debounce(fn, ms) {
  let timerID = null;

  return function wrapper() {
    const wrappedFn = () => fn.apply(this);
    clearTimeout(timerID);
    timerID = setTimeout(wrappedFn, ms);
  };
}
