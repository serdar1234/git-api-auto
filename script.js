class Search {
  constructor() {
    this.app = document.querySelector(".app");
    this.input = this.makeElement("input", "searchField");
    this.repoWrapper = this.makeElement("div", "repoWrapper");

    this.repa = this.makeElement("div", "repa");

    this.app.append(this.input);
    this.app.append(this.repoWrapper);
    this.repoWrapper.append(this.repa);
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
