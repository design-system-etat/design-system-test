/*! DSFR v0.5.5 | licence MIT */

(function () {
  'use strict';

  var namespace = 'dsfr';

  var api = window[namespace] || {};
  window[namespace] = api;

  var ACCORDIONS_GROUP = api.ns('accordions-group');
  var ACCORDION_ASCENDANT = api.ns('accordion');

  var AccordionsGroup = /*@__PURE__*/(function (superclass) {
    function AccordionsGroup () {
      superclass.apply(this, arguments);
    }

    if ( superclass ) AccordionsGroup.__proto__ = superclass;
    AccordionsGroup.prototype = Object.create( superclass && superclass.prototype );
    AccordionsGroup.prototype.constructor = AccordionsGroup;

    var prototypeAccessors = { focusIndex: { configurable: true } };
    var staticAccessors = { selector: { configurable: true } };

    AccordionsGroup.prototype._attachEvents = function _attachEvents () {
      this.keyEvents = new api.KeyListener(this.element);
      this.keyEvents.down(api.KeyListener.DOWN, this.arrowDownPress.bind(this), true, true);
      this.keyEvents.down(api.KeyListener.UP, this.arrowUpPress.bind(this), true, true);
      this.keyEvents.down(api.KeyListener.HOME, this.homePress.bind(this), true, true);
      this.keyEvents.down(api.KeyListener.END, this.endPress.bind(this), true, true);
    };

    prototypeAccessors.focusIndex.get = function () {
      for (var i = 0; i < this.members.length; i++) { if (this.members[i].buttonHasFocus) { return i; } }
      return -1;
    };

    /**
     * Selectionne l'element suivant de la liste si on est sur un bouton
     * Si on est à la fin on retourne au début
     */
    AccordionsGroup.prototype.arrowDownPress = function arrowDownPress () {
      var index = this.focusIndex;
      if (index === -1) { return; }
      index++;
      if (index >= this.length) { index = 0; }
      this.members[index].focus();
    };
    /**
     * Selectionne l'element précédent de la liste si on est sur un bouton
     * Si on est au debut retourne a la fin
     */
    AccordionsGroup.prototype.arrowUpPress = function arrowUpPress () {
      var index = this.focusIndex;
      if (index === -1) { return; }
      index--;
      if (index < 0) { index = this.length - 1; }
      this.members[index].focus();
    };
    /**
     * Selectionne le permier element de la liste si on est sur un bouton
     */
    AccordionsGroup.prototype.homePress = function homePress () {
      if (this.focusIndex === -1) { return; }
      this.members[0].focus();
    };
    /**
     * Selectionne le dernier element de la liste si on est sur un bouton
     */
    AccordionsGroup.prototype.endPress = function endPress () {
      if (this.focusIndex === -1) { return; }
      this.members[this.length - 1].focus();
    };
    staticAccessors.selector.get = function () { return ACCORDIONS_GROUP; };

    AccordionsGroup.prototype.apply = function apply () {
      superclass.prototype.apply.call(this);
      if (this.current !== null) { this.current.focus(); }
    };

    Object.defineProperties( AccordionsGroup.prototype, prototypeAccessors );
    Object.defineProperties( AccordionsGroup, staticAccessors );

    return AccordionsGroup;
  }(api.CollapsesGroup));

  api.AccordionsGroup = AccordionsGroup;

  api.CollapsesGroup.register(ACCORDION_ASCENDANT, AccordionsGroup);

}());
//# sourceMappingURL=accordions.nomodule.js.map
