/*! DSFR v0.5.5 | licence MIT */

(function () {
  'use strict';

  var namespace = 'dsfr';

  var api = window[namespace] || {};
  window[namespace] = api;

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
  var build = function () {
    Modal.build(document);
  };

  /* eslint-disable no-new */

  new api.Initializer(MODAL_SELECTOR, [build]);

}());
//# sourceMappingURL=modal.nomodule.js.map
