/*! DSFR v0.5.5 | licence MIT */

const namespace = 'dsfr';

const api = window[namespace] || {};
window[namespace] = api;

const BUTTON_SELECTOR = api.ns.selector('btn');
const BUTTONS_GROUP_SELECTOR = api.ns.selector('btns-group');
const EQUISIZED_BUTTONS_GROUP_SELECTOR = api.ns.selector('btns-group--equisized');

const build = () => {
  const group = document.querySelectorAll(EQUISIZED_BUTTONS_GROUP_SELECTOR);
  const arrayEquisized = [];
  for (let i = 0; i < group.length; i++) {
    arrayEquisized.push(new api.Equisized(BUTTON_SELECTOR, group[i]));
  }
};

/* eslint-disable no-new */

new api.Initializer(BUTTONS_GROUP_SELECTOR, [build]);
//# sourceMappingURL=buttons.module.js.map
