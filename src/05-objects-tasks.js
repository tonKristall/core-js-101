/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  return {
    width,
    height,
    getArea() { return width * height; },
  };
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const obj = JSON.parse(json);
  const result = {};
  Object.setPrototypeOf(result, proto);
  const keys = Object.keys(obj);
  keys.forEach((key) => {
    result[key] = obj[key];
  });
  return result;
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

class CreateElement {
  constructor() {
    this.tags = '';
    this.ids = '';
    this.classes = '';
    this.attrs = '';
    this.pseudoClasses = '';
    this.pseudoElements = '';
    this.combines = '';
  }

  element(value) {
    if (this.tags) throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    if (!this.checkFollowing('element')) throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    this.tags = value;
    return this;
  }

  id(value) {
    if (this.ids) throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    if (!this.checkFollowing('id')) throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    this.ids = `#${value}`;
    return this;
  }

  class(value) {
    if (!this.checkFollowing('class')) throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    this.classes += `.${value}`;
    return this;
  }

  attr(value) {
    if (!this.checkFollowing('attr')) throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    this.attrs = `[${value}]`;
    return this;
  }

  pseudoClass(value) {
    if (!this.checkFollowing('pseudoClass')) throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    this.pseudoClasses += `:${value}`;
    return this;
  }

  pseudoElement(value) {
    if (this.pseudoElements) throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    this.pseudoElements = `::${value}`;
    return this;
  }

  combine(selector1, combinator, selector2) {
    this.combines = `${selector1.stringify()} ${combinator} ${selector2.stringify()}`;
    return this;
  }

  stringify() {
    return this.combines
      ? this.combines
      : `${this.tags}${this.ids}${this.classes}${this.attrs}${this.pseudoClasses}${this.pseudoElements}`;
  }

  checkFollowing(selector) {
    let isCheck = true;
    switch (selector) {
      case 'element':
        isCheck = !(
          this.ids || this.classes || this.attrs || this.pseudoClasses || this.pseudoElements
        );
        break;
      case 'id':
        isCheck = !(this.classes || this.attrs || this.pseudoClasses || this.pseudoElements);
        break;
      case 'class':
        isCheck = !(this.attrs || this.pseudoClasses || this.pseudoElements);
        break;
      case 'attr':
        isCheck = !(this.pseudoClasses || this.pseudoElements);
        break;
      case 'pseudoClass':
        isCheck = !this.pseudoElements;
        break;
      default:
        isCheck = true;
    }
    return isCheck;
  }
  // element, id, class, attribute, pseudo - class, pseudo-element";
}

const cssSelectorBuilder = {
  element(value) {
    return new CreateElement().element(value);
  },

  id(value) {
    return new CreateElement().id(value);
  },

  class(value) {
    return new CreateElement().class(value);
  },

  attr(value) {
    return new CreateElement().attr(value);
  },

  pseudoClass(value) {
    return new CreateElement().pseudoClass(value);
  },

  pseudoElement(value) {
    return new CreateElement().pseudoElement(value);
  },

  combine(selector1, combinator, selector2) {
    return new CreateElement().combine(selector1, combinator, selector2);
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
