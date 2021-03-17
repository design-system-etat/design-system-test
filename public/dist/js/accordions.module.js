/*! DSFR v0.5.5 | licence MIT */

const namespace = 'dsfr';

const api = window[namespace] || {};
window[namespace] = api;

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
//# sourceMappingURL=accordions.module.js.map
