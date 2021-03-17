/*! DSFR v0.5.5 | licence MIT */

(function () {
  'use strict';

  var namespace = 'dsfr';

  var api = window[namespace] || {};
  window[namespace] = api;

  var BUTTON_SELECTOR = api.ns.selector('btn');
  var BUTTONS_GROUP_SELECTOR = api.ns.selector('btns-group');
  var EQUISIZED_BUTTONS_GROUP_SELECTOR = api.ns.selector('btns-group--equisized');

  var build = function () {
    var group = document.querySelectorAll(EQUISIZED_BUTTONS_GROUP_SELECTOR);
    var arrayEquisized = [];
    for (var i = 0; i < group.length; i++) {
      arrayEquisized.push(new api.Equisized(BUTTON_SELECTOR, group[i]));
    }
  };

  /* eslint-disable no-new */

  new api.Initializer(BUTTONS_GROUP_SELECTOR, [build]);

}());
//# sourceMappingURL=buttons.nomodule.js.map
