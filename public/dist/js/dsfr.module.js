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

const build$7 = () => {
  Collapse.build(document);
};

/* eslint-disable no-new */

new Initializer(`.${COLLAPSE_CLASS}`, [build$7]);

const ACCORDIONS_GROUP = api.ns('accordions-group');
const ACCORDION_ASCENDANT = api.ns('accordion');

class AccordionsGroup extends api.CollapsesGroup {
  // constructor (id, element) {
  //   super(id, element);
  //   // this._attachEvents();
  // }

  _attachEvents () {
    this.keyEvents = new api.KeyListener(this.element);
    this.keyEvents.down(api.KeyListener.DOWN, this.arrowDownPress.bind(this), true, true);
    this.keyEvents.down(api.KeyListener.UP, this.arrowUpPress.bind(this), true, true);
    this.keyEvents.down(api.KeyListener.HOME, this.homePress.bind(this), true, true);
    this.keyEvents.down(api.KeyListener.END, this.endPress.bind(this), true, true);
  }

  get focusIndex () {
    for (let i = 0; i < this.members.length; i++) if (this.members[i].buttonHasFocus) return i;
    return -1;
  }

  /**
   * Selectionne l'element suivant de la liste si on est sur un bouton
   * Si on est à la fin on retourne au début
   */
  arrowDownPress () {
    let index = this.focusIndex;
    if (index === -1) return;
    index++;
    if (index >= this.length) index = 0;
    this.members[index].focus();
  };

  /**
   * Selectionne l'element précédent de la liste si on est sur un bouton
   * Si on est au debut retourne a la fin
   */
  arrowUpPress () {
    let index = this.focusIndex;
    if (index === -1) return;
    index--;
    if (index < 0) index = this.length - 1;
    this.members[index].focus();
  };

  /**
   * Selectionne le permier element de la liste si on est sur un bouton
   */
  homePress () {
    if (this.focusIndex === -1) return;
    this.members[0].focus();
  };

  /**
   * Selectionne le dernier element de la liste si on est sur un bouton
   */
  endPress () {
    if (this.focusIndex === -1) return;
    this.members[this.length - 1].focus();
  };

  static get selector () { return ACCORDIONS_GROUP; }

  apply () {
    super.apply();
    if (this.current !== null) this.current.focus();
  }
}

api.AccordionsGroup = AccordionsGroup;

api.CollapsesGroup.register(ACCORDION_ASCENDANT, AccordionsGroup);

const BUTTON_SELECTOR = api.ns.selector('btn');
const BUTTONS_GROUP_SELECTOR = api.ns.selector('btns-group');
const EQUISIZED_BUTTONS_GROUP_SELECTOR = api.ns.selector('btns-group--equisized');

const build$6 = () => {
  const group = document.querySelectorAll(EQUISIZED_BUTTONS_GROUP_SELECTOR);
  const arrayEquisized = [];
  for (let i = 0; i < group.length; i++) {
    arrayEquisized.push(new api.Equisized(BUTTON_SELECTOR, group[i]));
  }
};

/* eslint-disable no-new */

new api.Initializer(BUTTONS_GROUP_SELECTOR, [build$6]);

const MODAL_SELECTOR = api.ns.selector('modal');
const MODAL_CLASS = api.ns('modal');
const NO_SCROLL_CLASS = api.ns('no-scroll');
const SCROLL_SHADOW_CLASS = api.ns('scroll-shadow');
const MODAL_BODY_SELECTOR = api.ns.selector('modal__body');
const OFFSET_MOBILE = 32; // 32px => 8v => 2rem

const unordereds = [
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

const UNORDEREDS = unordereds.join();

const ordereds = [
  '[tabindex]:not([tabindex="-1"]):not([tabindex="0"])'
];

const ORDEREDS = ordereds.join();

const isFocusable = (element, container) => {
  if (window.getComputedStyle(element).visibility === 'hidden') return false;
  if (container === undefined) container = element;

  while (container.contains(element)) {
    if (window.getComputedStyle(element).display === 'none') return false;
    element = element.parentElement;
  }

  return true;
};

class FocusTrap {
  constructor (onTrap, onUntrap) {
    this.element = null;
    this.activeElement = null;
    this.onTrap = onTrap;
    this.onUntrap = onUntrap;
    this.waiting = this.wait.bind(this);
    this.handling = this.handle.bind(this);
    this.current = null;
  }

  get trapped () { return this.element !== null; }

  trap (element) {
    if (this.trapped) this.untrap();

    this.element = element;
    this.isTrapping = true;
    this.wait();

    if (this.onTrap) this.onTrap();
  }

  wait () {
    if (!isFocusable(this.element)) {
      api.engine.renderer.next(this.waiting);
      return;
    }

    this.trapping();
  }

  trapping () {
    if (!this.isTrapping) return;
    this.isTrapping = false;
    const focusables = this.focusables;
    if (focusables.length) focusables[0].focus();
    this.element.setAttribute('aria-modal', true);
    this.element.addEventListener('keydown', this.handling);

    this.stunneds = [];
    this.stun(document.body);
  }

  stun (node) {
    for (const child of node.children) {
      if (child === this.element) continue;
      if (child.contains(this.element)) {
        this.stun(child);
        continue;
      }
      this.stunneds.push(new Stunned(child));
    }
  }

  handle (e) {
    if (e.keyCode !== 9) return;

    const focusables = this.focusables;
    if (focusables.length === 0) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    const index = focusables.indexOf(document.activeElement);

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
  }

  get focusables () {
    let unordereds = [...this.element.querySelectorAll(UNORDEREDS)];

    /**
     *  filtrage des radiobutttons dans des fieldset (la navigations d'un groupe de radio se fait à la flèche et non pas au tab
     **/
    const fieldsets = [...this.element.querySelectorAll('fieldset')];
    let radios = [];

    for (const fieldset of fieldsets) {
      // eslint-disable-next-line no-useless-call
      if ([...fieldset.querySelectorAll('input[type="radio"]:focus')].length) radios = radios.concat([...fieldset.querySelectorAll('input[type="radio"]:not(:focus)')]);
      else if ([...fieldset.querySelectorAll('input[type="radio"]:checked')].length) radios = radios.concat([...fieldset.querySelectorAll('input[type="radio"]:not(:checked)')]);
      else radios = radios.concat([...fieldset.querySelectorAll('input[type="radio"]')].splice(0, 1));
    }
    unordereds = unordereds.filter((unordered) => {
      return radios.indexOf(unordered) === -1;
    });

    const ordereds = [...this.element.querySelectorAll(ORDEREDS)];

    ordereds.sort((a, b) => a.tabIndex - b.tabIndex);

    const noDuplicates = unordereds.filter((element) => ordereds.indexOf(element) === -1);
    const concateneds = ordereds.concat(noDuplicates);
    const filtereds = concateneds.filter((element) => element.tabIndex !== '-1' && isFocusable(element, this.element));

    return filtereds;
  }

  untrap () {
    if (!this.trapped) return;
    this.isTrapping = false;

    this.element.removeAttribute('aria-modal');
    this.element.removeEventListener('keydown', this.handling);
    this.element = null;

    for (const stunned of this.stunneds) stunned.unstun();
    this.stunneds = [];

    if (this.onUntrap) this.onUntrap();
  }
}

class Stunned {
  constructor (element) {
    this.element = element;
    this.hidden = element.getAttribute('aria-hidden');
    this.inert = element.getAttribute('inert');

    this.element.setAttribute('aria-hidden', true);
    this.element.setAttribute('inert', '');
  }

  unstun () {
    if (this.hidden === null) this.element.removeAttribute('aria-hidden');
    else this.element.setAttribute('aria-hidden', this.hidden);

    if (this.inert === null) this.element.removeAttribute('inert');
    else this.element.setAttribute('inert', this.inert);
  }
}

class ModalsGroup extends api.DisclosuresGroup {
  constructor () {
    super();
    this.trap = new FocusTrap();
  }

  apply (value, initial) {
    super.apply(value, initial);
    if (this.current === null) this.trap.untrap();
    else this.trap.trap(this.current.element);
  }
}

class ModalButton extends api.DisclosureButton {
  /**
   * TODO: https://a11ysupport.io/tech/aria/aria-haspopup_attribute
   */
  apply (value) {
    super.apply(value);
    // if (!this.hasAttribute) return;
    // this.element.setAttribute(this.disclosure.attributeName, value);
  }
}

const group = new ModalsGroup();

class Modal extends api.Disclosure {
  constructor (element) {
    super(element);
    this.body = this.element.querySelector(MODAL_BODY_SELECTOR);
    this.scrollDistance = 0;
    this.scrolling = this.resize.bind(this, false);
    this.resizing = this.resize.bind(this, true);
    this.listen();
    this.resize(true);
  }

  listen () {
    this.element.addEventListener('click', this.click.bind(this));

    this.keyListener = new api.KeyListener(this.element);
    this.keyListener.down(api.KeyListener.ESCAPE, this.conceal.bind(this), true, true);

    if (this.body) {
      this.body.addEventListener('scroll', this.scrolling);
      window.addEventListener('resize', this.resizing);
      window.addEventListener('orientationchange', this.resizing);
    }
  }

  click (e) {
    if (this.body && this.element === e.target) this.conceal();
  }

  group () {
    group.add(this);
  }

  apply (value, initial) {
    this.handleScroll(!value);
    if (!value) {
      if (!initial) this.focus();
    } else {
      if (!initial) this.resize(true);
    }
    super.apply(value, initial);
  }

  /**
   * Fixe l'arrière plan quand la modal est ouverte
   */
  // TODO: créer une fonction de fix de scroll dans core (api.noScroll = true)
  handleScroll (isScrollable) {
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
  }

  /**
   * Ajoute une ombre autour du footer lorsque l'on peut scroller dans la modale
   * corrige le 100vh, en mobile notamment, lorsque la barre navigateur est présente par exemple.
   */
  resize (isResizing, e) {
    if (!this.body) return;
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
      requestAnimationFrame(() => {
        this.body.style.maxHeight = (window.innerHeight - OFFSET_MOBILE) + 'px';
      });
    }
  }

  static get type () { return api.DISCLOSURE_TYPES.expand; }
  static get selector () { return MODAL_CLASS; }

  buttonFactory (element) {
    return new ModalButton(element, this);
  }

  get GroupConstructor () { return ModalsGroup; }
}

api.Modal = Modal;
api.ModalButton = ModalButton;
api.ModalsGroup = ModalsGroup;
api.FocusTrap = FocusTrap;

/**
 * initialise tout les éléments Modal dans la page
 */
const build$5 = () => {
  Modal.build(document);
};

/* eslint-disable no-new */

new api.Initializer(MODAL_SELECTOR, [build$5]);

const NAVIGATION_CLASS = api.ns('nav');
const NAVIGATION_LIST_CLASS = api.ns('nav__list');
const NAVIGATION_ITEM_CLASS = api.ns('nav__item');
const NAVIGATION_ITEM_RIGHT_CLASS = api.ns('nav__item--align-right');
const NAVIGATION_MENU_CLASS = api.ns('menu');

class Navigation extends api.CollapsesGroup {
  constructor (id, element) {
    super(id, element);

    this.menus = [];

    this.navList = element.querySelector(`.${NAVIGATION_LIST_CLASS}`);

    document.addEventListener('focusout', this.focusOut.bind(this));
    window.addEventListener('resize', this.resize.bind(this));
    window.addEventListener('orientationchange', this.resize.bind(this));
    this.resize();
  }

  static get selector () { return NAVIGATION_CLASS; }

  add (member) {
    super.add(member);

    if (member.element.classList.contains(NAVIGATION_MENU_CLASS)) {
      this.menus.push(new NavigationMenu(member, this.navList.getBoundingClientRect().right));
    }
  }

  focusOut (e) {
    requestAnimationFrame(() => {
      if (this.current !== null && !this.current.hasFocus) this.index = -1;
    });
  }

  get index () { return super.index; }

  set index (value) {
    if (value === -1 && this.current !== null && this.current.hasFocus) this.current.focus();
    super.index = value;
  }

  resize () {
    const right = this.navList.getBoundingClientRect().right;

    for (const menu of this.menus) menu.place(right);
  }
}

class NavigationMenu {
  constructor (collapse, right) {
    this.initialize(collapse);
    this.place(right);
  }

  initialize (collapse) {
    this.element = collapse.element;

    for (const button of collapse.buttons) {
      if (!button.hasAttribute) continue;
      this.button = button.element;
      break;
    }

    let item = this.element.parentElement;
    while (item) {
      if (item.classList.contains(NAVIGATION_ITEM_CLASS)) {
        this.item = item;
        break;
      }
      item = item.parentElement;
    }
  }

  place (right) {
    const styles = getComputedStyle(this.element);
    const width = parseFloat(styles.width);
    const left = this.button.getBoundingClientRect().left;

    if (left + width > right) api.addClass(this.item, NAVIGATION_ITEM_RIGHT_CLASS);
    else api.removeClass(this.item, NAVIGATION_ITEM_RIGHT_CLASS);
  }
}

api.Navigation = Navigation;

api.CollapsesGroup.register(NAVIGATION_CLASS, Navigation);

const SCHEME_ATTR = api.ns.attr('theme');
const TRANSITION_ATTR = api.ns.attr('transition');

class Scheme {
  constructor () {
    this.init();
  }

  init () {
    this.scheme = localStorage.getItem('scheme')
      ? localStorage.getItem('scheme')
      : null;

    if (this.scheme === null) {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        this.scheme = 'dark';
        localStorage.setItem('scheme', 'dark');
      } else this.scheme = 'light';
    }

    this.root = document.documentElement;

    if (this.scheme === 'dark') {
      if (!this.root.hasAttribute(TRANSITION_ATTR)) {
        this.root.setAttribute(SCHEME_ATTR, 'dark');
      } else {
        this.root.removeAttribute(TRANSITION_ATTR);
        this.root.setAttribute(SCHEME_ATTR, 'dark');

        setTimeout(() => {
          this.root.setAttribute(TRANSITION_ATTR, '');
        }, 300);
      }
    } else this.root.setAttribute(SCHEME_ATTR, 'light');

    this.observer = new MutationObserver(this.mutate.bind(this));
    this.observer.observe(this.root, { attributes: true });
  }

  mutate (mutations) {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === SCHEME_ATTR) {
        const scheme = this.root.getAttribute(SCHEME_ATTR);
        if (scheme === 'dark') {
          localStorage.setItem('scheme', 'dark');
        } else if (scheme === 'light') {
          localStorage.setItem('scheme', 'light');
        }
      }
    });
  }
}

api.Scheme = Scheme;

const RADIOS_THEME_NAME = `input[name="${api.ns.selector('radios-theme', '')}"]`;
const SWITCH_THEME_ID = api.ns.selector('switch-theme', '#');
const THEME_ATTR = api.ns.attr('theme');

/* eslint-disable no-new */

const build$4 = () => {
  new Scheme();
};

class SwitchTheme {
  constructor () {
    this.attributeName = THEME_ATTR;
    this.theme = null;
    this.radios = document.querySelectorAll(RADIOS_THEME_NAME);

    for (var i = 0; i < this.radios.length; i++) {
      this.radios[i].addEventListener('change', this.change.bind(this));
    }

    this.observer = new MutationObserver(this.mutate.bind(this));
    this.observe();
    this.apply();
  }

  observe () {
    this.observer.observe(document.documentElement, { attributes: true });
  }

  mutate (mutations) {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === this.attributeName) {
        this.apply();
      }
    });
  }

  apply () {
    const theme = document.documentElement.getAttribute(this.attributeName);
    this.isApplying = true;
    for (var i = 0; i < this.radios.length; i++) {
      this.radios[i].checked = this.radios[i].value === theme;
    }
    this.isApplying = false;
  }

  change () {
    if (this.isApplying) return;
    if (this.observer) this.observer.disconnect();
    this.theme = document.querySelector(RADIOS_THEME_NAME + ':checked');
    if (this.theme) {
      document.documentElement.setAttribute(this.attributeName, this.theme.value);
    } else {
      document.documentElement.removeAttribute(this.attributeName);
    }
    if (this.observer) this.observe();
  }
}

/* eslint-disable no-new */

const build$3 = () => {
  new SwitchTheme();
};

/* eslint-disable no-new */

new api.Initializer(`:root[${SCHEME_ATTR}]`, [build$4]);
new api.Initializer(`${SWITCH_THEME_ID}`, [build$3]);

const SIDEMENU_CLASS = api.ns('sidemenu');
const SIDEMENU_LIST_CLASS = api.ns('sidemenu__list');

/* eslint-disable no-new */

api.CollapsesGroup.register(SIDEMENU_CLASS, SIDEMENU_LIST_CLASS);

const TABLE_SELECTOR = api.ns.selector('table');
// const TABLE_CLASS = api.ns('table');
const TABLE_SCROLLING_SELECTOR = `${api.ns.selector('table')}:not(${api.ns.selector('table--no-scroll')})`;
const LEFT = 'left';
const RIGHT = 'right';
const SHADOW_CLASS = api.ns('table--shadow');
const SHADOW_LEFT_CLASS = api.ns('table--shadow-left');
const SHADOW_RIGHT_CLASS = api.ns('table--shadow-right');
const WRAPPER_CLASS = api.ns('table__wrapper');
const CAPTION_BOTTOM_CLASS = ('table--caption-bottom');
const SCROLL_OFFSET = 1; // valeur en px du scroll avant laquelle le shadow s'active ou se desactive

class Table {
  constructor (table) {
    this.init(table);
  }

  init (table) {
    this.table = table;
    this.tableElem = this.table.querySelector('table');
    this.tableContent = this.tableElem.querySelector('tbody');
    this.isScrollable = this.tableContent.offsetWidth > this.tableElem.offsetWidth;
    this.caption = this.tableElem.querySelector('caption');
    this.captionHeight = 0;
    this.wrap();

    const scrolling = this.change.bind(this);
    this.tableElem.addEventListener('scroll', scrolling);
    this.change();
  }

  change () {
    const newScroll = this.tableContent.offsetWidth > this.tableElem.offsetWidth;
    let firstTimeScrollable = this.tableElem.offsetWidth > this.table.offsetWidth;
    if (newScroll || firstTimeScrollable) {
      this.scroll();
      this.handleCaption();
    } else {
      if (newScroll !== this.isScrollable) this.delete();
    }
    this.isScrollable = newScroll;
    firstTimeScrollable = false;
  }

  delete () {
    api.removeClass(this.table, SHADOW_RIGHT_CLASS);
    api.removeClass(this.table, SHADOW_LEFT_CLASS);
    api.removeClass(this.table, SHADOW_CLASS);
    if (this.caption) {
      this.tableElem.style.marginTop = '';
      this.caption.style.top = '';
      this.tableElem.style.marginBottom = '';
      this.caption.style.bottom = '';
    }
  }

  scroll () {
    api.addClass(this.table, SHADOW_CLASS);
    this.setShadowPosition();
  }

  /* ajoute un wrapper autour du tableau */
  wrap () {
    const wrapperHtml = document.createElement('div');
    wrapperHtml.className = WRAPPER_CLASS;
    this.table.insertBefore(wrapperHtml, this.tableElem);
    wrapperHtml.appendChild(this.tableElem);
    this.tableInnerWrapper = wrapperHtml;
  }

  /* affiche les blocs shadow en fonction de la position du scroll, en ajoutant la classe visible */
  setShadowPosition () {
    const tableScrollLeft = this.getScrollPosition(LEFT);
    const tableScrollRight = this.getScrollPosition(RIGHT);

    // on inverse en cas de lecture droite - gauche
    if (document.documentElement.getAttribute('dir') === 'rtl') {
      this.setShadowVisibility(RIGHT, tableScrollLeft);
      this.setShadowVisibility(LEFT, tableScrollRight);
    } else {
      this.setShadowVisibility(LEFT, tableScrollLeft);
      this.setShadowVisibility(RIGHT, tableScrollRight);
    }
  }

  /* Donne le nombre de pixels scrollés honrizontalement dans un element scrollable */
  getScrollPosition (side) {
    let inverter = 1;
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
  }

  /* positionne la caption en top négatif et ajoute un margin-top au wrapper */
  handleCaption () {
    if (this.caption) {
      const style = getComputedStyle(this.caption);
      const newHeight = this.caption.offsetHeight + parseInt(style.marginTop) + parseInt(style.marginBottom);
      this.captionHeight = newHeight;
      if (this.table.classList.contains(CAPTION_BOTTOM_CLASS)) {
        this.tableElem.style.marginBottom = this.captionHeight + 'px';
        this.caption.style.bottom = -this.captionHeight + 'px';
      } else {
        this.tableElem.style.marginTop = this.captionHeight + 'px';
        this.caption.style.top = -this.captionHeight + 'px';
      }
    }
  }

  /* ajoute la classe rf-table--shadow-right ou rf-table--shadow-right sur rf-table
   en fonction d'une valeur de scroll et du sens (right, left) */
  setShadowVisibility (side, scrollPosition) {
    // si on a pas scroll, ou qu'on scroll jusqu'au bout
    if (scrollPosition <= SCROLL_OFFSET) {
      if (side === LEFT) api.removeClass(this.table, SHADOW_LEFT_CLASS);
      else if (side === RIGHT) api.removeClass(this.table, SHADOW_RIGHT_CLASS);
    } else {
      if (side === LEFT) api.addClass(this.table, SHADOW_LEFT_CLASS);
      else if (side === RIGHT) api.addClass(this.table, SHADOW_RIGHT_CLASS);
    }
  }
}

api.Table = Table;

const tables = [];

const change = () => {
  for (let i = 0; i < tables.length; i++) tables[i].change();
};

const build$2 = () => {
  const tableNodes = document.querySelectorAll(TABLE_SCROLLING_SELECTOR);
  for (let i = 0; i < tableNodes.length; i++) tables.push(new Table(tableNodes[i]));

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
class TabButton extends api.DisclosureButton {
  apply (value) {
    super.apply(value);
    if (this.hasAttribute) {
      this.element.setAttribute('tabindex', value ? '0' : '-1');
    }
  }
}

const TABS_SELECTOR = api.ns.selector('tabs');
const TABS_CLASS = api.ns('tabs');
const TAB_CLASS = api.ns('tabs__tab');
const PANEL_CLASS = api.ns('tabs__panel');
const LIST_CLASS = api.ns('tabs__list');

/**
* TabGroup est la classe étendue de DiscosuresGroup
* Correspond à un objet Tabs avec plusieurs tab-button & Tab (panel)
*/
class TabsGroup extends api.DisclosuresGroup {
  constructor (id, element) {
    super(id, element);
    this.list = element.querySelector(`.${LIST_CLASS}`);

    element.addEventListener('transitionend', this.transitionend.bind(this));

    this.listen();
    api.engine.renderer.add(this.render.bind(this));
  }

  static get selector () { return TABS_CLASS; }

  transitionend (e) {
    this.element.style.transition = 'none';
  }

  listen () {
    this.keyListener = new api.KeyListener(this.element);
    this.keyListener.down(api.KeyListener.RIGHT, this.arrowRightPress.bind(this), true, true);
    this.keyListener.down(api.KeyListener.LEFT, this.arrowLeftPress.bind(this), true, true);
    this.keyListener.down(api.KeyListener.HOME, this.homePress.bind(this), true, true);
    this.keyListener.down(api.KeyListener.END, this.endPress.bind(this), true, true);
  }

  /**
   * Selectionne l'element suivant de la liste si on est sur un bouton
   * Si on est à la fin on retourne au début
   */
  arrowRightPress () {
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
  arrowLeftPress () {
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
  homePress () {
    if (document.activeElement.classList.contains(TAB_CLASS)) {
      this.index = 0;
      this.focus();
    }
  };

  /**
   * Selectionne le dernier element de la liste si on est sur un bouton
   */
  endPress () {
    if (document.activeElement.classList.contains(TAB_CLASS)) {
      this.index = this.length - 1;
      this.focus();
    }
  };

  focus () {
    if (this.current) this.current.focus();
  }

  apply (value, initial) {
    for (let i = 0; i < this._index; i++) this.members[i].translate(-1, initial);
    this.current.element.style.transform = '';
    for (let i = this._index + 1; i < this.length; i++) this.members[i].translate(1, initial);
    this.element.style.transition = '';
  }

  add (tab) {
    super.add(tab);
    if (this.length === 1 || tab.disclosed) this.current = tab;
    else {
      const index = this.members.indexOf(tab);
      if (this._index > -1 && this._index !== index) tab.element.style.transform = `translateX(${index < this._index ? -100 : 100}%)`;
    }
  }

  render () {
    if (this.current === null) return;
    const paneHeight = Math.round(this.current.element.offsetHeight);
    if (this.panelHeight === paneHeight) return;
    this.panelHeight = paneHeight;
    this.element.style.height = (this.panelHeight + this.list.offsetHeight) + 'px';
  }
}

/**
  * Tab coorespond au panel d'un élement Tabs (tab panel)
  * Tab étend disclosure qui ajoute/enleve le modifier --selected,
  * et ajoute/eleve l'attribut hidden, sur le panel
  */
class Tab extends api.Disclosure {
  static get type () { return api.DISCLOSURE_TYPES.select; }
  static get selector () { return PANEL_CLASS; }

  get GroupConstructor () { return TabsGroup; }

  buttonFactory (element) {
    return new TabButton(element, this);
  }

  translate (direction, initial) {
    if (initial) this.element.style.transition = 'none';
    this.element.style.transform = `translate(${direction * 100}%)`;
    if (initial) this.element.style.transition = '';
  }

  reset () {
    this.group.index = 0;
  }
}

api.Tab = Tab;
api.TabButton = TabButton;
api.TabsGroup = TabsGroup;

/**
* Initialise tout les éléments Tab dans la page
*/
const build$1 = () => {
  Tab.build(document);
};

/* eslint-disable no-new */

new api.Initializer(TABS_SELECTOR, [build$1]);

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
//# sourceMappingURL=dsfr.module.js.map
