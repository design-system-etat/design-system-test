/*! DSFR v0.5.5 | licence MIT */

const namespace = 'dsfr';

const api = window[namespace] || {};
window[namespace] = api;

const HEADER_SELECTOR = api.ns.selector('header');
const HEADER_TOOLS_SELECTOR = api.ns.selector('header__tools');
const HEADER_SEARCH_BAR_SELECTOR = `${HEADER_TOOLS_SELECTOR} ${api.ns.selector('search-bar')}`;
const HEADER_SHORTCUTS_SELECTOR = `${HEADER_TOOLS_SELECTOR} ${api.ns.selector('shortcuts')}`;
const HEADER_NAV_SELECTOR = api.ns.selector('nav');
const HEADER_NAV_LIST_SELECTOR = `${HEADER_NAV_SELECTOR} ${api.ns.selector('nav__list')}`;

let count = 0;

class Header {
  constructor (header) {
    this.header = header || document.querySelector(HEADER_SELECTOR);
    this.numId = count;
    count++;

    this.init();
  }

  init () {
    this.popins = [];

    this.tools = this.header.querySelector(HEADER_TOOLS_SELECTOR);

    this.searchBar = this.header.querySelector(HEADER_SEARCH_BAR_SELECTOR);

    this.nav = this.header.querySelector(HEADER_NAV_SELECTOR);

    this.shortcuts = this.header.querySelector(HEADER_SHORTCUTS_SELECTOR);

    this.navList = this.header.querySelector(HEADER_NAV_LIST_SELECTOR);

    this.changing = this.change.bind(this);

    window.addEventListener('resize', this.changing);
    window.addEventListener('orientationchange', this.changing);
    this.change();
  }

  change () {
    this.isLarge = window.matchMedia('(min-width: 62em)').matches;

    for (let i = 0; i < this.popins.length; i++) this.popins[i].change(this.isLarge);

    if (this.shortcuts !== null) {
      if (this.isLarge) {
        if (this.searchBar !== null) this.tools.insertBefore(this.shortcuts, this.searchBar);
        else this.tools.appendChild(this.shortcuts);
      } else {
        this.nav.insertBefore(this.shortcuts, this.navList);
      }
    }
  }
}

api.Header = Header;

const build = () => {
  const elements = Array.prototype.slice.call(document.querySelectorAll(HEADER_SELECTOR));

  const headers = [];

  for (const element of elements) headers.push(new Header(element));
};

/* eslint-disable no-new */

new api.Initializer(HEADER_SELECTOR, [build]);
//# sourceMappingURL=header.module.js.map
