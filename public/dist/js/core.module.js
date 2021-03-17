/*! DSFR v0.5.5 | licence MIT */

const prefix = 'rf';
const namespace = 'dsfr';

const api = window[namespace] || {};
window[namespace] = api;

const ns = (name) => {
  return `${prefix}-${name}`;
};

ns.selector = (name, notation) => {
  if (notation === undefined) notation = '.';
  return `${notation}${ns(name)}`;
};

ns.attr = (name, quoted, value) => {
  return `data-${ns(name)}`;
};

ns.attr.selector = (name, value) => {
  let result = ns.attr(name);
  if (value !== undefined) result += `="${value}"`;
  return `[${result}]`;
};

const modifiyClass = (element, className, remove) => {
  if (className.charAt(0) === '.') className = className.substr(1);
  const classNames = element.className.split(' ');
  const index = classNames.indexOf(className);
  if (remove === true) {
    if (index > -1) classNames.splice(index, 1);
  } else if (index === -1) classNames.push(className);
  element.className = classNames.join(' ');
};

const addClass = (element, className) => modifiyClass(element, className);

const removeClass = (element, className) => modifiyClass(element, className, true);

class Renderer {
  constructor () {
    this.closures = [];
    this.nexts = [];
    this.rendering = this.render.bind(this);
    this.render();
  }

  add (closure) {
    this.closures.push(closure);
    const remove = () => {
      const index = this.closures.indexOf(closure);
      if (index !== -1) this.closures.splice(index, 1);
    };
    return remove;
  }

  next (closure) {
    this.nexts.push(closure);
  }

  render () {
    window.requestAnimationFrame(this.rendering);
    for (const closure of this.closures) closure.call();
    const nexts = this.nexts.slice();
    this.nexts.length = 0;
    for (const closure of nexts) closure.call();
  }
}

// TODO: initializer et renderer en 1, avec muttation observer pour ajouter et retirer les instances des objets attendus en fonctions de selecteurs spécifiques
class Engine {
  constructor () {
    this.renderer = new Renderer();
    // this.instantier = new Instancier();
  }

  register (selector, factory) {

  }

  start () {
    // this.renderer.start();
  }

  stop () {
    // this.renderer.stop();
  }
}

const engine = new Engine();

class Initializer {
  constructor (selector, builders) {
    this.selector = selector;
    this.builders = builders;
    this.instances = [];

    if (document.readyState !== 'loading') window.requestAnimationFrame(this.start.bind(this));
    else document.addEventListener('DOMContentLoaded', this.start.bind(this));
  }

  start () {
    if (this.instances.length > 0) return;

    if (document.querySelectorAll(this.selector).length > 0) {
      for (let i = 0; i < this.builders.length; i++) {
        this.instances.push(this.builders[i]());
      }
    }
  }
}

/**
 * Utilitaire de gestion des évenements clavier
 * Utiliser KeyListener.add() pour ajouter un event listener
 */
class KeyListener {
  constructor (element) {
    this.element = element;
    this.collections = {};
  }

  /**
   * key: la touche de clavier
   * closure: la function à appliquer
   * type: event type, optionnel, si c'est en down, up ou press
   * stopPropagation: Boolean, permet d'empêcher le comportement par default de l'evenement
   */
  _add (type, action) {
    if (this.collections[type] === undefined) this.collections[type] = new KeyActionCollection(type, this.element);
    this.collections[type].add(action);
  }

  down (key, closure, preventDefault, stopPropagation) {
    this._add('down', new KeyAction(key, closure, preventDefault, stopPropagation));
  }

  up (key, closure, preventDefault, stopPropagation) {
    this._add('up', new KeyAction(key, closure, preventDefault, stopPropagation));
  }

  dispose () {
    for (const collection of this.collections) collection.dispose();
    this.types = null;
  }
}

class KeyActionCollection {
  constructor (type, element) {
    this.type = type;
    this.element = element;
    this.actions = [];
    this.binding = this.handle.bind(this);
    this.element.addEventListener('key' + type, this.binding);
  }

  add (action) {
    this.actions.push(action);
  }

  handle (e) {
    for (const action of this.actions) action.handle(e);
  }

  dispose () {
    this.element.removeEventListener('key' + this.type, this.binding);
    this.actions = null;
  }
}

class KeyAction {
  constructor (key, closure, preventDefault, stopPropagation) {
    this.key = key;
    this.closure = closure;
    this.preventDefault = preventDefault === true;
    this.stopPropagation = stopPropagation === true;
  }

  handle (e) {
    if (e.keyCode === this.key) {
      this.closure(e);
      if (this.preventDefault) {
        e.preventDefault();
      }
      if (this.stopPropagation) {
        e.stopPropagation();
      }
    }
  }
}

KeyListener.TAB = 9;
KeyListener.ESCAPE = 27;
KeyListener.END = 35;
KeyListener.HOME = 36;
KeyListener.LEFT = 37;
KeyListener.UP = 38;
KeyListener.RIGHT = 39;
KeyListener.DOWN = 40;

const GROUP_ATTR = ns.attr('group');

const groups = [];

class DisclosuresGroup {
  constructor (id, element) {
    this.id = id;
    this.element = element;
    this.members = [];
    this._index = -1;
    this._current = null;
    groups.push(this);
  }

  static getGroupById (id) {
    for (const group of groups) if (group.constructor === this && group.id === id) return group;
    return new this(id);
  }

  static getGroupByElement (element) {
    for (const group of groups) if (group.element === element) return group;
    return new this(false, element);
  }

  static groupById (member, groupConstructor) {
    const id = member.element.getAttribute(GROUP_ATTR);
    if (id === null) return;

    const group = groupConstructor.getGroupById(id);
    group.add(member);
  }

  static groupByParent (member, GroupConstructor, groupSelector) {
    if (groupSelector === undefined) groupSelector = GroupConstructor.selector;
    if (groupSelector === '') return;
    let element = member.element.parentElement;

    while (element) {
      if (element.classList.contains(member.constructor.selector)) return;

      if (element.classList.contains(groupSelector)) {
        const group = GroupConstructor.getGroupByElement(element);
        group.add(member);
        return;
      }
      element = element.parentElement;
    }
  }

  static get selector () { return ''; }

  add (member) {
    if (this.members.indexOf(member) !== -1) return;
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
  }

  get length () { return this.members.length; }

  get index () { return this._index; }

  set index (value) {
    if (value < -1 || value >= this.length || this._index === value) return;
    if (this.current !== null) this.current.apply(false);
    this._index = value;
    this._current = this._index > -1 ? this.members[this._index] : null;
    if (this.current !== null) this.current.apply(true);
    this.apply();
  }

  get current () { return this._current; }

  set current (member) {
    this.index = this.members.indexOf(member);
  }

  apply () {}
}

class DisclosureButton {
  constructor (element, disclosure) {
    this.element = element;
    this.disclosure = disclosure;
    this.hasAttribute = this.element.hasAttribute(this.disclosure.attributeName);
    this.element.addEventListener('click', this.click.bind(this));
    this.observer = new MutationObserver(this.mutate.bind(this));
    this.observe();
  }

  observe () {
    this.observer.observe(this.element, { attributes: true });
  }

  click (e) {
    this.disclosure.change(this.hasAttribute);
  }

  mutate (mutations) {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === this.disclosure.attributeName) this.disclosure.change(this.disclosed);
    });
  }

  apply (value) {
    if (!this.hasAttribute) return;
    if (this.observer) this.observer.disconnect();
    this.element.setAttribute(this.disclosure.attributeName, value);
    if (this.observer) this.observe();
  }

  get disclosed () {
    return this.element.getAttribute(this.disclosure.attributeName) === 'true';
  }
}

const disclosures = [];

class Disclosure {
  constructor (element) {
    this.element = element;
    this.id = element.id;
    this.buttons = [];
    this.disclosed = null;
    this._selector = this.constructor.selector;
    this.modifier = this._selector + '--' + this.type.id;
    this.attributeName = this.type.aria ? 'aria-' + this.type.id : ns.attr(this.type.id);

    const buttons = document.querySelectorAll(this.type.aria ? `[aria-controls="${this.id}"]` : ns.attr.selector('controls', this.id));

    if (buttons.length > 0) for (let i = 0; i < buttons.length; i++) this.addButton(buttons[i]);

    this.disclosed = this.disclosed === true;
    this.apply(this.disclosed, true);

    this.group();
  }

  group () {
    DisclosuresGroup.groupById(this, this.GroupConstructor);
    DisclosuresGroup.groupByParent(this, this.GroupConstructor);
  }

  static build (from) {
    const elements = Array.prototype.slice.call(from.querySelectorAll(`.${this.selector}`));

    for (const element of elements) disclosures.push(new this(element));
  }

  get type () { return this.constructor.type; }

  static get type () { return null; }

  static get selector () { return ''; }

  addButton (element) {
    const button = this.buttonFactory(element);
    if (button.hasAttribute) {
      if (this.disclosed === null) {
        this.disclosed = button.disclosed;
      } else button.apply(this.disclosed);
    }
    this.buttons.push(button);
  }

  get GroupConstructor () { return DisclosuresGroup; }

  buttonFactory (button) {
    return new DisclosureButton(button, this);
  }

  disclose () {
    if (this.disclosed) return;

    if (this.group !== undefined) this.group.current = this;
    this.apply(true);
  }

  conceal () {
    if (!this.disclosed) return;

    if (this.group !== undefined) this.group.current = null;
    this.apply(false);
  }

  apply (value, initial) {
    this.disclosed = value;
    if (value) addClass(this.element, this.modifier);
    else removeClass(this.element, this.modifier);
    for (let i = 0; i < this.buttons.length; i++) this.buttons[i].apply(value);
    if (!value) for (const disclosure of disclosures) if (disclosure !== this && this.element.contains(disclosure.element)) disclosure.reset();
  }

  reset () {}

  change (hasAttribute) {
    if (!this.constructor.type.canConceal) this.disclose();
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
  }

  setGroup (group) {
    this.group = group;
  }

  get hasFocus () {
    if (this.element === document.activeElement) return true;
    if (this.element.querySelectorAll(':focus').length > 0) return true;
    if (this.buttons.some((button) => { return button.hasFocus; })) return true;
    return false;
  }

  focus () {
    for (let i = 0; i < this.buttons.length; i++) {
      const button = this.buttons[i];
      if (button.hasAttribute) {
        button.element.focus();
        return;
      }
    }
  }
}

const DISCLOSURE_TYPES = {
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
class CollapseButton extends DisclosureButton {
  get hasFocus () {
    return this.element === document.activeElement;
  }
}

const ascendants = {};

class CollapsesGroup extends DisclosuresGroup {
  get hasFocus () {
    if (this.current === undefined) return null;
    return this.current.hasFocus;
  }

  static register (ascendant, groupSelector) {
    ascendants[ascendant] = groupSelector;
  }

  static get ascendants () { return ascendants; };
}

const COLLAPSE_CLASS = ns('collapse');

/**
 * Tab coorespond au panel d'un élement Tabs (tab panel)
 * Tab étend disclosure qui ajoute/enleve le modifier --selected,
 * et ajoute/eleve l'attribut hidden, sur le panel
 */
class Collapse extends Disclosure {
  constructor (element) {
    super(element);

    element.addEventListener('transitionend', this.transitionend.bind(this));
  }

  group () {
    for (const ascendant in CollapsesGroup.ascendants) {
      let element = this.element.parentElement;

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

    super.group();
  }

  get GroupConstructor () { return CollapsesGroup; }

  buttonFactory (element) {
    return new CollapseButton(element, this);
  }

  static get type () { return DISCLOSURE_TYPES.expand; }
  static get selector () { return COLLAPSE_CLASS; }

  transitionend (e) {
    if (!this.disclosed) this.element.style.maxHeight = '';
  }

  apply (value, initial) {
    if (value) this.element.style.maxHeight = 'none';
    this.element.style.setProperty('--collapser', 'none');
    const height = this.element.offsetHeight;
    this.element.style.setProperty('--collapse', -height + 'px');
    this.element.style.setProperty('--collapser', '');

    window.requestAnimationFrame(() => super.apply(value, initial));
  }

  reset () {
    this.apply(false);
  }

  get buttonHasFocus () {
    if (this.buttons.some((button) => { return button.hasFocus; })) return true;
    return false;
  }

  get hasFocus () {
    if (this.element === document.activeElement) return true;
    if (this.element.querySelectorAll(':focus').length > 0) return true;
    return this.buttonHasFocus;
  }
}

class Equisized {
  constructor (selector, group) {
    this.selector = selector;
    this.group = group;
    this.elements = this.group.querySelectorAll(this.selector);
    this.maxWidth = 0;

    this.changing = this.change.bind(this);
    window.addEventListener('resize', this.changing);
    window.addEventListener('load', this.changing); // fix change before css load
    // this.change();
  }

  change () {
    this.reset();
    for (let i = 0; i < this.elements.length; i++) {
      const tmpWWidth = this._getWidth(this.elements[i]);
      if (tmpWWidth > this.maxWidth) {
        this.maxWidth = tmpWWidth;
      }
    }
    this.apply();
  }

  apply () {
    for (let i = 0; i < this.elements.length; i++) {
      this.elements[i].style.width = this.maxWidth + 1 + 'px';
    }
  }

  reset () {
    for (let i = 0; i < this.elements.length; i++) {
      this.elements[i].style.width = 'auto';
    }
    this.maxWidth = 0;
  }

  _getWidth (el) {
    let width = el.offsetWidth;
    const style = getComputedStyle(el);
    width += parseInt(style.marginLeft) + parseInt(style.marginRight);
    return width;
  }
}

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

const build = () => {
  Collapse.build(document);
};

/* eslint-disable no-new */

new Initializer(`.${COLLAPSE_CLASS}`, [build]);
//# sourceMappingURL=core.module.js.map
