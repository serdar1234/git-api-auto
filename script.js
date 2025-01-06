class Search {
  constructor() {
    this.app = document.querySelector(".app");
    this.input = this.makeElement("input", "searchField");
    this.repoWrapper = this.makeElement("div", "repoWrapper");

    this.repa = this.makeElement("div", "repa");
    this.statistics = this.makeElement("div", "stats");

    this.svgCross = `<svg height="48" width="48" xmlns="http://www.w3.org/2000/svg">
      <line x1="3" y1="3" x2="42" y2="42" style="stroke:red;stroke-width:4"/>
      <line x1="42" y1="3" x2="3" y2="42" style="stroke:red;stroke-width:4"/>
      </svg>
      `;
    this.encodedSVG = encodeURIComponent(this.svgCross);
    this.dataURL = `data:image/svg+xml,${this.encodedSVG}`;
    this.cross = this.makeElement("img", "cross");
    this.cross.src = this.dataURL;

    this.app.append(this.input);
    this.app.append(this.repoWrapper);
    this.repoWrapper.append(this.repa);
    this.repa.append(this.statistics);
    this.repa.append(this.cross);

    this.input.addEventListener("keyup", this.debouncedSearch());

    const demoText = `Name: react<br>Owner: facebook<br>
    Stars: 145231`;
  }

  debouncedSearch() {
    return debounce(this.searchRepo.bind(this), 500);
  }

  async searchRepo() {
    if (!this.input.value) return;
    return await fetch(
      `https://api.github.com/search/repositories?q=${this.input.value}&sort=stars&order=desc&per_page=5`
    ).then((res) => {
      if (res.ok) {
        res.json().then((res) => {
          res.items.forEach((el) =>
            console.log(el.name, el.owner.login, el.stargazers_count)
          );
        });
      }
    });
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
