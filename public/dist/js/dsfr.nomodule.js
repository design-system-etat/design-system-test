/*! DSFR v0.5.5 | licence MIT */

(function () {
  'use strict';

  var prefix = 'rf';
  var namespace = 'dsfr';

  var api = window[namespace] || {};
  window[namespace] = api;

  var ns = function (name) {
    return (prefix + "-" + name);
  };

  ns.selector = function (name, notation) {
    if (notation === undefined) { notation = '.'; }
    return ("" + notation + (ns(name)));
  };

  ns.attr = function (name, quoted, value) {
    return ("data-" + (ns(name)));
  };

  ns.attr.selector = function (name, value) {
    var result = ns.attr(name);
    if (value !== undefined) { result += "=\"" + value + "\""; }
    return ("[" + result + "]");
  };

  var modifiyClass = function (element, className, remove) {
    if (className.charAt(0) === '.') { className = className.substr(1); }
    var classNames = element.className.split(' ');
    var index = classNames.indexOf(className);
    if (remove === true) {
      if (index > -1) { classNames.splice(index, 1); }
    } else if (index === -1) { classNames.push(className); }
    element.className = classNames.join(' ');
  };

  var addClass = function (element, className) { return modifiyClass(element, className); };

  var removeClass = function (element, className) { return modifiyClass(element, className, true); };

  var Renderer = function Renderer () {
    this.closures = [];
    this.nexts = [];
    this.rendering = this.render.bind(this);
    this.render();
  };

  Renderer.prototype.add = function add (closure) {
      var this$1 = this;

    this.closures.push(closure);
    var remove = function () {
      var index = this$1.closures.indexOf(closure);
      if (index !== -1) { this$1.closures.splice(index, 1); }
    };
    return remove;
  };

  Renderer.prototype.next = function next (closure) {
    this.nexts.push(closure);
  };

  Renderer.prototype.render = function render () {
    window.requestAnimationFrame(this.rendering);
    for (var i = 0, list = this.closures; i < list.length; i += 1) {
        var closure = list[i];

        closure.call();
      }
    var nexts = this.nexts.slice();
    this.nexts.length = 0;
    for (var i$1 = 0, list$1 = nexts; i$1 < list$1.length; i$1 += 1) {
        var closure$1 = list$1[i$1];

        closure$1.call();
      }
  };

  // TODO: initializer et renderer en 1, avec muttation observer pour ajouter et retirer les instances des objets attendus en fonctions de selecteurs spécifiques
  var Engine = function Engine () {
    this.renderer = new Renderer();
    // this.instantier = new Instancier();
  };

  Engine.prototype.register = function register (selector, factory) {

  };

  Engine.prototype.start = function start () {
    // this.renderer.start();
  };

  Engine.prototype.stop = function stop () {
    // this.renderer.stop();
  };

  var engine = new Engine();

  var Initializer = function Initializer (selector, builders) {
    this.selector = selector;
    this.builders = builders;
    this.instances = [];

    if (document.readyState !== 'loading') { window.requestAnimationFrame(this.start.bind(this)); }
    else { document.addEventListener('DOMContentLoaded', this.start.bind(this)); }
  };

  Initializer.prototype.start = function start () {
    if (this.instances.length > 0) { return; }

    if (document.querySelectorAll(this.selector).length > 0) {
      for (var i = 0; i < this.builders.length; i++) {
        this.instances.push(this.builders[i]());
      }
    }
  };

  /**
   * Utilitaire de gestion des évenements clavier
   * Utiliser KeyListener.add() pour ajouter un event listener
   */
  var KeyListener = function KeyListener (element) {
    this.element = element;
    this.collections = {};
  };

  /**
   * key: la touche de clavier
   * closure: la function à appliquer
   * type: event type, optionnel, si c'est en down, up ou press
   * stopPropagation: Boolean, permet d'empêcher le comportement par default de l'evenement
   */
  KeyListener.prototype._add = function _add (type, action) {
    if (this.collections[type] === undefined) { this.collections[type] = new KeyActionCollection(type, this.element); }
    this.collections[type].add(action);
  };

  KeyListener.prototype.down = function down (key, closure, preventDefault, stopPropagation) {
    this._add('down', new KeyAction(key, closure, preventDefault, stopPropagation));
  };

  KeyListener.prototype.up = function up (key, closure, preventDefault, stopPropagation) {
    this._add('up', new KeyAction(key, closure, preventDefault, stopPropagation));
  };

  KeyListener.prototype.dispose = function dispose () {
    for (var i = 0, list = this.collections; i < list.length; i += 1) {
        var collection = list[i];

        collection.dispose();
      }
    this.types = null;
  };

  var KeyActionCollection = function KeyActionCollection (type, element) {
    this.type = type;
    this.element = element;
    this.actions = [];
    this.binding = this.handle.bind(this);
    this.element.addEventListener('key' + type, this.binding);
  };

  KeyActionCollection.prototype.add = function add (action) {
    this.actions.push(action);
  };

  KeyActionCollection.prototype.handle = function handle (e) {
    for (var i = 0, list = this.actions; i < list.length; i += 1) {
        var action = list[i];

        action.handle(e);
      }
  };

  KeyActionCollection.prototype.dispose = function dispose () {
    this.element.removeEventListener('key' + this.type, this.binding);
    this.actions = null;
  };

  var KeyAction = function KeyAction (key, closure, preventDefault, stopPropagation) {
    this.key = key;
    this.closure = closure;
    this.preventDefault = preventDefault === true;
    this.stopPropagation = stopPropagation === true;
  };

  KeyAction.prototype.handle = function handle (e) {
    if (e.keyCode === this.key) {
      this.closure(e);
      if (this.preventDefault) {
        e.preventDefault();
      }
      if (this.stopPropagation) {
        e.stopPropagation();
      }
    }
  };

  KeyListener.TAB = 9;
  KeyListener.ESCAPE = 27;
  KeyListener.END = 35;
  KeyListener.HOME = 36;
  KeyListener.LEFT = 37;
  KeyListener.UP = 38;
  KeyListener.RIGHT = 39;
  KeyListener.DOWN = 40;

  var GROUP_ATTR = ns.attr('group');

  var groups = [];

  var DisclosuresGroup = function DisclosuresGroup (id, element) {
    this.id = id;
    this.element = element;
    this.members = [];
    this._index = -1;
    this._current = null;
    groups.push(this);
  };

  var prototypeAccessors$3 = { length: { configurable: true },index: { configurable: true },current: { configurable: true } };
  var staticAccessors$1 = { selector: { configurable: true } };

  DisclosuresGroup.getGroupById = function getGroupById (id) {
    for (var i = 0, list = groups; i < list.length; i += 1) {
        var group = list[i];

        if (group.constructor === this && group.id === id) { return group;
      } }
    return new this(id);
  };

  DisclosuresGroup.getGroupByElement = function getGroupByElement (element) {
    for (var i = 0, list = groups; i < list.length; i += 1) {
        var group = list[i];

        if (group.element === element) { return group;
      } }
    return new this(false, element);
  };

  DisclosuresGroup.groupById = function groupById (member, groupConstructor) {
    var id = member.element.getAttribute(GROUP_ATTR);
    if (id === null) { return; }

    var group = groupConstructor.getGroupById(id);
    group.add(member);
  };

  DisclosuresGroup.groupByParent = function groupByParent (member, GroupConstructor, groupSelector) {
    if (groupSelector === undefined) { groupSelector = GroupConstructor.selector; }
    if (groupSelector === '') { return; }
    var element = member.element.parentElement;

    while (element) {
      if (element.classList.contains(member.constructor.selector)) { return; }

      if (element.classList.contains(groupSelector)) {
        var group = GroupConstructor.getGroupByElement(element);
        group.add(member);
        return;
      }
      element = element.parentElement;
    }
  };

  staticAccessors$1.selector.get = function () { return ''; };

  DisclosuresGroup.prototype.add = function add (member) {
    if (this.members.indexOf(member) !== -1) { return; }
    this.members.push(member);
    member.setGroup(this);

    switch (true) {
      case this.current !== null:
      case !member.disclosed:
        member.apply(false, true);
        break;

      default:
        this._current = member;
        this._index = this.members.indexOf(member);
        member.apply(true, true);
    }
  };

  prototypeAccessors$3.length.get = function () { return this.members.length; };

  prototypeAccessors$3.index.get = function () { return this._index; };

  prototypeAccessors$3.index.set = function (value) {
    if (value < -1 || value >= this.length || this._index === value) { return; }
    if (this.current !== null) { this.current.apply(false); }
    this._index = value;
    this._current = this._index > -1 ? this.members[this._index] : null;
    if (this.current !== null) { this.current.apply(true); }
    this.apply();
  };

  prototypeAccessors$3.current.get = function () { return this._current; };

  prototypeAccessors$3.current.set = function (member) {
    this.index = this.members.indexOf(member);
  };

  DisclosuresGroup.prototype.apply = function apply () {};

  Object.defineProperties( DisclosuresGroup.prototype, prototypeAccessors$3 );
  Object.defineProperties( DisclosuresGroup, staticAccessors$1 );

  var DisclosureButton = function DisclosureButton (element, disclosure) {
    this.element = element;
    this.disclosure = disclosure;
    this.hasAttribute = this.element.hasAttribute(this.disclosure.attributeName);
    this.element.addEventListener('click', this.click.bind(this));
    this.observer = new MutationObserver(this.mutate.bind(this));
    this.observe();
  };

  var prototypeAccessors$2 = { disclosed: { configurable: true } };

  DisclosureButton.prototype.observe = function observe () {
    this.observer.observe(this.element, { attributes: true });
  };

  DisclosureButton.prototype.click = function click (e) {
    this.disclosure.change(this.hasAttribute);
  };

  DisclosureButton.prototype.mutate = function mutate (mutations) {
      var this$1 = this;

    mutations.forEach(function (mutation) {
      if (mutation.type === 'attributes' && mutation.attributeName === this$1.disclosure.attributeName) { this$1.disclosure.change(this$1.disclosed); }
    });
  };

  DisclosureButton.prototype.apply = function apply (value) {
    if (!this.hasAttribute) { return; }
    if (this.observer) { this.observer.disconnect(); }
    this.element.setAttribute(this.disclosure.attributeName, value);
    if (this.observer) { this.observe(); }
  };

  prototypeAccessors$2.disclosed.get = function () {
    return this.element.getAttribute(this.disclosure.attributeName) === 'true';
  };

  Object.defineProperties( DisclosureButton.prototype, prototypeAccessors$2 );

  var disclosures = [];

  var Disclosure = function Disclosure (element) {
    this.element = element;
    this.id = element.id;
    this.buttons = [];
    this.disclosed = null;
    this._selector = this.constructor.selector;
    this.modifier = this._selector + '--' + this.type.id;
    this.attributeName = this.type.aria ? 'aria-' + this.type.id : ns.attr(this.type.id);

    var buttons = document.querySelectorAll(this.type.aria ? ("[aria-controls=\"" + (this.id) + "\"]") : ns.attr.selector('controls', this.id));

    if (buttons.length > 0) { for (var i = 0; i < buttons.length; i++) { this.addButton(buttons[i]); } }

    this.disclosed = this.disclosed === true;
    this.apply(this.disclosed, true);

    this.group();
  };

  var prototypeAccessors$1 = { type: { configurable: true },GroupConstructor: { configurable: true },hasFocus: { configurable: true } };
  var staticAccessors = { type: { configurable: true },selector: { configurable: true } };

  Disclosure.prototype.group = function group () {
    DisclosuresGroup.groupById(this, this.GroupConstructor);
    DisclosuresGroup.groupByParent(this, this.GroupConstructor);
  };

  Disclosure.build = function build (from) {
    var elements = Array.prototype.slice.call(from.querySelectorAll(("." + (this.selector))));

    for (var i = 0, list = elements; i < list.length; i += 1) {
        var element = list[i];

        disclosures.push(new this(element));
      }
  };

  prototypeAccessors$1.type.get = function () { return this.constructor.type; };

  staticAccessors.type.get = function () { return null; };

  staticAccessors.selector.get = function () { return ''; };

  Disclosure.prototype.addButton = function addButton (element) {
    var button = this.buttonFactory(element);
    if (button.hasAttribute) {
      if (this.disclosed === null) {
        this.disclosed = button.disclosed;
      } else { button.apply(this.disclosed); }
    }
    this.buttons.push(button);
  };

  prototypeAccessors$1.GroupConstructor.get = function () { return DisclosuresGroup; };

  Disclosure.prototype.buttonFactory = function buttonFactory (button) {
    return new DisclosureButton(button, this);
  };

  Disclosure.prototype.disclose = function disclose () {
    if (this.disclosed) { return; }

    if (this.group !== undefined) { this.group.current = this; }
    this.apply(true);
  };

  Disclosure.prototype.conceal = function conceal () {
    if (!this.disclosed) { return; }

    if (this.group !== undefined) { this.group.current = null; }
    this.apply(false);
  };

  Disclosure.prototype.apply = function apply (value, initial) {
    this.disclosed = value;
    if (value) { addClass(this.element, this.modifier); }
    else { removeClass(this.element, this.modifier); }
    for (var i = 0; i < this.buttons.length; i++) { this.buttons[i].apply(value); }
    if (!value) { for (var i$1 = 0, list = disclosures; i$1 < list.length; i$1 += 1) {
          var disclosure = list[i$1];

          if (disclosure !== this && this.element.contains(disclosure.element)) { disclosure.reset();
        } } }
  };

  Disclosure.prototype.reset = function reset () {};

  Disclosure.prototype.change = function change (hasAttribute) {
    if (!this.constructor.type.canConceal) { this.disclose(); }
    else {
      switch (true) {
        case !hasAttribute:
        case this.disclosed:
          this.conceal();
          break;

        default:
          this.disclose();
      }
    }
  };

  Disclosure.prototype.setGroup = function setGroup (group) {
    this.group = group;
  };

  prototypeAccessors$1.hasFocus.get = function () {
    if (this.element === document.activeElement) { return true; }
    if (this.element.querySelectorAll(':focus').length > 0) { return true; }
    if (this.buttons.some(function (button) { return button.hasFocus; })) { return true; }
    return false;
  };

  Disclosure.prototype.focus = function focus () {
    for (var i = 0; i < this.buttons.length; i++) {
      var button = this.buttons[i];
      if (button.hasAttribute) {
        button.element.focus();
        return;
      }
    }
  };

  Object.defineProperties( Disclosure.prototype, prototypeAccessors$1 );
  Object.defineProperties( Disclosure, staticAccessors );

  var DISCLOSURE_TYPES = {
    expand: {
      id: 'expanded',
      aria: true,
      canConceal: true
    },
    select: {
      id: 'selected',
      aria: true,
      canConceal: false
    }
  };

  /**
   * CollapseButton correspond au bouton cliquable qui change le panel
   * CollapseButton étend de DisclosureButton qui ajoute/enelve l'attribut aria-expanded
   */
  var CollapseButton = /*@__PURE__*/(function (DisclosureButton) {
    function CollapseButton () {
      DisclosureButton.apply(this, arguments);
    }

    if ( DisclosureButton ) CollapseButton.__proto__ = DisclosureButton;
    CollapseButton.prototype = Object.create( DisclosureButton && DisclosureButton.prototype );
    CollapseButton.prototype.constructor = CollapseButton;

    var prototypeAccessors = { hasFocus: { configurable: true } };

    prototypeAccessors.hasFocus.get = function () {
      return this.element === document.activeElement;
    };

    Object.defineProperties( CollapseButton.prototype, prototypeAccessors );

    return CollapseButton;
  }(DisclosureButton));

  var ascendants = {};

  var CollapsesGroup = /*@__PURE__*/(function (DisclosuresGroup) {
    function CollapsesGroup () {
      DisclosuresGroup.apply(this, arguments);
    }

    if ( DisclosuresGroup ) CollapsesGroup.__proto__ = DisclosuresGroup;
    CollapsesGroup.prototype = Object.create( DisclosuresGroup && DisclosuresGroup.prototype );
    CollapsesGroup.prototype.constructor = CollapsesGroup;

    var prototypeAccessors = { hasFocus: { configurable: true } };
    var staticAccessors = { ascendants: { configurable: true } };

    prototypeAccessors.hasFocus.get = function () {
      if (this.current === undefined) { return null; }
      return this.current.hasFocus;
    };

    CollapsesGroup.register = function register (ascendant, groupSelector) {
      ascendants[ascendant] = groupSelector;
    };

    staticAccessors.ascendants.get = function () { return ascendants; };

    Object.defineProperties( CollapsesGroup.prototype, prototypeAccessors );
    Object.defineProperties( CollapsesGroup, staticAccessors );

    return CollapsesGroup;
  }(DisclosuresGroup));

  var COLLAPSE_CLASS = ns('collapse');

  /**
   * Tab coorespond au panel d'un élement Tabs (tab panel)
   * Tab étend disclosure qui ajoute/enleve le modifier --selected,
   * et ajoute/eleve l'attribut hidden, sur le panel
   */
  var Collapse = /*@__PURE__*/(function (Disclosure) {
    function Collapse (element) {
      Disclosure.call(this, element);

      element.addEventListener('transitionend', this.transitionend.bind(this));
    }

    if ( Disclosure ) Collapse.__proto__ = Disclosure;
    Collapse.prototype = Object.create( Disclosure && Disclosure.prototype );
    Collapse.prototype.constructor = Collapse;

    var prototypeAccessors = { GroupConstructor: { configurable: true },buttonHasFocus: { configurable: true },hasFocus: { configurable: true } };
    var staticAccessors = { type: { configurable: true },selector: { configurable: true } };

    Collapse.prototype.group = function group () {
      for (var ascendant in CollapsesGroup.ascendants) {
        var element = this.element.parentElement;

        while (element) {
          if (element.classList.contains(ascendant)) {
            if (typeof CollapsesGroup.ascendants[ascendant] === 'string') {
              DisclosuresGroup.groupByParent(this, CollapsesGroup, CollapsesGroup.ascendants[ascendant]);
            } else {
              DisclosuresGroup.groupByParent(this, CollapsesGroup.ascendants[ascendant]);
            }
            return;
          }

          element = element.parentElement;
        }
      }

      Disclosure.prototype.group.call(this);
    };

    prototypeAccessors.GroupConstructor.get = function () { return CollapsesGroup; };

    Collapse.prototype.buttonFactory = function buttonFactory (element) {
      return new CollapseButton(element, this);
    };

    staticAccessors.type.get = function () { return DISCLOSURE_TYPES.expand; };
    staticAccessors.selector.get = function () { return COLLAPSE_CLASS; };

    Collapse.prototype.transitionend = function transitionend (e) {
      if (!this.disclosed) { this.element.style.maxHeight = ''; }
    };

    Collapse.prototype.apply = function apply (value, initial) {
      var this$1 = this;

      if (value) { this.element.style.maxHeight = 'none'; }
      this.element.style.setProperty('--collapser', 'none');
      var height = this.element.offsetHeight;
      this.element.style.setProperty('--collapse', -height + 'px');
      this.element.style.setProperty('--collapser', '');

      window.requestAnimationFrame(function () { return Disclosure.prototype.apply.call(this$1, value, initial); });
    };

    Collapse.prototype.reset = function reset () {
      this.apply(false);
    };

    prototypeAccessors.buttonHasFocus.get = function () {
      if (this.buttons.some(function (button) { return button.hasFocus; })) { return true; }
      return false;
    };

    prototypeAccessors.hasFocus.get = function () {
      if (this.element === document.activeElement) { return true; }
      if (this.element.querySelectorAll(':focus').length > 0) { return true; }
      return this.buttonHasFocus;
    };

    Object.defineProperties( Collapse.prototype, prototypeAccessors );
    Object.defineProperties( Collapse, staticAccessors );

    return Collapse;
  }(Disclosure));

  var Equisized = function Equisized (selector, group) {
    this.selector = selector;
    this.group = group;
    this.elements = this.group.querySelectorAll(this.selector);
    this.maxWidth = 0;

    this.changing = this.change.bind(this);
    window.addEventListener('resize', this.changing);
    window.addEventListener('load', this.changing); // fix change before css load
    // this.change();
  };

  Equisized.prototype.change = function change () {
    this.reset();
    for (var i = 0; i < this.elements.length; i++) {
      var tmpWWidth = this._getWidth(this.elements[i]);
      if (tmpWWidth > this.maxWidth) {
        this.maxWidth = tmpWWidth;
      }
    }
    this.apply();
  };

  Equisized.prototype.apply = function apply () {
    for (var i = 0; i < this.elements.length; i++) {
      this.elements[i].style.width = this.maxWidth + 1 + 'px';
    }
  };

  Equisized.prototype.reset = function reset () {
    for (var i = 0; i < this.elements.length; i++) {
      this.elements[i].style.width = 'auto';
    }
    this.maxWidth = 0;
  };

  Equisized.prototype._getWidth = function _getWidth (el) {
    var width = el.offsetWidth;
    var style = getComputedStyle(el);
    width += parseInt(style.marginLeft) + parseInt(style.marginRight);
    return width;
  };

  api.ns = ns;
  api.addClass = addClass;
  api.removeClass = removeClass;
  api.engine = engine;
  api.Initializer = Initializer;
  api.KeyListener = KeyListener;
  api.Disclosure = Disclosure;
  api.DisclosureButton = DisclosureButton;
  api.DisclosuresGroup = DisclosuresGroup;
  api.DISCLOSURE_TYPES = DISCLOSURE_TYPES;
  api.Collapse = Collapse;
  api.CollapseButton = CollapseButton;
  api.CollapsesGroup = CollapsesGroup;
  api.Equisized = Equisized;

  var build$7 = function () {
    Collapse.build(document);
  };

  /* eslint-disable no-new */

  new Initializer(("." + COLLAPSE_CLASS), [build$7]);

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

  var BUTTON_SELECTOR = api.ns.selector('btn');
  var BUTTONS_GROUP_SELECTOR = api.ns.selector('btns-group');
  var EQUISIZED_BUTTONS_GROUP_SELECTOR = api.ns.selector('btns-group--equisized');

  var build$6 = function () {
    var group = document.querySelectorAll(EQUISIZED_BUTTONS_GROUP_SELECTOR);
    var arrayEquisized = [];
    for (var i = 0; i < group.length; i++) {
      arrayEquisized.push(new api.Equisized(BUTTON_SELECTOR, group[i]));
    }
  };

  /* eslint-disable no-new */

  new api.Initializer(BUTTONS_GROUP_SELECTOR, [build$6]);

  var MODAL_SELECTOR = api.ns.selector('modal');
  var MODAL_CLASS = api.ns('modal');
  var NO_SCROLL_CLASS = api.ns('no-scroll');
  var SCROLL_SHADOW_CLASS = api.ns('scroll-shadow');
  var MODAL_BODY_SELECTOR = api.ns.selector('modal__body');
  var OFFSET_MOBILE = 32; // 32px => 8v => 2rem

  var unordereds = [
    '[tabindex="0"]',
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'audio[controls]',
    'video[controls]',
    '[contenteditable]:not([contenteditable="false" i])',
    'details>summary:first-of-type',
    'details'
  ];

  var UNORDEREDS = unordereds.join();

  var ordereds = [
    '[tabindex]:not([tabindex="-1"]):not([tabindex="0"])'
  ];

  var ORDEREDS = ordereds.join();

  var isFocusable = function (element, container) {
    if (window.getComputedStyle(element).visibility === 'hidden') { return false; }
    if (container === undefined) { container = element; }

    while (container.contains(element)) {
      if (window.getComputedStyle(element).display === 'none') { return false; }
      element = element.parentElement;
    }

    return true;
  };

  var FocusTrap = function FocusTrap (onTrap, onUntrap) {
    this.element = null;
    this.activeElement = null;
    this.onTrap = onTrap;
    this.onUntrap = onUntrap;
    this.waiting = this.wait.bind(this);
    this.handling = this.handle.bind(this);
    this.current = null;
  };

  var prototypeAccessors = { trapped: { configurable: true },focusables: { configurable: true } };

  prototypeAccessors.trapped.get = function () { return this.element !== null; };

  FocusTrap.prototype.trap = function trap (element) {
    if (this.trapped) { this.untrap(); }

    this.element = element;
    this.isTrapping = true;
    this.wait();

    if (this.onTrap) { this.onTrap(); }
  };

  FocusTrap.prototype.wait = function wait () {
    if (!isFocusable(this.element)) {
      api.engine.renderer.next(this.waiting);
      return;
    }

    this.trapping();
  };

  FocusTrap.prototype.trapping = function trapping () {
    if (!this.isTrapping) { return; }
    this.isTrapping = false;
    var focusables = this.focusables;
    if (focusables.length) { focusables[0].focus(); }
    this.element.setAttribute('aria-modal', true);
    this.element.addEventListener('keydown', this.handling);

    this.stunneds = [];
    this.stun(document.body);
  };

  FocusTrap.prototype.stun = function stun (node) {
    for (var i = 0, list = node.children; i < list.length; i += 1) {
      var child = list[i];

        if (child === this.element) { continue; }
      if (child.contains(this.element)) {
        this.stun(child);
        continue;
      }
      this.stunneds.push(new Stunned(child));
    }
  };

  FocusTrap.prototype.handle = function handle (e) {
    if (e.keyCode !== 9) { return; }

    var focusables = this.focusables;
    if (focusables.length === 0) { return; }

    var first = focusables[0];
    var last = focusables[focusables.length - 1];

    var index = focusables.indexOf(document.activeElement);

    if (e.shiftKey) {
      if (!this.element.contains(document.activeElement) || index < 1) {
        e.preventDefault();
        last.focus();
      } else if (document.activeElement.tabIndex > 0 || focusables[index - 1].tabIndex > 0) {
        e.preventDefault();
        focusables[index - 1].focus();
      }
    } else {
      if (!this.element.contains(document.activeElement) || index === focusables.length - 1 || index === -1) {
        e.preventDefault();
        first.focus();
      } else if (document.activeElement.tabIndex > 0) {
        e.preventDefault();
        focusables[index + 1].focus();
      }
    }
  };

  prototypeAccessors.focusables.get = function () {
      var this$1 = this;

    var unordereds = [].concat( this.element.querySelectorAll(UNORDEREDS) );

    /**
     *filtrage des radiobutttons dans des fieldset (la navigations d'un groupe de radio se fait à la flèche et non pas au tab
     **/
    var fieldsets = [].concat( this.element.querySelectorAll('fieldset') );
    var radios = [];

    for (var i = 0, list = fieldsets; i < list.length; i += 1) {
      // eslint-disable-next-line no-useless-call
      var fieldset = list[i];

        if ([].concat( fieldset.querySelectorAll('input[type="radio"]:focus') ).length) { radios = radios.concat([].concat( fieldset.querySelectorAll('input[type="radio"]:not(:focus)') )); }
      else if ([].concat( fieldset.querySelectorAll('input[type="radio"]:checked') ).length) { radios = radios.concat([].concat( fieldset.querySelectorAll('input[type="radio"]:not(:checked)') )); }
      else { radios = radios.concat([].concat( fieldset.querySelectorAll('input[type="radio"]') ).splice(0, 1)); }
    }
    unordereds = unordereds.filter(function (unordered) {
      return radios.indexOf(unordered) === -1;
    });

    var ordereds = [].concat( this.element.querySelectorAll(ORDEREDS) );

    ordereds.sort(function (a, b) { return a.tabIndex - b.tabIndex; });

    var noDuplicates = unordereds.filter(function (element) { return ordereds.indexOf(element) === -1; });
    var concateneds = ordereds.concat(noDuplicates);
    var filtereds = concateneds.filter(function (element) { return element.tabIndex !== '-1' && isFocusable(element, this$1.element); });

    return filtereds;
  };

  FocusTrap.prototype.untrap = function untrap () {
    if (!this.trapped) { return; }
    this.isTrapping = false;

    this.element.removeAttribute('aria-modal');
    this.element.removeEventListener('keydown', this.handling);
    this.element = null;

    for (var i = 0, list = this.stunneds; i < list.length; i += 1) {
        var stunned = list[i];

        stunned.unstun();
      }
    this.stunneds = [];

    if (this.onUntrap) { this.onUntrap(); }
  };

  Object.defineProperties( FocusTrap.prototype, prototypeAccessors );

  var Stunned = function Stunned (element) {
    this.element = element;
    this.hidden = element.getAttribute('aria-hidden');
    this.inert = element.getAttribute('inert');

    this.element.setAttribute('aria-hidden', true);
    this.element.setAttribute('inert', '');
  };

  Stunned.prototype.unstun = function unstun () {
    if (this.hidden === null) { this.element.removeAttribute('aria-hidden'); }
    else { this.element.setAttribute('aria-hidden', this.hidden); }

    if (this.inert === null) { this.element.removeAttribute('inert'); }
    else { this.element.setAttribute('inert', this.inert); }
  };

  var ModalsGroup = /*@__PURE__*/(function (superclass) {
    function ModalsGroup () {
      superclass.call(this);
      this.trap = new FocusTrap();
    }

    if ( superclass ) ModalsGroup.__proto__ = superclass;
    ModalsGroup.prototype = Object.create( superclass && superclass.prototype );
    ModalsGroup.prototype.constructor = ModalsGroup;

    ModalsGroup.prototype.apply = function apply (value, initial) {
      superclass.prototype.apply.call(this, value, initial);
      if (this.current === null) { this.trap.untrap(); }
      else { this.trap.trap(this.current.element); }
    };

    return ModalsGroup;
  }(api.DisclosuresGroup));

  var ModalButton = /*@__PURE__*/(function (superclass) {
    function ModalButton () {
      superclass.apply(this, arguments);
    }

    if ( superclass ) ModalButton.__proto__ = superclass;
    ModalButton.prototype = Object.create( superclass && superclass.prototype );
    ModalButton.prototype.constructor = ModalButton;

    ModalButton.prototype.apply = function apply (value) {
      superclass.prototype.apply.call(this, value);
      // if (!this.hasAttribute) return;
      // this.element.setAttribute(this.disclosure.attributeName, value);
    };

    return ModalButton;
  }(api.DisclosureButton));

  var group = new ModalsGroup();

  var Modal = /*@__PURE__*/(function (superclass) {
    function Modal (element) {
      superclass.call(this, element);
      this.body = this.element.querySelector(MODAL_BODY_SELECTOR);
      this.scrollDistance = 0;
      this.scrolling = this.resize.bind(this, false);
      this.resizing = this.resize.bind(this, true);
      this.listen();
      this.resize(true);
    }

    if ( superclass ) Modal.__proto__ = superclass;
    Modal.prototype = Object.create( superclass && superclass.prototype );
    Modal.prototype.constructor = Modal;

    var prototypeAccessors = { GroupConstructor: { configurable: true } };
    var staticAccessors = { type: { configurable: true },selector: { configurable: true } };

    Modal.prototype.listen = function listen () {
      this.element.addEventListener('click', this.click.bind(this));

      this.keyListener = new api.KeyListener(this.element);
      this.keyListener.down(api.KeyListener.ESCAPE, this.conceal.bind(this), true, true);

      if (this.body) {
        this.body.addEventListener('scroll', this.scrolling);
        window.addEventListener('resize', this.resizing);
        window.addEventListener('orientationchange', this.resizing);
      }
    };

    Modal.prototype.click = function click (e) {
      if (this.body && this.element === e.target) { this.conceal(); }
    };

    Modal.prototype.group = function group$1 () {
      group.add(this);
    };

    Modal.prototype.apply = function apply (value, initial) {
      this.handleScroll(!value);
      if (!value) {
        if (!initial) { this.focus(); }
      } else {
        if (!initial) { this.resize(true); }
      }
      superclass.prototype.apply.call(this, value, initial);
    };

    /**
     * Fixe l'arrière plan quand la modal est ouverte
     */
    // TODO: créer une fonction de fix de scroll dans core (api.noScroll = true)
    Modal.prototype.handleScroll = function handleScroll (isScrollable) {
      if (isScrollable) {
        api.removeClass(document.documentElement, NO_SCROLL_CLASS);
        document.body.style.top = '';
        window.scroll(0, this.scrollDistance);
      } else {
        if (!document.documentElement.classList.contains(NO_SCROLL_CLASS)) {
          this.scrollDistance = window.scrollY;
        }
        document.body.style.top = this.scrollDistance * -1 + 'px';
        api.addClass(document.documentElement, NO_SCROLL_CLASS);
      }
    };

    /**
     * Ajoute une ombre autour du footer lorsque l'on peut scroller dans la modale
     * corrige le 100vh, en mobile notamment, lorsque la barre navigateur est présente par exemple.
     */
    Modal.prototype.resize = function resize (isResizing, e) {
      var this$1 = this;

      if (!this.body) { return; }
      if (this.body.scrollHeight > this.body.clientHeight) {
        if (this.body.offsetHeight + this.body.scrollTop >= this.body.scrollHeight) {
          api.removeClass(this.body, SCROLL_SHADOW_CLASS);
        } else {
          api.addClass(this.body, SCROLL_SHADOW_CLASS);
        }
      } else {
        api.removeClass(this.body, SCROLL_SHADOW_CLASS);
      }

      if (isResizing) {
        this.body.style.maxHeight = (window.innerHeight - OFFSET_MOBILE) + 'px';

        // Une deuxième fois après positionnement des barres du navigateur (ios)
        // TODO: à tester si fonctionnel sans setTimeout
        requestAnimationFrame(function () {
          this$1.body.style.maxHeight = (window.innerHeight - OFFSET_MOBILE) + 'px';
        });
      }
    };

    staticAccessors.type.get = function () { return api.DISCLOSURE_TYPES.expand; };
    staticAccessors.selector.get = function () { return MODAL_CLASS; };

    Modal.prototype.buttonFactory = function buttonFactory (element) {
      return new ModalButton(element, this);
    };

    prototypeAccessors.GroupConstructor.get = function () { return ModalsGroup; };

    Object.defineProperties( Modal.prototype, prototypeAccessors );
    Object.defineProperties( Modal, staticAccessors );

    return Modal;
  }(api.Disclosure));

  api.Modal = Modal;
  api.ModalButton = ModalButton;
  api.ModalsGroup = ModalsGroup;
  api.FocusTrap = FocusTrap;

  /**
   * initialise tout les éléments Modal dans la page
   */
  var build$5 = function () {
    Modal.build(document);
  };

  /* eslint-disable no-new */

  new api.Initializer(MODAL_SELECTOR, [build$5]);

  var NAVIGATION_CLASS = api.ns('nav');
  var NAVIGATION_LIST_CLASS = api.ns('nav__list');
  var NAVIGATION_ITEM_CLASS = api.ns('nav__item');
  var NAVIGATION_ITEM_RIGHT_CLASS = api.ns('nav__item--align-right');
  var NAVIGATION_MENU_CLASS = api.ns('menu');

  var Navigation = /*@__PURE__*/(function (superclass) {
    function Navigation (id, element) {
      superclass.call(this, id, element);

      this.menus = [];

      this.navList = element.querySelector(("." + NAVIGATION_LIST_CLASS));

      document.addEventListener('focusout', this.focusOut.bind(this));
      window.addEventListener('resize', this.resize.bind(this));
      window.addEventListener('orientationchange', this.resize.bind(this));
      this.resize();
    }

    if ( superclass ) Navigation.__proto__ = superclass;
    Navigation.prototype = Object.create( superclass && superclass.prototype );
    Navigation.prototype.constructor = Navigation;

    var prototypeAccessors = { index: { configurable: true } };
    var staticAccessors = { selector: { configurable: true } };

    staticAccessors.selector.get = function () { return NAVIGATION_CLASS; };

    Navigation.prototype.add = function add (member) {
      superclass.prototype.add.call(this, member);

      if (member.element.classList.contains(NAVIGATION_MENU_CLASS)) {
        this.menus.push(new NavigationMenu(member, this.navList.getBoundingClientRect().right));
      }
    };

    Navigation.prototype.focusOut = function focusOut (e) {
      var this$1 = this;

      requestAnimationFrame(function () {
        if (this$1.current !== null && !this$1.current.hasFocus) { this$1.index = -1; }
      });
    };

    prototypeAccessors.index.get = function () { return superclass.prototype.index; };

    prototypeAccessors.index.set = function (value) {
      if (value === -1 && this.current !== null && this.current.hasFocus) { this.current.focus(); }
      superclass.prototype.index = value;
    };

    Navigation.prototype.resize = function resize () {
      var right = this.navList.getBoundingClientRect().right;

      for (var i = 0, list = this.menus; i < list.length; i += 1) {
        var menu = list[i];

        menu.place(right);
      }
    };

    Object.defineProperties( Navigation.prototype, prototypeAccessors );
    Object.defineProperties( Navigation, staticAccessors );

    return Navigation;
  }(api.CollapsesGroup));

  var NavigationMenu = function NavigationMenu (collapse, right) {
    this.initialize(collapse);
    this.place(right);
  };

  NavigationMenu.prototype.initialize = function initialize (collapse) {
    this.element = collapse.element;

    for (var i = 0, list = collapse.buttons; i < list.length; i += 1) {
      var button = list[i];

        if (!button.hasAttribute) { continue; }
      this.button = button.element;
      break;
    }

    var item = this.element.parentElement;
    while (item) {
      if (item.classList.contains(NAVIGATION_ITEM_CLASS)) {
        this.item = item;
        break;
      }
      item = item.parentElement;
    }
  };

  NavigationMenu.prototype.place = function place (right) {
    var styles = getComputedStyle(this.element);
    var width = parseFloat(styles.width);
    var left = this.button.getBoundingClientRect().left;

    if (left + width > right) { api.addClass(this.item, NAVIGATION_ITEM_RIGHT_CLASS); }
    else { api.removeClass(this.item, NAVIGATION_ITEM_RIGHT_CLASS); }
  };

  api.Navigation = Navigation;

  api.CollapsesGroup.register(NAVIGATION_CLASS, Navigation);

  var SCHEME_ATTR = api.ns.attr('theme');
  var TRANSITION_ATTR = api.ns.attr('transition');

  var Scheme = function Scheme () {
    this.init();
  };

  Scheme.prototype.init = function init () {
      var this$1 = this;

    this.scheme = localStorage.getItem('scheme')
      ? localStorage.getItem('scheme')
      : null;

    if (this.scheme === null) {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        this.scheme = 'dark';
        localStorage.setItem('scheme', 'dark');
      } else { this.scheme = 'light'; }
    }

    this.root = document.documentElement;

    if (this.scheme === 'dark') {
      if (!this.root.hasAttribute(TRANSITION_ATTR)) {
        this.root.setAttribute(SCHEME_ATTR, 'dark');
      } else {
        this.root.removeAttribute(TRANSITION_ATTR);
        this.root.setAttribute(SCHEME_ATTR, 'dark');

        setTimeout(function () {
          this$1.root.setAttribute(TRANSITION_ATTR, '');
        }, 300);
      }
    } else { this.root.setAttribute(SCHEME_ATTR, 'light'); }

    this.observer = new MutationObserver(this.mutate.bind(this));
    this.observer.observe(this.root, { attributes: true });
  };

  Scheme.prototype.mutate = function mutate (mutations) {
      var this$1 = this;

    mutations.forEach(function (mutation) {
      if (mutation.type === 'attributes' && mutation.attributeName === SCHEME_ATTR) {
        var scheme = this$1.root.getAttribute(SCHEME_ATTR);
        if (scheme === 'dark') {
          localStorage.setItem('scheme', 'dark');
        } else if (scheme === 'light') {
          localStorage.setItem('scheme', 'light');
        }
      }
    });
  };

  api.Scheme = Scheme;

  var RADIOS_THEME_NAME = "input[name=\"" + (api.ns.selector('radios-theme', '')) + "\"]";
  var SWITCH_THEME_ID = api.ns.selector('switch-theme', '#');
  var THEME_ATTR = api.ns.attr('theme');

  /* eslint-disable no-new */

  var build$4 = function () {
    new Scheme();
  };

  var SwitchTheme = function SwitchTheme () {
    this.attributeName = THEME_ATTR;
    this.theme = null;
    this.radios = document.querySelectorAll(RADIOS_THEME_NAME);

    for (var i = 0; i < this.radios.length; i++) {
      this.radios[i].addEventListener('change', this.change.bind(this));
    }

    this.observer = new MutationObserver(this.mutate.bind(this));
    this.observe();
    this.apply();
  };

  SwitchTheme.prototype.observe = function observe () {
    this.observer.observe(document.documentElement, { attributes: true });
  };

  SwitchTheme.prototype.mutate = function mutate (mutations) {
      var this$1 = this;

    mutations.forEach(function (mutation) {
      if (mutation.type === 'attributes' && mutation.attributeName === this$1.attributeName) {
        this$1.apply();
      }
    });
  };

  SwitchTheme.prototype.apply = function apply () {
    var theme = document.documentElement.getAttribute(this.attributeName);
    this.isApplying = true;
    for (var i = 0; i < this.radios.length; i++) {
      this.radios[i].checked = this.radios[i].value === theme;
    }
    this.isApplying = false;
  };

  SwitchTheme.prototype.change = function change () {
    if (this.isApplying) { return; }
    if (this.observer) { this.observer.disconnect(); }
    this.theme = document.querySelector(RADIOS_THEME_NAME + ':checked');
    if (this.theme) {
      document.documentElement.setAttribute(this.attributeName, this.theme.value);
    } else {
      document.documentElement.removeAttribute(this.attributeName);
    }
    if (this.observer) { this.observe(); }
  };

  /* eslint-disable no-new */

  var build$3 = function () {
    new SwitchTheme();
  };

  /* eslint-disable no-new */

  new api.Initializer((":root[" + SCHEME_ATTR + "]"), [build$4]);
  new api.Initializer(("" + SWITCH_THEME_ID), [build$3]);

  var SIDEMENU_CLASS = api.ns('sidemenu');
  var SIDEMENU_LIST_CLASS = api.ns('sidemenu__list');

  /* eslint-disable no-new */

  api.CollapsesGroup.register(SIDEMENU_CLASS, SIDEMENU_LIST_CLASS);

  var TABLE_SELECTOR = api.ns.selector('table');
  // const TABLE_CLASS = api.ns('table');
  var TABLE_SCROLLING_SELECTOR = (api.ns.selector('table')) + ":not(" + (api.ns.selector('table--no-scroll')) + ")";
  var LEFT = 'left';
  var RIGHT = 'right';
  var SHADOW_CLASS = api.ns('table--shadow');
  var SHADOW_LEFT_CLASS = api.ns('table--shadow-left');
  var SHADOW_RIGHT_CLASS = api.ns('table--shadow-right');
  var WRAPPER_CLASS = api.ns('table__wrapper');
  var CAPTION_BOTTOM_CLASS = ('table--caption-bottom');
  var SCROLL_OFFSET = 1; // valeur en px du scroll avant laquelle le shadow s'active ou se desactive

  var Table = function Table (table) {
    this.init(table);
  };

  Table.prototype.init = function init (table) {
    this.table = table;
    this.tableElem = this.table.querySelector('table');
    this.tableContent = this.tableElem.querySelector('tbody');
    this.isScrollable = this.tableContent.offsetWidth > this.tableElem.offsetWidth;
    this.caption = this.tableElem.querySelector('caption');
    this.captionHeight = 0;
    this.wrap();

    var scrolling = this.change.bind(this);
    this.tableElem.addEventListener('scroll', scrolling);
    this.change();
  };

  Table.prototype.change = function change () {
    var newScroll = this.tableContent.offsetWidth > this.tableElem.offsetWidth;
    var firstTimeScrollable = this.tableElem.offsetWidth > this.table.offsetWidth;
    if (newScroll || firstTimeScrollable) {
      this.scroll();
      this.handleCaption();
    } else {
      if (newScroll !== this.isScrollable) { this.delete(); }
    }
    this.isScrollable = newScroll;
    firstTimeScrollable = false;
  };

  Table.prototype.delete = function delete$1 () {
    api.removeClass(this.table, SHADOW_RIGHT_CLASS);
    api.removeClass(this.table, SHADOW_LEFT_CLASS);
    api.removeClass(this.table, SHADOW_CLASS);
    if (this.caption) {
      this.tableElem.style.marginTop = '';
      this.caption.style.top = '';
      this.tableElem.style.marginBottom = '';
      this.caption.style.bottom = '';
    }
  };

  Table.prototype.scroll = function scroll () {
    api.addClass(this.table, SHADOW_CLASS);
    this.setShadowPosition();
  };

  /* ajoute un wrapper autour du tableau */
  Table.prototype.wrap = function wrap () {
    var wrapperHtml = document.createElement('div');
    wrapperHtml.className = WRAPPER_CLASS;
    this.table.insertBefore(wrapperHtml, this.tableElem);
    wrapperHtml.appendChild(this.tableElem);
    this.tableInnerWrapper = wrapperHtml;
  };

  /* affiche les blocs shadow en fonction de la position du scroll, en ajoutant la classe visible */
  Table.prototype.setShadowPosition = function setShadowPosition () {
    var tableScrollLeft = this.getScrollPosition(LEFT);
    var tableScrollRight = this.getScrollPosition(RIGHT);

    // on inverse en cas de lecture droite - gauche
    if (document.documentElement.getAttribute('dir') === 'rtl') {
      this.setShadowVisibility(RIGHT, tableScrollLeft);
      this.setShadowVisibility(LEFT, tableScrollRight);
    } else {
      this.setShadowVisibility(LEFT, tableScrollLeft);
      this.setShadowVisibility(RIGHT, tableScrollRight);
    }
  };

  /* Donne le nombre de pixels scrollés honrizontalement dans un element scrollable */
  Table.prototype.getScrollPosition = function getScrollPosition (side) {
    var inverter = 1;
    // on inverse en cas de lecture droite - gauche pour que la valeur de scroll soit toujours positive
    if (document.documentElement.getAttribute('dir') === 'rtl') {
      inverter = -1;
    }
    switch (side) {
      case LEFT:
        return this.tableElem.scrollLeft * inverter;
      case RIGHT:
        return this.tableContent.offsetWidth - this.tableElem.offsetWidth - this.tableElem.scrollLeft * inverter;
      default:
        return false;
    }
  };

  /* positionne la caption en top négatif et ajoute un margin-top au wrapper */
  Table.prototype.handleCaption = function handleCaption () {
    if (this.caption) {
      var style = getComputedStyle(this.caption);
      var newHeight = this.caption.offsetHeight + parseInt(style.marginTop) + parseInt(style.marginBottom);
      this.captionHeight = newHeight;
      if (this.table.classList.contains(CAPTION_BOTTOM_CLASS)) {
        this.tableElem.style.marginBottom = this.captionHeight + 'px';
        this.caption.style.bottom = -this.captionHeight + 'px';
      } else {
        this.tableElem.style.marginTop = this.captionHeight + 'px';
        this.caption.style.top = -this.captionHeight + 'px';
      }
    }
  };

  /* ajoute la classe rf-table--shadow-right ou rf-table--shadow-right sur rf-table
   en fonction d'une valeur de scroll et du sens (right, left) */
  Table.prototype.setShadowVisibility = function setShadowVisibility (side, scrollPosition) {
    // si on a pas scroll, ou qu'on scroll jusqu'au bout
    if (scrollPosition <= SCROLL_OFFSET) {
      if (side === LEFT) { api.removeClass(this.table, SHADOW_LEFT_CLASS); }
      else if (side === RIGHT) { api.removeClass(this.table, SHADOW_RIGHT_CLASS); }
    } else {
      if (side === LEFT) { api.addClass(this.table, SHADOW_LEFT_CLASS); }
      else if (side === RIGHT) { api.addClass(this.table, SHADOW_RIGHT_CLASS); }
    }
  };

  api.Table = Table;

  var tables = [];

  var change = function () {
    for (var i = 0; i < tables.length; i++) { tables[i].change(); }
  };

  var build$2 = function () {
    var tableNodes = document.querySelectorAll(TABLE_SCROLLING_SELECTOR);
    for (var i = 0; i < tableNodes.length; i++) { tables.push(new Table(tableNodes[i])); }

    window.addEventListener('resize', change);
    window.addEventListener('orientationchange', change);
    change();
  };

  /* eslint-disable no-new */

  new api.Initializer(TABLE_SELECTOR, [build$2]);

  /**
    * TabButton correspond au bouton cliquable qui change le panel
    * TabButton étend de DisclosureButton qui ajoute/enelve l'attribut aria-selected,
    * Et change l'attributte tabindex a 0 si le boutton est actif (value=true), -1 s'il n'est pas actif (value=false)
   */
  var TabButton = /*@__PURE__*/(function (superclass) {
    function TabButton () {
      superclass.apply(this, arguments);
    }

    if ( superclass ) TabButton.__proto__ = superclass;
    TabButton.prototype = Object.create( superclass && superclass.prototype );
    TabButton.prototype.constructor = TabButton;

    TabButton.prototype.apply = function apply (value) {
      superclass.prototype.apply.call(this, value);
      if (this.hasAttribute) {
        this.element.setAttribute('tabindex', value ? '0' : '-1');
      }
    };

    return TabButton;
  }(api.DisclosureButton));

  var TABS_SELECTOR = api.ns.selector('tabs');
  var TABS_CLASS = api.ns('tabs');
  var TAB_CLASS = api.ns('tabs__tab');
  var PANEL_CLASS = api.ns('tabs__panel');
  var LIST_CLASS = api.ns('tabs__list');

  /**
  * TabGroup est la classe étendue de DiscosuresGroup
  * Correspond à un objet Tabs avec plusieurs tab-button & Tab (panel)
  */
  var TabsGroup = /*@__PURE__*/(function (superclass) {
    function TabsGroup (id, element) {
      superclass.call(this, id, element);
      this.list = element.querySelector(("." + LIST_CLASS));

      element.addEventListener('transitionend', this.transitionend.bind(this));

      this.listen();
      api.engine.renderer.add(this.render.bind(this));
    }

    if ( superclass ) TabsGroup.__proto__ = superclass;
    TabsGroup.prototype = Object.create( superclass && superclass.prototype );
    TabsGroup.prototype.constructor = TabsGroup;

    var staticAccessors = { selector: { configurable: true } };

    staticAccessors.selector.get = function () { return TABS_CLASS; };

    TabsGroup.prototype.transitionend = function transitionend (e) {
      this.element.style.transition = 'none';
    };

    TabsGroup.prototype.listen = function listen () {
      this.keyListener = new api.KeyListener(this.element);
      this.keyListener.down(api.KeyListener.RIGHT, this.arrowRightPress.bind(this), true, true);
      this.keyListener.down(api.KeyListener.LEFT, this.arrowLeftPress.bind(this), true, true);
      this.keyListener.down(api.KeyListener.HOME, this.homePress.bind(this), true, true);
      this.keyListener.down(api.KeyListener.END, this.endPress.bind(this), true, true);
    };

    /**
     * Selectionne l'element suivant de la liste si on est sur un bouton
     * Si on est à la fin on retourne au début
     */
    TabsGroup.prototype.arrowRightPress = function arrowRightPress () {
      if (document.activeElement.classList.contains(TAB_CLASS)) {
        if (this.index < this.length - 1) {
          this.index++;
        } else {
          this.index = 0;
        }

        this.focus();
      }
    };
    /**
     * Selectionne l'element précédent de la liste si on est sur un bouton
     * Si on est au debut retourne a la fin
     */
    TabsGroup.prototype.arrowLeftPress = function arrowLeftPress () {
      if (document.activeElement.classList.contains(TAB_CLASS)) {
        if (this.index > 0) {
          this.index--;
        } else {
          this.index = this.length - 1;
        }

        this.focus();
      }
    };
    /**
     * Selectionne le permier element de la liste si on est sur un bouton
     */
    TabsGroup.prototype.homePress = function homePress () {
      if (document.activeElement.classList.contains(TAB_CLASS)) {
        this.index = 0;
        this.focus();
      }
    };
    /**
     * Selectionne le dernier element de la liste si on est sur un bouton
     */
    TabsGroup.prototype.endPress = function endPress () {
      if (document.activeElement.classList.contains(TAB_CLASS)) {
        this.index = this.length - 1;
        this.focus();
      }
    };
    TabsGroup.prototype.focus = function focus () {
      if (this.current) { this.current.focus(); }
    };

    TabsGroup.prototype.apply = function apply (value, initial) {
      for (var i = 0; i < this._index; i++) { this.members[i].translate(-1, initial); }
      this.current.element.style.transform = '';
      for (var i$1 = this._index + 1; i$1 < this.length; i$1++) { this.members[i$1].translate(1, initial); }
      this.element.style.transition = '';
    };

    TabsGroup.prototype.add = function add (tab) {
      superclass.prototype.add.call(this, tab);
      if (this.length === 1 || tab.disclosed) { this.current = tab; }
      else {
        var index = this.members.indexOf(tab);
        if (this._index > -1 && this._index !== index) { tab.element.style.transform = "translateX(" + (index < this._index ? -100 : 100) + "%)"; }
      }
    };

    TabsGroup.prototype.render = function render () {
      if (this.current === null) { return; }
      var paneHeight = Math.round(this.current.element.offsetHeight);
      if (this.panelHeight === paneHeight) { return; }
      this.panelHeight = paneHeight;
      this.element.style.height = (this.panelHeight + this.list.offsetHeight) + 'px';
    };

    Object.defineProperties( TabsGroup, staticAccessors );

    return TabsGroup;
  }(api.DisclosuresGroup));

  /**
    * Tab coorespond au panel d'un élement Tabs (tab panel)
    * Tab étend disclosure qui ajoute/enleve le modifier --selected,
    * et ajoute/eleve l'attribut hidden, sur le panel
    */
  var Tab = /*@__PURE__*/(function (superclass) {
    function Tab () {
      superclass.apply(this, arguments);
    }

    if ( superclass ) Tab.__proto__ = superclass;
    Tab.prototype = Object.create( superclass && superclass.prototype );
    Tab.prototype.constructor = Tab;

    var prototypeAccessors = { GroupConstructor: { configurable: true } };
    var staticAccessors = { type: { configurable: true },selector: { configurable: true } };

    staticAccessors.type.get = function () { return api.DISCLOSURE_TYPES.select; };
    staticAccessors.selector.get = function () { return PANEL_CLASS; };

    prototypeAccessors.GroupConstructor.get = function () { return TabsGroup; };

    Tab.prototype.buttonFactory = function buttonFactory (element) {
      return new TabButton(element, this);
    };

    Tab.prototype.translate = function translate (direction, initial) {
      if (initial) { this.element.style.transition = 'none'; }
      this.element.style.transform = "translate(" + (direction * 100) + "%)";
      if (initial) { this.element.style.transition = ''; }
    };

    Tab.prototype.reset = function reset () {
      this.group.index = 0;
    };

    Object.defineProperties( Tab.prototype, prototypeAccessors );
    Object.defineProperties( Tab, staticAccessors );

    return Tab;
  }(api.Disclosure));

  api.Tab = Tab;
  api.TabButton = TabButton;
  api.TabsGroup = TabsGroup;

  /**
  * Initialise tout les éléments Tab dans la page
  */
  var build$1 = function () {
    Tab.build(document);
  };

  /* eslint-disable no-new */

  new api.Initializer(TABS_SELECTOR, [build$1]);

  var HEADER_SELECTOR = api.ns.selector('header');
  var HEADER_TOOLS_SELECTOR = api.ns.selector('header__tools');
  var HEADER_SEARCH_BAR_SELECTOR = HEADER_TOOLS_SELECTOR + " " + (api.ns.selector('search-bar'));
  var HEADER_SHORTCUTS_SELECTOR = HEADER_TOOLS_SELECTOR + " " + (api.ns.selector('shortcuts'));
  var HEADER_NAV_SELECTOR = api.ns.selector('nav');
  var HEADER_NAV_LIST_SELECTOR = HEADER_NAV_SELECTOR + " " + (api.ns.selector('nav__list'));

  var count = 0;

  var Header = function Header (header) {
    this.header = header || document.querySelector(HEADER_SELECTOR);
    this.numId = count;
    count++;

    this.init();
  };

  Header.prototype.init = function init () {
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
  };

  Header.prototype.change = function change () {
    this.isLarge = window.matchMedia('(min-width: 62em)').matches;

    for (var i = 0; i < this.popins.length; i++) { this.popins[i].change(this.isLarge); }

    if (this.shortcuts !== null) {
      if (this.isLarge) {
        if (this.searchBar !== null) { this.tools.insertBefore(this.shortcuts, this.searchBar); }
        else { this.tools.appendChild(this.shortcuts); }
      } else {
        this.nav.insertBefore(this.shortcuts, this.navList);
      }
    }
  };

  api.Header = Header;

  var build = function () {
    var elements = Array.prototype.slice.call(document.querySelectorAll(HEADER_SELECTOR));

    var headers = [];

    for (var i = 0, list = elements; i < list.length; i += 1) {
      var element = list[i];

      headers.push(new Header(element));
    }
  };

  /* eslint-disable no-new */

  new api.Initializer(HEADER_SELECTOR, [build]);

}());
//# sourceMappingURL=dsfr.nomodule.js.map
