var index = (function () {
  'use strict';

  function _arrayLikeToArray(r, a) {
    (null == a || a > r.length) && (a = r.length);
    for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
    return n;
  }
  function _arrayWithHoles(r) {
    if (Array.isArray(r)) return r;
  }
  function _decorate(e, r, t, i) {
    var o = _getDecoratorsApi();
    if (i) for (var n = 0; n < i.length; n++) o = i[n](o);
    var s = r(function (e) {
        o.initializeInstanceElements(e, a.elements);
      }, t),
      a = o.decorateClass(_coalesceClassElements(s.d.map(_createElementDescriptor)), e);
    return o.initializeClassElements(s.F, a.elements), o.runClassFinishers(s.F, a.finishers);
  }
  function _getDecoratorsApi() {
    _getDecoratorsApi = function () {
      return e;
    };
    var e = {
      elementsDefinitionOrder: [["method"], ["field"]],
      initializeInstanceElements: function (e, r) {
        ["method", "field"].forEach(function (t) {
          r.forEach(function (r) {
            r.kind === t && "own" === r.placement && this.defineClassElement(e, r);
          }, this);
        }, this);
      },
      initializeClassElements: function (e, r) {
        var t = e.prototype;
        ["method", "field"].forEach(function (i) {
          r.forEach(function (r) {
            var o = r.placement;
            if (r.kind === i && ("static" === o || "prototype" === o)) {
              var n = "static" === o ? e : t;
              this.defineClassElement(n, r);
            }
          }, this);
        }, this);
      },
      defineClassElement: function (e, r) {
        var t = r.descriptor;
        if ("field" === r.kind) {
          var i = r.initializer;
          t = {
            enumerable: t.enumerable,
            writable: t.writable,
            configurable: t.configurable,
            value: void 0 === i ? void 0 : i.call(e)
          };
        }
        Object.defineProperty(e, r.key, t);
      },
      decorateClass: function (e, r) {
        var t = [],
          i = [],
          o = {
            static: [],
            prototype: [],
            own: []
          };
        if (e.forEach(function (e) {
          this.addElementPlacement(e, o);
        }, this), e.forEach(function (e) {
          if (!_hasDecorators(e)) return t.push(e);
          var r = this.decorateElement(e, o);
          t.push(r.element), t.push.apply(t, r.extras), i.push.apply(i, r.finishers);
        }, this), !r) return {
          elements: t,
          finishers: i
        };
        var n = this.decorateConstructor(t, r);
        return i.push.apply(i, n.finishers), n.finishers = i, n;
      },
      addElementPlacement: function (e, r, t) {
        var i = r[e.placement];
        if (!t && -1 !== i.indexOf(e.key)) throw new TypeError("Duplicated element (" + e.key + ")");
        i.push(e.key);
      },
      decorateElement: function (e, r) {
        for (var t = [], i = [], o = e.decorators, n = o.length - 1; n >= 0; n--) {
          var s = r[e.placement];
          s.splice(s.indexOf(e.key), 1);
          var a = this.fromElementDescriptor(e),
            l = this.toElementFinisherExtras((0, o[n])(a) || a);
          e = l.element, this.addElementPlacement(e, r), l.finisher && i.push(l.finisher);
          var c = l.extras;
          if (c) {
            for (var p = 0; p < c.length; p++) this.addElementPlacement(c[p], r);
            t.push.apply(t, c);
          }
        }
        return {
          element: e,
          finishers: i,
          extras: t
        };
      },
      decorateConstructor: function (e, r) {
        for (var t = [], i = r.length - 1; i >= 0; i--) {
          var o = this.fromClassDescriptor(e),
            n = this.toClassDescriptor((0, r[i])(o) || o);
          if (void 0 !== n.finisher && t.push(n.finisher), void 0 !== n.elements) {
            e = n.elements;
            for (var s = 0; s < e.length - 1; s++) for (var a = s + 1; a < e.length; a++) if (e[s].key === e[a].key && e[s].placement === e[a].placement) throw new TypeError("Duplicated element (" + e[s].key + ")");
          }
        }
        return {
          elements: e,
          finishers: t
        };
      },
      fromElementDescriptor: function (e) {
        var r = {
          kind: e.kind,
          key: e.key,
          placement: e.placement,
          descriptor: e.descriptor
        };
        return Object.defineProperty(r, Symbol.toStringTag, {
          value: "Descriptor",
          configurable: !0
        }), "field" === e.kind && (r.initializer = e.initializer), r;
      },
      toElementDescriptors: function (e) {
        if (void 0 !== e) return _toArray(e).map(function (e) {
          var r = this.toElementDescriptor(e);
          return this.disallowProperty(e, "finisher", "An element descriptor"), this.disallowProperty(e, "extras", "An element descriptor"), r;
        }, this);
      },
      toElementDescriptor: function (e) {
        var r = e.kind + "";
        if ("method" !== r && "field" !== r) throw new TypeError('An element descriptor\'s .kind property must be either "method" or "field", but a decorator created an element descriptor with .kind "' + r + '"');
        var t = _toPropertyKey(e.key),
          i = e.placement + "";
        if ("static" !== i && "prototype" !== i && "own" !== i) throw new TypeError('An element descriptor\'s .placement property must be one of "static", "prototype" or "own", but a decorator created an element descriptor with .placement "' + i + '"');
        var o = e.descriptor;
        this.disallowProperty(e, "elements", "An element descriptor");
        var n = {
          kind: r,
          key: t,
          placement: i,
          descriptor: Object.assign({}, o)
        };
        return "field" !== r ? this.disallowProperty(e, "initializer", "A method descriptor") : (this.disallowProperty(o, "get", "The property descriptor of a field descriptor"), this.disallowProperty(o, "set", "The property descriptor of a field descriptor"), this.disallowProperty(o, "value", "The property descriptor of a field descriptor"), n.initializer = e.initializer), n;
      },
      toElementFinisherExtras: function (e) {
        return {
          element: this.toElementDescriptor(e),
          finisher: _optionalCallableProperty(e, "finisher"),
          extras: this.toElementDescriptors(e.extras)
        };
      },
      fromClassDescriptor: function (e) {
        var r = {
          kind: "class",
          elements: e.map(this.fromElementDescriptor, this)
        };
        return Object.defineProperty(r, Symbol.toStringTag, {
          value: "Descriptor",
          configurable: !0
        }), r;
      },
      toClassDescriptor: function (e) {
        var r = e.kind + "";
        if ("class" !== r) throw new TypeError('A class descriptor\'s .kind property must be "class", but a decorator created a class descriptor with .kind "' + r + '"');
        this.disallowProperty(e, "key", "A class descriptor"), this.disallowProperty(e, "placement", "A class descriptor"), this.disallowProperty(e, "descriptor", "A class descriptor"), this.disallowProperty(e, "initializer", "A class descriptor"), this.disallowProperty(e, "extras", "A class descriptor");
        var t = _optionalCallableProperty(e, "finisher");
        return {
          elements: this.toElementDescriptors(e.elements),
          finisher: t
        };
      },
      runClassFinishers: function (e, r) {
        for (var t = 0; t < r.length; t++) {
          var i = (0, r[t])(e);
          if (void 0 !== i) {
            if ("function" != typeof i) throw new TypeError("Finishers must return a constructor.");
            e = i;
          }
        }
        return e;
      },
      disallowProperty: function (e, r, t) {
        if (void 0 !== e[r]) throw new TypeError(t + " can't have a ." + r + " property.");
      }
    };
    return e;
  }
  function _createElementDescriptor(e) {
    var r,
      t = _toPropertyKey(e.key);
    "method" === e.kind ? r = {
      value: e.value,
      writable: !0,
      configurable: !0,
      enumerable: !1
    } : "get" === e.kind ? r = {
      get: e.value,
      configurable: !0,
      enumerable: !1
    } : "set" === e.kind ? r = {
      set: e.value,
      configurable: !0,
      enumerable: !1
    } : "field" === e.kind && (r = {
      configurable: !0,
      writable: !0,
      enumerable: !0
    });
    var i = {
      kind: "field" === e.kind ? "field" : "method",
      key: t,
      placement: e.static ? "static" : "field" === e.kind ? "own" : "prototype",
      descriptor: r
    };
    return e.decorators && (i.decorators = e.decorators), "field" === e.kind && (i.initializer = e.value), i;
  }
  function _coalesceGetterSetter(e, r) {
    void 0 !== e.descriptor.get ? r.descriptor.get = e.descriptor.get : r.descriptor.set = e.descriptor.set;
  }
  function _coalesceClassElements(e) {
    for (var r = [], isSameElement = function (e) {
        return "method" === e.kind && e.key === o.key && e.placement === o.placement;
      }, t = 0; t < e.length; t++) {
      var i,
        o = e[t];
      if ("method" === o.kind && (i = r.find(isSameElement))) {
        if (_isDataDescriptor(o.descriptor) || _isDataDescriptor(i.descriptor)) {
          if (_hasDecorators(o) || _hasDecorators(i)) throw new ReferenceError("Duplicated methods (" + o.key + ") can't be decorated.");
          i.descriptor = o.descriptor;
        } else {
          if (_hasDecorators(o)) {
            if (_hasDecorators(i)) throw new ReferenceError("Decorators can't be placed on different accessors with for the same property (" + o.key + ").");
            i.decorators = o.decorators;
          }
          _coalesceGetterSetter(o, i);
        }
      } else r.push(o);
    }
    return r;
  }
  function _hasDecorators(e) {
    return e.decorators && e.decorators.length;
  }
  function _isDataDescriptor(e) {
    return void 0 !== e && !(void 0 === e.value && void 0 === e.writable);
  }
  function _optionalCallableProperty(e, r) {
    var t = e[r];
    if (void 0 !== t && "function" != typeof t) throw new TypeError("Expected '" + r + "' to be a function");
    return t;
  }
  function _get() {
    return _get = "undefined" != typeof Reflect && Reflect.get ? Reflect.get.bind() : function (e, t, r) {
      var p = _superPropBase(e, t);
      if (p) {
        var n = Object.getOwnPropertyDescriptor(p, t);
        return n.get ? n.get.call(arguments.length < 3 ? e : r) : n.value;
      }
    }, _get.apply(null, arguments);
  }
  function _getPrototypeOf(t) {
    return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) {
      return t.__proto__ || Object.getPrototypeOf(t);
    }, _getPrototypeOf(t);
  }
  function _iterableToArray(r) {
    if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r);
  }
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _superPropBase(t, o) {
    for (; !{}.hasOwnProperty.call(t, o) && null !== (t = _getPrototypeOf(t)););
    return t;
  }
  function _superPropGet(t, o, e, r) {
    var p = _get(_getPrototypeOf(1 & r ? t.prototype : t), o, e);
    return 2 & r && "function" == typeof p ? function (t) {
      return p.apply(e, t);
    } : p;
  }
  function _toArray(r) {
    return _arrayWithHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableRest();
  }
  function _toPrimitive(t, r) {
    if ("object" != typeof t || !t) return t;
    var e = t[Symbol.toPrimitive];
    if (void 0 !== e) {
      var i = e.call(t, r || "default");
      if ("object" != typeof i) return i;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r ? String : Number)(t);
  }
  function _toPropertyKey(t) {
    var i = _toPrimitive(t, "string");
    return "symbol" == typeof i ? i : i + "";
  }
  function _unsupportedIterableToArray(r, a) {
    if (r) {
      if ("string" == typeof r) return _arrayLikeToArray(r, a);
      var t = {}.toString.call(r).slice(8, -1);
      return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
    }
  }

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  /**
   * True if the custom elements polyfill is in use.
   */
  const isCEPolyfill = typeof window !== 'undefined' &&
      window.customElements != null &&
      window.customElements.polyfillWrapFlushCallback !==
          undefined;
  /**
   * Removes nodes, starting from `start` (inclusive) to `end` (exclusive), from
   * `container`.
   */
  const removeNodes = (container, start, end = null) => {
      while (start !== end) {
          const n = start.nextSibling;
          container.removeChild(start);
          start = n;
      }
  };

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  /**
   * An expression marker with embedded unique key to avoid collision with
   * possible text in templates.
   */
  const marker = `{{lit-${String(Math.random()).slice(2)}}}`;
  /**
   * An expression marker used text-positions, multi-binding attributes, and
   * attributes with markup-like text values.
   */
  const nodeMarker = `<!--${marker}-->`;
  const markerRegex = new RegExp(`${marker}|${nodeMarker}`);
  /**
   * Suffix appended to all bound attribute names.
   */
  const boundAttributeSuffix = '$lit$';
  /**
   * An updatable Template that tracks the location of dynamic parts.
   */
  class Template {
      constructor(result, element) {
          this.parts = [];
          this.element = element;
          const nodesToRemove = [];
          const stack = [];
          // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be null
          const walker = document.createTreeWalker(element.content, 133 /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */, null, false);
          // Keeps track of the last index associated with a part. We try to delete
          // unnecessary nodes, but we never want to associate two different parts
          // to the same index. They must have a constant node between.
          let lastPartIndex = 0;
          let index = -1;
          let partIndex = 0;
          const { strings, values: { length } } = result;
          while (partIndex < length) {
              const node = walker.nextNode();
              if (node === null) {
                  // We've exhausted the content inside a nested template element.
                  // Because we still have parts (the outer for-loop), we know:
                  // - There is a template in the stack
                  // - The walker will find a nextNode outside the template
                  walker.currentNode = stack.pop();
                  continue;
              }
              index++;
              if (node.nodeType === 1 /* Node.ELEMENT_NODE */) {
                  if (node.hasAttributes()) {
                      const attributes = node.attributes;
                      const { length } = attributes;
                      // Per
                      // https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap,
                      // attributes are not guaranteed to be returned in document order.
                      // In particular, Edge/IE can return them out of order, so we cannot
                      // assume a correspondence between part index and attribute index.
                      let count = 0;
                      for (let i = 0; i < length; i++) {
                          if (endsWith(attributes[i].name, boundAttributeSuffix)) {
                              count++;
                          }
                      }
                      while (count-- > 0) {
                          // Get the template literal section leading up to the first
                          // expression in this attribute
                          const stringForPart = strings[partIndex];
                          // Find the attribute name
                          const name = lastAttributeNameRegex.exec(stringForPart)[2];
                          // Find the corresponding attribute
                          // All bound attributes have had a suffix added in
                          // TemplateResult#getHTML to opt out of special attribute
                          // handling. To look up the attribute value we also need to add
                          // the suffix.
                          const attributeLookupName = name.toLowerCase() + boundAttributeSuffix;
                          const attributeValue = node.getAttribute(attributeLookupName);
                          node.removeAttribute(attributeLookupName);
                          const statics = attributeValue.split(markerRegex);
                          this.parts.push({ type: 'attribute', index, name, strings: statics });
                          partIndex += statics.length - 1;
                      }
                  }
                  if (node.tagName === 'TEMPLATE') {
                      stack.push(node);
                      walker.currentNode = node.content;
                  }
              }
              else if (node.nodeType === 3 /* Node.TEXT_NODE */) {
                  const data = node.data;
                  if (data.indexOf(marker) >= 0) {
                      const parent = node.parentNode;
                      const strings = data.split(markerRegex);
                      const lastIndex = strings.length - 1;
                      // Generate a new text node for each literal section
                      // These nodes are also used as the markers for node parts
                      for (let i = 0; i < lastIndex; i++) {
                          let insert;
                          let s = strings[i];
                          if (s === '') {
                              insert = createMarker();
                          }
                          else {
                              const match = lastAttributeNameRegex.exec(s);
                              if (match !== null && endsWith(match[2], boundAttributeSuffix)) {
                                  s = s.slice(0, match.index) + match[1] +
                                      match[2].slice(0, -boundAttributeSuffix.length) + match[3];
                              }
                              insert = document.createTextNode(s);
                          }
                          parent.insertBefore(insert, node);
                          this.parts.push({ type: 'node', index: ++index });
                      }
                      // If there's no text, we must insert a comment to mark our place.
                      // Else, we can trust it will stick around after cloning.
                      if (strings[lastIndex] === '') {
                          parent.insertBefore(createMarker(), node);
                          nodesToRemove.push(node);
                      }
                      else {
                          node.data = strings[lastIndex];
                      }
                      // We have a part for each match found
                      partIndex += lastIndex;
                  }
              }
              else if (node.nodeType === 8 /* Node.COMMENT_NODE */) {
                  if (node.data === marker) {
                      const parent = node.parentNode;
                      // Add a new marker node to be the startNode of the Part if any of
                      // the following are true:
                      //  * We don't have a previousSibling
                      //  * The previousSibling is already the start of a previous part
                      if (node.previousSibling === null || index === lastPartIndex) {
                          index++;
                          parent.insertBefore(createMarker(), node);
                      }
                      lastPartIndex = index;
                      this.parts.push({ type: 'node', index });
                      // If we don't have a nextSibling, keep this node so we have an end.
                      // Else, we can remove it to save future costs.
                      if (node.nextSibling === null) {
                          node.data = '';
                      }
                      else {
                          nodesToRemove.push(node);
                          index--;
                      }
                      partIndex++;
                  }
                  else {
                      let i = -1;
                      while ((i = node.data.indexOf(marker, i + 1)) !== -1) {
                          // Comment node has a binding marker inside, make an inactive part
                          // The binding won't work, but subsequent bindings will
                          // TODO (justinfagnani): consider whether it's even worth it to
                          // make bindings in comments work
                          this.parts.push({ type: 'node', index: -1 });
                          partIndex++;
                      }
                  }
              }
          }
          // Remove text binding nodes after the walk to not disturb the TreeWalker
          for (const n of nodesToRemove) {
              n.parentNode.removeChild(n);
          }
      }
  }
  const endsWith = (str, suffix) => {
      const index = str.length - suffix.length;
      return index >= 0 && str.slice(index) === suffix;
  };
  const isTemplatePartActive = (part) => part.index !== -1;
  // Allows `document.createComment('')` to be renamed for a
  // small manual size-savings.
  const createMarker = () => document.createComment('');
  /**
   * This regex extracts the attribute name preceding an attribute-position
   * expression. It does this by matching the syntax allowed for attributes
   * against the string literal directly preceding the expression, assuming that
   * the expression is in an attribute-value position.
   *
   * See attributes in the HTML spec:
   * https://www.w3.org/TR/html5/syntax.html#elements-attributes
   *
   * " \x09\x0a\x0c\x0d" are HTML space characters:
   * https://www.w3.org/TR/html5/infrastructure.html#space-characters
   *
   * "\0-\x1F\x7F-\x9F" are Unicode control characters, which includes every
   * space character except " ".
   *
   * So an attribute is:
   *  * The name: any character except a control character, space character, ('),
   *    ("), ">", "=", or "/"
   *  * Followed by zero or more space characters
   *  * Followed by "="
   *  * Followed by zero or more space characters
   *  * Followed by:
   *    * Any character except space, ('), ("), "<", ">", "=", (`), or
   *    * (") then any non-("), or
   *    * (') then any non-(')
   */
  const lastAttributeNameRegex = 
  // eslint-disable-next-line no-control-regex
  /([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  const walkerNodeFilter = 133 /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */;
  /**
   * Removes the list of nodes from a Template safely. In addition to removing
   * nodes from the Template, the Template part indices are updated to match
   * the mutated Template DOM.
   *
   * As the template is walked the removal state is tracked and
   * part indices are adjusted as needed.
   *
   * div
   *   div#1 (remove) <-- start removing (removing node is div#1)
   *     div
   *       div#2 (remove)  <-- continue removing (removing node is still div#1)
   *         div
   * div <-- stop removing since previous sibling is the removing node (div#1,
   * removed 4 nodes)
   */
  function removeNodesFromTemplate(template, nodesToRemove) {
      const { element: { content }, parts } = template;
      const walker = document.createTreeWalker(content, walkerNodeFilter, null, false);
      let partIndex = nextActiveIndexInTemplateParts(parts);
      let part = parts[partIndex];
      let nodeIndex = -1;
      let removeCount = 0;
      const nodesToRemoveInTemplate = [];
      let currentRemovingNode = null;
      while (walker.nextNode()) {
          nodeIndex++;
          const node = walker.currentNode;
          // End removal if stepped past the removing node
          if (node.previousSibling === currentRemovingNode) {
              currentRemovingNode = null;
          }
          // A node to remove was found in the template
          if (nodesToRemove.has(node)) {
              nodesToRemoveInTemplate.push(node);
              // Track node we're removing
              if (currentRemovingNode === null) {
                  currentRemovingNode = node;
              }
          }
          // When removing, increment count by which to adjust subsequent part indices
          if (currentRemovingNode !== null) {
              removeCount++;
          }
          while (part !== undefined && part.index === nodeIndex) {
              // If part is in a removed node deactivate it by setting index to -1 or
              // adjust the index as needed.
              part.index = currentRemovingNode !== null ? -1 : part.index - removeCount;
              // go to the next active part.
              partIndex = nextActiveIndexInTemplateParts(parts, partIndex);
              part = parts[partIndex];
          }
      }
      nodesToRemoveInTemplate.forEach((n) => n.parentNode.removeChild(n));
  }
  const countNodes = (node) => {
      let count = (node.nodeType === 11 /* Node.DOCUMENT_FRAGMENT_NODE */) ? 0 : 1;
      const walker = document.createTreeWalker(node, walkerNodeFilter, null, false);
      while (walker.nextNode()) {
          count++;
      }
      return count;
  };
  const nextActiveIndexInTemplateParts = (parts, startIndex = -1) => {
      for (let i = startIndex + 1; i < parts.length; i++) {
          const part = parts[i];
          if (isTemplatePartActive(part)) {
              return i;
          }
      }
      return -1;
  };
  /**
   * Inserts the given node into the Template, optionally before the given
   * refNode. In addition to inserting the node into the Template, the Template
   * part indices are updated to match the mutated Template DOM.
   */
  function insertNodeIntoTemplate(template, node, refNode = null) {
      const { element: { content }, parts } = template;
      // If there's no refNode, then put node at end of template.
      // No part indices need to be shifted in this case.
      if (refNode === null || refNode === undefined) {
          content.appendChild(node);
          return;
      }
      const walker = document.createTreeWalker(content, walkerNodeFilter, null, false);
      let partIndex = nextActiveIndexInTemplateParts(parts);
      let insertCount = 0;
      let walkerIndex = -1;
      while (walker.nextNode()) {
          walkerIndex++;
          const walkerNode = walker.currentNode;
          if (walkerNode === refNode) {
              insertCount = countNodes(node);
              refNode.parentNode.insertBefore(node, refNode);
          }
          while (partIndex !== -1 && parts[partIndex].index === walkerIndex) {
              // If we've inserted the node, simply adjust all subsequent parts
              if (insertCount > 0) {
                  while (partIndex !== -1) {
                      parts[partIndex].index += insertCount;
                      partIndex = nextActiveIndexInTemplateParts(parts, partIndex);
                  }
                  return;
              }
              partIndex = nextActiveIndexInTemplateParts(parts, partIndex);
          }
      }
  }

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  const directives = new WeakMap();
  const isDirective = (o) => {
      return typeof o === 'function' && directives.has(o);
  };

  /**
   * @license
   * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  /**
   * A sentinel value that signals that a value was handled by a directive and
   * should not be written to the DOM.
   */
  const noChange = {};
  /**
   * A sentinel value that signals a NodePart to fully clear its content.
   */
  const nothing = {};

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  /**
   * An instance of a `Template` that can be attached to the DOM and updated
   * with new values.
   */
  class TemplateInstance {
      constructor(template, processor, options) {
          this.__parts = [];
          this.template = template;
          this.processor = processor;
          this.options = options;
      }
      update(values) {
          let i = 0;
          for (const part of this.__parts) {
              if (part !== undefined) {
                  part.setValue(values[i]);
              }
              i++;
          }
          for (const part of this.__parts) {
              if (part !== undefined) {
                  part.commit();
              }
          }
      }
      _clone() {
          // There are a number of steps in the lifecycle of a template instance's
          // DOM fragment:
          //  1. Clone - create the instance fragment
          //  2. Adopt - adopt into the main document
          //  3. Process - find part markers and create parts
          //  4. Upgrade - upgrade custom elements
          //  5. Update - set node, attribute, property, etc., values
          //  6. Connect - connect to the document. Optional and outside of this
          //     method.
          //
          // We have a few constraints on the ordering of these steps:
          //  * We need to upgrade before updating, so that property values will pass
          //    through any property setters.
          //  * We would like to process before upgrading so that we're sure that the
          //    cloned fragment is inert and not disturbed by self-modifying DOM.
          //  * We want custom elements to upgrade even in disconnected fragments.
          //
          // Given these constraints, with full custom elements support we would
          // prefer the order: Clone, Process, Adopt, Upgrade, Update, Connect
          //
          // But Safari does not implement CustomElementRegistry#upgrade, so we
          // can not implement that order and still have upgrade-before-update and
          // upgrade disconnected fragments. So we instead sacrifice the
          // process-before-upgrade constraint, since in Custom Elements v1 elements
          // must not modify their light DOM in the constructor. We still have issues
          // when co-existing with CEv0 elements like Polymer 1, and with polyfills
          // that don't strictly adhere to the no-modification rule because shadow
          // DOM, which may be created in the constructor, is emulated by being placed
          // in the light DOM.
          //
          // The resulting order is on native is: Clone, Adopt, Upgrade, Process,
          // Update, Connect. document.importNode() performs Clone, Adopt, and Upgrade
          // in one step.
          //
          // The Custom Elements v1 polyfill supports upgrade(), so the order when
          // polyfilled is the more ideal: Clone, Process, Adopt, Upgrade, Update,
          // Connect.
          const fragment = isCEPolyfill ?
              this.template.element.content.cloneNode(true) :
              document.importNode(this.template.element.content, true);
          const stack = [];
          const parts = this.template.parts;
          // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be null
          const walker = document.createTreeWalker(fragment, 133 /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */, null, false);
          let partIndex = 0;
          let nodeIndex = 0;
          let part;
          let node = walker.nextNode();
          // Loop through all the nodes and parts of a template
          while (partIndex < parts.length) {
              part = parts[partIndex];
              if (!isTemplatePartActive(part)) {
                  this.__parts.push(undefined);
                  partIndex++;
                  continue;
              }
              // Progress the tree walker until we find our next part's node.
              // Note that multiple parts may share the same node (attribute parts
              // on a single element), so this loop may not run at all.
              while (nodeIndex < part.index) {
                  nodeIndex++;
                  if (node.nodeName === 'TEMPLATE') {
                      stack.push(node);
                      walker.currentNode = node.content;
                  }
                  if ((node = walker.nextNode()) === null) {
                      // We've exhausted the content inside a nested template element.
                      // Because we still have parts (the outer for-loop), we know:
                      // - There is a template in the stack
                      // - The walker will find a nextNode outside the template
                      walker.currentNode = stack.pop();
                      node = walker.nextNode();
                  }
              }
              // We've arrived at our part's node.
              if (part.type === 'node') {
                  const part = this.processor.handleTextExpression(this.options);
                  part.insertAfterNode(node.previousSibling);
                  this.__parts.push(part);
              }
              else {
                  this.__parts.push(...this.processor.handleAttributeExpressions(node, part.name, part.strings, this.options));
              }
              partIndex++;
          }
          if (isCEPolyfill) {
              document.adoptNode(fragment);
              customElements.upgrade(fragment);
          }
          return fragment;
      }
  }

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  /**
   * Our TrustedTypePolicy for HTML which is declared using the html template
   * tag function.
   *
   * That HTML is a developer-authored constant, and is parsed with innerHTML
   * before any untrusted expressions have been mixed in. Therefor it is
   * considered safe by construction.
   */
  const policy = window.trustedTypes &&
      trustedTypes.createPolicy('lit-html', { createHTML: (s) => s });
  const commentMarker = ` ${marker} `;
  /**
   * The return type of `html`, which holds a Template and the values from
   * interpolated expressions.
   */
  class TemplateResult {
      constructor(strings, values, type, processor) {
          this.strings = strings;
          this.values = values;
          this.type = type;
          this.processor = processor;
      }
      /**
       * Returns a string of HTML used to create a `<template>` element.
       */
      getHTML() {
          const l = this.strings.length - 1;
          let html = '';
          let isCommentBinding = false;
          for (let i = 0; i < l; i++) {
              const s = this.strings[i];
              // For each binding we want to determine the kind of marker to insert
              // into the template source before it's parsed by the browser's HTML
              // parser. The marker type is based on whether the expression is in an
              // attribute, text, or comment position.
              //   * For node-position bindings we insert a comment with the marker
              //     sentinel as its text content, like <!--{{lit-guid}}-->.
              //   * For attribute bindings we insert just the marker sentinel for the
              //     first binding, so that we support unquoted attribute bindings.
              //     Subsequent bindings can use a comment marker because multi-binding
              //     attributes must be quoted.
              //   * For comment bindings we insert just the marker sentinel so we don't
              //     close the comment.
              //
              // The following code scans the template source, but is *not* an HTML
              // parser. We don't need to track the tree structure of the HTML, only
              // whether a binding is inside a comment, and if not, if it appears to be
              // the first binding in an attribute.
              const commentOpen = s.lastIndexOf('<!--');
              // We're in comment position if we have a comment open with no following
              // comment close. Because <-- can appear in an attribute value there can
              // be false positives.
              isCommentBinding = (commentOpen > -1 || isCommentBinding) &&
                  s.indexOf('-->', commentOpen + 1) === -1;
              // Check to see if we have an attribute-like sequence preceding the
              // expression. This can match "name=value" like structures in text,
              // comments, and attribute values, so there can be false-positives.
              const attributeMatch = lastAttributeNameRegex.exec(s);
              if (attributeMatch === null) {
                  // We're only in this branch if we don't have a attribute-like
                  // preceding sequence. For comments, this guards against unusual
                  // attribute values like <div foo="<!--${'bar'}">. Cases like
                  // <!-- foo=${'bar'}--> are handled correctly in the attribute branch
                  // below.
                  html += s + (isCommentBinding ? commentMarker : nodeMarker);
              }
              else {
                  // For attributes we use just a marker sentinel, and also append a
                  // $lit$ suffix to the name to opt-out of attribute-specific parsing
                  // that IE and Edge do for style and certain SVG attributes.
                  html += s.substr(0, attributeMatch.index) + attributeMatch[1] +
                      attributeMatch[2] + boundAttributeSuffix + attributeMatch[3] +
                      marker;
              }
          }
          html += this.strings[l];
          return html;
      }
      getTemplateElement() {
          const template = document.createElement('template');
          let value = this.getHTML();
          if (policy !== undefined) {
              // this is secure because `this.strings` is a TemplateStringsArray.
              // TODO: validate this when
              // https://github.com/tc39/proposal-array-is-template-object is
              // implemented.
              value = policy.createHTML(value);
          }
          template.innerHTML = value;
          return template;
      }
  }

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  const isPrimitive = (value) => {
      return (value === null ||
          !(typeof value === 'object' || typeof value === 'function'));
  };
  const isIterable = (value) => {
      return Array.isArray(value) ||
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          !!(value && value[Symbol.iterator]);
  };
  /**
   * Writes attribute values to the DOM for a group of AttributeParts bound to a
   * single attribute. The value is only set once even if there are multiple parts
   * for an attribute.
   */
  class AttributeCommitter {
      constructor(element, name, strings) {
          this.dirty = true;
          this.element = element;
          this.name = name;
          this.strings = strings;
          this.parts = [];
          for (let i = 0; i < strings.length - 1; i++) {
              this.parts[i] = this._createPart();
          }
      }
      /**
       * Creates a single part. Override this to create a differnt type of part.
       */
      _createPart() {
          return new AttributePart(this);
      }
      _getValue() {
          const strings = this.strings;
          const l = strings.length - 1;
          const parts = this.parts;
          // If we're assigning an attribute via syntax like:
          //    attr="${foo}"  or  attr=${foo}
          // but not
          //    attr="${foo} ${bar}" or attr="${foo} baz"
          // then we don't want to coerce the attribute value into one long
          // string. Instead we want to just return the value itself directly,
          // so that sanitizeDOMValue can get the actual value rather than
          // String(value)
          // The exception is if v is an array, in which case we do want to smash
          // it together into a string without calling String() on the array.
          //
          // This also allows trusted values (when using TrustedTypes) being
          // assigned to DOM sinks without being stringified in the process.
          if (l === 1 && strings[0] === '' && strings[1] === '') {
              const v = parts[0].value;
              if (typeof v === 'symbol') {
                  return String(v);
              }
              if (typeof v === 'string' || !isIterable(v)) {
                  return v;
              }
          }
          let text = '';
          for (let i = 0; i < l; i++) {
              text += strings[i];
              const part = parts[i];
              if (part !== undefined) {
                  const v = part.value;
                  if (isPrimitive(v) || !isIterable(v)) {
                      text += typeof v === 'string' ? v : String(v);
                  }
                  else {
                      for (const t of v) {
                          text += typeof t === 'string' ? t : String(t);
                      }
                  }
              }
          }
          text += strings[l];
          return text;
      }
      commit() {
          if (this.dirty) {
              this.dirty = false;
              this.element.setAttribute(this.name, this._getValue());
          }
      }
  }
  /**
   * A Part that controls all or part of an attribute value.
   */
  class AttributePart {
      constructor(committer) {
          this.value = undefined;
          this.committer = committer;
      }
      setValue(value) {
          if (value !== noChange && (!isPrimitive(value) || value !== this.value)) {
              this.value = value;
              // If the value is a not a directive, dirty the committer so that it'll
              // call setAttribute. If the value is a directive, it'll dirty the
              // committer if it calls setValue().
              if (!isDirective(value)) {
                  this.committer.dirty = true;
              }
          }
      }
      commit() {
          while (isDirective(this.value)) {
              const directive = this.value;
              this.value = noChange;
              directive(this);
          }
          if (this.value === noChange) {
              return;
          }
          this.committer.commit();
      }
  }
  /**
   * A Part that controls a location within a Node tree. Like a Range, NodePart
   * has start and end locations and can set and update the Nodes between those
   * locations.
   *
   * NodeParts support several value types: primitives, Nodes, TemplateResults,
   * as well as arrays and iterables of those types.
   */
  class NodePart {
      constructor(options) {
          this.value = undefined;
          this.__pendingValue = undefined;
          this.options = options;
      }
      /**
       * Appends this part into a container.
       *
       * This part must be empty, as its contents are not automatically moved.
       */
      appendInto(container) {
          this.startNode = container.appendChild(createMarker());
          this.endNode = container.appendChild(createMarker());
      }
      /**
       * Inserts this part after the `ref` node (between `ref` and `ref`'s next
       * sibling). Both `ref` and its next sibling must be static, unchanging nodes
       * such as those that appear in a literal section of a template.
       *
       * This part must be empty, as its contents are not automatically moved.
       */
      insertAfterNode(ref) {
          this.startNode = ref;
          this.endNode = ref.nextSibling;
      }
      /**
       * Appends this part into a parent part.
       *
       * This part must be empty, as its contents are not automatically moved.
       */
      appendIntoPart(part) {
          part.__insert(this.startNode = createMarker());
          part.__insert(this.endNode = createMarker());
      }
      /**
       * Inserts this part after the `ref` part.
       *
       * This part must be empty, as its contents are not automatically moved.
       */
      insertAfterPart(ref) {
          ref.__insert(this.startNode = createMarker());
          this.endNode = ref.endNode;
          ref.endNode = this.startNode;
      }
      setValue(value) {
          this.__pendingValue = value;
      }
      commit() {
          if (this.startNode.parentNode === null) {
              return;
          }
          while (isDirective(this.__pendingValue)) {
              const directive = this.__pendingValue;
              this.__pendingValue = noChange;
              directive(this);
          }
          const value = this.__pendingValue;
          if (value === noChange) {
              return;
          }
          if (isPrimitive(value)) {
              if (value !== this.value) {
                  this.__commitText(value);
              }
          }
          else if (value instanceof TemplateResult) {
              this.__commitTemplateResult(value);
          }
          else if (value instanceof Node) {
              this.__commitNode(value);
          }
          else if (isIterable(value)) {
              this.__commitIterable(value);
          }
          else if (value === nothing) {
              this.value = nothing;
              this.clear();
          }
          else {
              // Fallback, will render the string representation
              this.__commitText(value);
          }
      }
      __insert(node) {
          this.endNode.parentNode.insertBefore(node, this.endNode);
      }
      __commitNode(value) {
          if (this.value === value) {
              return;
          }
          this.clear();
          this.__insert(value);
          this.value = value;
      }
      __commitText(value) {
          const node = this.startNode.nextSibling;
          value = value == null ? '' : value;
          // If `value` isn't already a string, we explicitly convert it here in case
          // it can't be implicitly converted - i.e. it's a symbol.
          const valueAsString = typeof value === 'string' ? value : String(value);
          if (node === this.endNode.previousSibling &&
              node.nodeType === 3 /* Node.TEXT_NODE */) {
              // If we only have a single text node between the markers, we can just
              // set its value, rather than replacing it.
              // TODO(justinfagnani): Can we just check if this.value is primitive?
              node.data = valueAsString;
          }
          else {
              this.__commitNode(document.createTextNode(valueAsString));
          }
          this.value = value;
      }
      __commitTemplateResult(value) {
          const template = this.options.templateFactory(value);
          if (this.value instanceof TemplateInstance &&
              this.value.template === template) {
              this.value.update(value.values);
          }
          else {
              // Make sure we propagate the template processor from the TemplateResult
              // so that we use its syntax extension, etc. The template factory comes
              // from the render function options so that it can control template
              // caching and preprocessing.
              const instance = new TemplateInstance(template, value.processor, this.options);
              const fragment = instance._clone();
              instance.update(value.values);
              this.__commitNode(fragment);
              this.value = instance;
          }
      }
      __commitIterable(value) {
          // For an Iterable, we create a new InstancePart per item, then set its
          // value to the item. This is a little bit of overhead for every item in
          // an Iterable, but it lets us recurse easily and efficiently update Arrays
          // of TemplateResults that will be commonly returned from expressions like:
          // array.map((i) => html`${i}`), by reusing existing TemplateInstances.
          // If _value is an array, then the previous render was of an
          // iterable and _value will contain the NodeParts from the previous
          // render. If _value is not an array, clear this part and make a new
          // array for NodeParts.
          if (!Array.isArray(this.value)) {
              this.value = [];
              this.clear();
          }
          // Lets us keep track of how many items we stamped so we can clear leftover
          // items from a previous render
          const itemParts = this.value;
          let partIndex = 0;
          let itemPart;
          for (const item of value) {
              // Try to reuse an existing part
              itemPart = itemParts[partIndex];
              // If no existing part, create a new one
              if (itemPart === undefined) {
                  itemPart = new NodePart(this.options);
                  itemParts.push(itemPart);
                  if (partIndex === 0) {
                      itemPart.appendIntoPart(this);
                  }
                  else {
                      itemPart.insertAfterPart(itemParts[partIndex - 1]);
                  }
              }
              itemPart.setValue(item);
              itemPart.commit();
              partIndex++;
          }
          if (partIndex < itemParts.length) {
              // Truncate the parts array so _value reflects the current state
              itemParts.length = partIndex;
              this.clear(itemPart && itemPart.endNode);
          }
      }
      clear(startNode = this.startNode) {
          removeNodes(this.startNode.parentNode, startNode.nextSibling, this.endNode);
      }
  }
  /**
   * Implements a boolean attribute, roughly as defined in the HTML
   * specification.
   *
   * If the value is truthy, then the attribute is present with a value of
   * ''. If the value is falsey, the attribute is removed.
   */
  class BooleanAttributePart {
      constructor(element, name, strings) {
          this.value = undefined;
          this.__pendingValue = undefined;
          if (strings.length !== 2 || strings[0] !== '' || strings[1] !== '') {
              throw new Error('Boolean attributes can only contain a single expression');
          }
          this.element = element;
          this.name = name;
          this.strings = strings;
      }
      setValue(value) {
          this.__pendingValue = value;
      }
      commit() {
          while (isDirective(this.__pendingValue)) {
              const directive = this.__pendingValue;
              this.__pendingValue = noChange;
              directive(this);
          }
          if (this.__pendingValue === noChange) {
              return;
          }
          const value = !!this.__pendingValue;
          if (this.value !== value) {
              if (value) {
                  this.element.setAttribute(this.name, '');
              }
              else {
                  this.element.removeAttribute(this.name);
              }
              this.value = value;
          }
          this.__pendingValue = noChange;
      }
  }
  /**
   * Sets attribute values for PropertyParts, so that the value is only set once
   * even if there are multiple parts for a property.
   *
   * If an expression controls the whole property value, then the value is simply
   * assigned to the property under control. If there are string literals or
   * multiple expressions, then the strings are expressions are interpolated into
   * a string first.
   */
  class PropertyCommitter extends AttributeCommitter {
      constructor(element, name, strings) {
          super(element, name, strings);
          this.single =
              (strings.length === 2 && strings[0] === '' && strings[1] === '');
      }
      _createPart() {
          return new PropertyPart(this);
      }
      _getValue() {
          if (this.single) {
              return this.parts[0].value;
          }
          return super._getValue();
      }
      commit() {
          if (this.dirty) {
              this.dirty = false;
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              this.element[this.name] = this._getValue();
          }
      }
  }
  class PropertyPart extends AttributePart {
  }
  // Detect event listener options support. If the `capture` property is read
  // from the options object, then options are supported. If not, then the third
  // argument to add/removeEventListener is interpreted as the boolean capture
  // value so we should only pass the `capture` property.
  let eventOptionsSupported = false;
  // Wrap into an IIFE because MS Edge <= v41 does not support having try/catch
  // blocks right into the body of a module
  (() => {
      try {
          const options = {
              get capture() {
                  eventOptionsSupported = true;
                  return false;
              }
          };
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          window.addEventListener('test', options, options);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          window.removeEventListener('test', options, options);
      }
      catch (_e) {
          // event options not supported
      }
  })();
  class EventPart {
      constructor(element, eventName, eventContext) {
          this.value = undefined;
          this.__pendingValue = undefined;
          this.element = element;
          this.eventName = eventName;
          this.eventContext = eventContext;
          this.__boundHandleEvent = (e) => this.handleEvent(e);
      }
      setValue(value) {
          this.__pendingValue = value;
      }
      commit() {
          while (isDirective(this.__pendingValue)) {
              const directive = this.__pendingValue;
              this.__pendingValue = noChange;
              directive(this);
          }
          if (this.__pendingValue === noChange) {
              return;
          }
          const newListener = this.__pendingValue;
          const oldListener = this.value;
          const shouldRemoveListener = newListener == null ||
              oldListener != null &&
                  (newListener.capture !== oldListener.capture ||
                      newListener.once !== oldListener.once ||
                      newListener.passive !== oldListener.passive);
          const shouldAddListener = newListener != null && (oldListener == null || shouldRemoveListener);
          if (shouldRemoveListener) {
              this.element.removeEventListener(this.eventName, this.__boundHandleEvent, this.__options);
          }
          if (shouldAddListener) {
              this.__options = getOptions(newListener);
              this.element.addEventListener(this.eventName, this.__boundHandleEvent, this.__options);
          }
          this.value = newListener;
          this.__pendingValue = noChange;
      }
      handleEvent(event) {
          if (typeof this.value === 'function') {
              this.value.call(this.eventContext || this.element, event);
          }
          else {
              this.value.handleEvent(event);
          }
      }
  }
  // We copy options because of the inconsistent behavior of browsers when reading
  // the third argument of add/removeEventListener. IE11 doesn't support options
  // at all. Chrome 41 only reads `capture` if the argument is an object.
  const getOptions = (o) => o &&
      (eventOptionsSupported ?
          { capture: o.capture, passive: o.passive, once: o.once } :
          o.capture);

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  /**
   * The default TemplateFactory which caches Templates keyed on
   * result.type and result.strings.
   */
  function templateFactory(result) {
      let templateCache = templateCaches.get(result.type);
      if (templateCache === undefined) {
          templateCache = {
              stringsArray: new WeakMap(),
              keyString: new Map()
          };
          templateCaches.set(result.type, templateCache);
      }
      let template = templateCache.stringsArray.get(result.strings);
      if (template !== undefined) {
          return template;
      }
      // If the TemplateStringsArray is new, generate a key from the strings
      // This key is shared between all templates with identical content
      const key = result.strings.join(marker);
      // Check if we already have a Template for this key
      template = templateCache.keyString.get(key);
      if (template === undefined) {
          // If we have not seen this key before, create a new Template
          template = new Template(result, result.getTemplateElement());
          // Cache the Template for this key
          templateCache.keyString.set(key, template);
      }
      // Cache all future queries for this TemplateStringsArray
      templateCache.stringsArray.set(result.strings, template);
      return template;
  }
  const templateCaches = new Map();

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  const parts = new WeakMap();
  /**
   * Renders a template result or other value to a container.
   *
   * To update a container with new values, reevaluate the template literal and
   * call `render` with the new result.
   *
   * @param result Any value renderable by NodePart - typically a TemplateResult
   *     created by evaluating a template tag like `html` or `svg`.
   * @param container A DOM parent to render to. The entire contents are either
   *     replaced, or efficiently updated if the same result type was previous
   *     rendered there.
   * @param options RenderOptions for the entire render tree rendered to this
   *     container. Render options must *not* change between renders to the same
   *     container, as those changes will not effect previously rendered DOM.
   */
  const render = (result, container, options) => {
      let part = parts.get(container);
      if (part === undefined) {
          removeNodes(container, container.firstChild);
          parts.set(container, part = new NodePart(Object.assign({ templateFactory }, options)));
          part.appendInto(container);
      }
      part.setValue(result);
      part.commit();
  };

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  /**
   * Creates Parts when a template is instantiated.
   */
  class DefaultTemplateProcessor {
      /**
       * Create parts for an attribute-position binding, given the event, attribute
       * name, and string literals.
       *
       * @param element The element containing the binding
       * @param name  The attribute name
       * @param strings The string literals. There are always at least two strings,
       *   event for fully-controlled bindings with a single expression.
       */
      handleAttributeExpressions(element, name, strings, options) {
          const prefix = name[0];
          if (prefix === '.') {
              const committer = new PropertyCommitter(element, name.slice(1), strings);
              return committer.parts;
          }
          if (prefix === '@') {
              return [new EventPart(element, name.slice(1), options.eventContext)];
          }
          if (prefix === '?') {
              return [new BooleanAttributePart(element, name.slice(1), strings)];
          }
          const committer = new AttributeCommitter(element, name, strings);
          return committer.parts;
      }
      /**
       * Create parts for a text-position binding.
       * @param templateFactory
       */
      handleTextExpression(options) {
          return new NodePart(options);
      }
  }
  const defaultTemplateProcessor = new DefaultTemplateProcessor();

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  // IMPORTANT: do not change the property name or the assignment expression.
  // This line will be used in regexes to search for lit-html usage.
  // TODO(justinfagnani): inject version number at build time
  if (typeof window !== 'undefined') {
      (window['litHtmlVersions'] || (window['litHtmlVersions'] = [])).push('1.4.1');
  }
  /**
   * Interprets a template literal as an HTML template that can efficiently
   * render to and update a container.
   */
  const html = (strings, ...values) => new TemplateResult(strings, values, 'html', defaultTemplateProcessor);

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  // Get a key to lookup in `templateCaches`.
  const getTemplateCacheKey = (type, scopeName) => `${type}--${scopeName}`;
  let compatibleShadyCSSVersion = true;
  if (typeof window.ShadyCSS === 'undefined') {
      compatibleShadyCSSVersion = false;
  }
  else if (typeof window.ShadyCSS.prepareTemplateDom === 'undefined') {
      console.warn(`Incompatible ShadyCSS version detected. ` +
          `Please update to at least @webcomponents/webcomponentsjs@2.0.2 and ` +
          `@webcomponents/shadycss@1.3.1.`);
      compatibleShadyCSSVersion = false;
  }
  /**
   * Template factory which scopes template DOM using ShadyCSS.
   * @param scopeName {string}
   */
  const shadyTemplateFactory = (scopeName) => (result) => {
      const cacheKey = getTemplateCacheKey(result.type, scopeName);
      let templateCache = templateCaches.get(cacheKey);
      if (templateCache === undefined) {
          templateCache = {
              stringsArray: new WeakMap(),
              keyString: new Map()
          };
          templateCaches.set(cacheKey, templateCache);
      }
      let template = templateCache.stringsArray.get(result.strings);
      if (template !== undefined) {
          return template;
      }
      const key = result.strings.join(marker);
      template = templateCache.keyString.get(key);
      if (template === undefined) {
          const element = result.getTemplateElement();
          if (compatibleShadyCSSVersion) {
              window.ShadyCSS.prepareTemplateDom(element, scopeName);
          }
          template = new Template(result, element);
          templateCache.keyString.set(key, template);
      }
      templateCache.stringsArray.set(result.strings, template);
      return template;
  };
  const TEMPLATE_TYPES = ['html', 'svg'];
  /**
   * Removes all style elements from Templates for the given scopeName.
   */
  const removeStylesFromLitTemplates = (scopeName) => {
      TEMPLATE_TYPES.forEach((type) => {
          const templates = templateCaches.get(getTemplateCacheKey(type, scopeName));
          if (templates !== undefined) {
              templates.keyString.forEach((template) => {
                  const { element: { content } } = template;
                  // IE 11 doesn't support the iterable param Set constructor
                  const styles = new Set();
                  Array.from(content.querySelectorAll('style')).forEach((s) => {
                      styles.add(s);
                  });
                  removeNodesFromTemplate(template, styles);
              });
          }
      });
  };
  const shadyRenderSet = new Set();
  /**
   * For the given scope name, ensures that ShadyCSS style scoping is performed.
   * This is done just once per scope name so the fragment and template cannot
   * be modified.
   * (1) extracts styles from the rendered fragment and hands them to ShadyCSS
   * to be scoped and appended to the document
   * (2) removes style elements from all lit-html Templates for this scope name.
   *
   * Note, <style> elements can only be placed into templates for the
   * initial rendering of the scope. If <style> elements are included in templates
   * dynamically rendered to the scope (after the first scope render), they will
   * not be scoped and the <style> will be left in the template and rendered
   * output.
   */
  const prepareTemplateStyles = (scopeName, renderedDOM, template) => {
      shadyRenderSet.add(scopeName);
      // If `renderedDOM` is stamped from a Template, then we need to edit that
      // Template's underlying template element. Otherwise, we create one here
      // to give to ShadyCSS, which still requires one while scoping.
      const templateElement = !!template ? template.element : document.createElement('template');
      // Move styles out of rendered DOM and store.
      const styles = renderedDOM.querySelectorAll('style');
      const { length } = styles;
      // If there are no styles, skip unnecessary work
      if (length === 0) {
          // Ensure prepareTemplateStyles is called to support adding
          // styles via `prepareAdoptedCssText` since that requires that
          // `prepareTemplateStyles` is called.
          //
          // ShadyCSS will only update styles containing @apply in the template
          // given to `prepareTemplateStyles`. If no lit Template was given,
          // ShadyCSS will not be able to update uses of @apply in any relevant
          // template. However, this is not a problem because we only create the
          // template for the purpose of supporting `prepareAdoptedCssText`,
          // which doesn't support @apply at all.
          window.ShadyCSS.prepareTemplateStyles(templateElement, scopeName);
          return;
      }
      const condensedStyle = document.createElement('style');
      // Collect styles into a single style. This helps us make sure ShadyCSS
      // manipulations will not prevent us from being able to fix up template
      // part indices.
      // NOTE: collecting styles is inefficient for browsers but ShadyCSS
      // currently does this anyway. When it does not, this should be changed.
      for (let i = 0; i < length; i++) {
          const style = styles[i];
          style.parentNode.removeChild(style);
          condensedStyle.textContent += style.textContent;
      }
      // Remove styles from nested templates in this scope.
      removeStylesFromLitTemplates(scopeName);
      // And then put the condensed style into the "root" template passed in as
      // `template`.
      const content = templateElement.content;
      if (!!template) {
          insertNodeIntoTemplate(template, condensedStyle, content.firstChild);
      }
      else {
          content.insertBefore(condensedStyle, content.firstChild);
      }
      // Note, it's important that ShadyCSS gets the template that `lit-html`
      // will actually render so that it can update the style inside when
      // needed (e.g. @apply native Shadow DOM case).
      window.ShadyCSS.prepareTemplateStyles(templateElement, scopeName);
      const style = content.querySelector('style');
      if (window.ShadyCSS.nativeShadow && style !== null) {
          // When in native Shadow DOM, ensure the style created by ShadyCSS is
          // included in initially rendered output (`renderedDOM`).
          renderedDOM.insertBefore(style.cloneNode(true), renderedDOM.firstChild);
      }
      else if (!!template) {
          // When no style is left in the template, parts will be broken as a
          // result. To fix this, we put back the style node ShadyCSS removed
          // and then tell lit to remove that node from the template.
          // There can be no style in the template in 2 cases (1) when Shady DOM
          // is in use, ShadyCSS removes all styles, (2) when native Shadow DOM
          // is in use ShadyCSS removes the style if it contains no content.
          // NOTE, ShadyCSS creates its own style so we can safely add/remove
          // `condensedStyle` here.
          content.insertBefore(condensedStyle, content.firstChild);
          const removes = new Set();
          removes.add(condensedStyle);
          removeNodesFromTemplate(template, removes);
      }
  };
  /**
   * Extension to the standard `render` method which supports rendering
   * to ShadowRoots when the ShadyDOM (https://github.com/webcomponents/shadydom)
   * and ShadyCSS (https://github.com/webcomponents/shadycss) polyfills are used
   * or when the webcomponentsjs
   * (https://github.com/webcomponents/webcomponentsjs) polyfill is used.
   *
   * Adds a `scopeName` option which is used to scope element DOM and stylesheets
   * when native ShadowDOM is unavailable. The `scopeName` will be added to
   * the class attribute of all rendered DOM. In addition, any style elements will
   * be automatically re-written with this `scopeName` selector and moved out
   * of the rendered DOM and into the document `<head>`.
   *
   * It is common to use this render method in conjunction with a custom element
   * which renders a shadowRoot. When this is done, typically the element's
   * `localName` should be used as the `scopeName`.
   *
   * In addition to DOM scoping, ShadyCSS also supports a basic shim for css
   * custom properties (needed only on older browsers like IE11) and a shim for
   * a deprecated feature called `@apply` that supports applying a set of css
   * custom properties to a given location.
   *
   * Usage considerations:
   *
   * * Part values in `<style>` elements are only applied the first time a given
   * `scopeName` renders. Subsequent changes to parts in style elements will have
   * no effect. Because of this, parts in style elements should only be used for
   * values that will never change, for example parts that set scope-wide theme
   * values or parts which render shared style elements.
   *
   * * Note, due to a limitation of the ShadyDOM polyfill, rendering in a
   * custom element's `constructor` is not supported. Instead rendering should
   * either done asynchronously, for example at microtask timing (for example
   * `Promise.resolve()`), or be deferred until the first time the element's
   * `connectedCallback` runs.
   *
   * Usage considerations when using shimmed custom properties or `@apply`:
   *
   * * Whenever any dynamic changes are made which affect
   * css custom properties, `ShadyCSS.styleElement(element)` must be called
   * to update the element. There are two cases when this is needed:
   * (1) the element is connected to a new parent, (2) a class is added to the
   * element that causes it to match different custom properties.
   * To address the first case when rendering a custom element, `styleElement`
   * should be called in the element's `connectedCallback`.
   *
   * * Shimmed custom properties may only be defined either for an entire
   * shadowRoot (for example, in a `:host` rule) or via a rule that directly
   * matches an element with a shadowRoot. In other words, instead of flowing from
   * parent to child as do native css custom properties, shimmed custom properties
   * flow only from shadowRoots to nested shadowRoots.
   *
   * * When using `@apply` mixing css shorthand property names with
   * non-shorthand names (for example `border` and `border-width`) is not
   * supported.
   */
  const render$1 = (result, container, options) => {
      if (!options || typeof options !== 'object' || !options.scopeName) {
          throw new Error('The `scopeName` option is required.');
      }
      const scopeName = options.scopeName;
      const hasRendered = parts.has(container);
      const needsScoping = compatibleShadyCSSVersion &&
          container.nodeType === 11 /* Node.DOCUMENT_FRAGMENT_NODE */ &&
          !!container.host;
      // Handle first render to a scope specially...
      const firstScopeRender = needsScoping && !shadyRenderSet.has(scopeName);
      // On first scope render, render into a fragment; this cannot be a single
      // fragment that is reused since nested renders can occur synchronously.
      const renderContainer = firstScopeRender ? document.createDocumentFragment() : container;
      render(result, renderContainer, Object.assign({ templateFactory: shadyTemplateFactory(scopeName) }, options));
      // When performing first scope render,
      // (1) We've rendered into a fragment so that there's a chance to
      // `prepareTemplateStyles` before sub-elements hit the DOM
      // (which might cause them to render based on a common pattern of
      // rendering in a custom element's `connectedCallback`);
      // (2) Scope the template with ShadyCSS one time only for this scope.
      // (3) Render the fragment into the container and make sure the
      // container knows its `part` is the one we just rendered. This ensures
      // DOM will be re-used on subsequent renders.
      if (firstScopeRender) {
          const part = parts.get(renderContainer);
          parts.delete(renderContainer);
          // ShadyCSS might have style sheets (e.g. from `prepareAdoptedCssText`)
          // that should apply to `renderContainer` even if the rendered value is
          // not a TemplateInstance. However, it will only insert scoped styles
          // into the document if `prepareTemplateStyles` has already been called
          // for the given scope name.
          const template = part.value instanceof TemplateInstance ?
              part.value.template :
              undefined;
          prepareTemplateStyles(scopeName, renderContainer, template);
          removeNodes(container, container.firstChild);
          container.appendChild(renderContainer);
          parts.set(container, part);
      }
      // After elements have hit the DOM, update styling if this is the
      // initial render to this container.
      // This is needed whenever dynamic changes are made so it would be
      // safest to do every render; however, this would regress performance
      // so we leave it up to the user to call `ShadyCSS.styleElement`
      // for dynamic changes.
      if (!hasRendered && needsScoping) {
          window.ShadyCSS.styleElement(container.host);
      }
  };

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  var _a;
  /**
   * Use this module if you want to create your own base class extending
   * [[UpdatingElement]].
   * @packageDocumentation
   */
  /*
   * When using Closure Compiler, JSCompiler_renameProperty(property, object) is
   * replaced at compile time by the munged name for object[property]. We cannot
   * alias this function, so we have to use a small shim that has the same
   * behavior when not compiling.
   */
  window.JSCompiler_renameProperty =
      (prop, _obj) => prop;
  const defaultConverter = {
      toAttribute(value, type) {
          switch (type) {
              case Boolean:
                  return value ? '' : null;
              case Object:
              case Array:
                  // if the value is `null` or `undefined` pass this through
                  // to allow removing/no change behavior.
                  return value == null ? value : JSON.stringify(value);
          }
          return value;
      },
      fromAttribute(value, type) {
          switch (type) {
              case Boolean:
                  return value !== null;
              case Number:
                  return value === null ? null : Number(value);
              case Object:
              case Array:
                  // Type assert to adhere to Bazel's "must type assert JSON parse" rule.
                  return JSON.parse(value);
          }
          return value;
      }
  };
  /**
   * Change function that returns true if `value` is different from `oldValue`.
   * This method is used as the default for a property's `hasChanged` function.
   */
  const notEqual = (value, old) => {
      // This ensures (old==NaN, value==NaN) always returns false
      return old !== value && (old === old || value === value);
  };
  const defaultPropertyDeclaration = {
      attribute: true,
      type: String,
      converter: defaultConverter,
      reflect: false,
      hasChanged: notEqual
  };
  const STATE_HAS_UPDATED = 1;
  const STATE_UPDATE_REQUESTED = 1 << 2;
  const STATE_IS_REFLECTING_TO_ATTRIBUTE = 1 << 3;
  const STATE_IS_REFLECTING_TO_PROPERTY = 1 << 4;
  /**
   * The Closure JS Compiler doesn't currently have good support for static
   * property semantics where "this" is dynamic (e.g.
   * https://github.com/google/closure-compiler/issues/3177 and others) so we use
   * this hack to bypass any rewriting by the compiler.
   */
  const finalized = 'finalized';
  /**
   * Base element class which manages element properties and attributes. When
   * properties change, the `update` method is asynchronously called. This method
   * should be supplied by subclassers to render updates as desired.
   * @noInheritDoc
   */
  class UpdatingElement extends HTMLElement {
      constructor() {
          super();
          this.initialize();
      }
      /**
       * Returns a list of attributes corresponding to the registered properties.
       * @nocollapse
       */
      static get observedAttributes() {
          // note: piggy backing on this to ensure we're finalized.
          this.finalize();
          const attributes = [];
          // Use forEach so this works even if for/of loops are compiled to for loops
          // expecting arrays
          this._classProperties.forEach((v, p) => {
              const attr = this._attributeNameForProperty(p, v);
              if (attr !== undefined) {
                  this._attributeToPropertyMap.set(attr, p);
                  attributes.push(attr);
              }
          });
          return attributes;
      }
      /**
       * Ensures the private `_classProperties` property metadata is created.
       * In addition to `finalize` this is also called in `createProperty` to
       * ensure the `@property` decorator can add property metadata.
       */
      /** @nocollapse */
      static _ensureClassProperties() {
          // ensure private storage for property declarations.
          if (!this.hasOwnProperty(JSCompiler_renameProperty('_classProperties', this))) {
              this._classProperties = new Map();
              // NOTE: Workaround IE11 not supporting Map constructor argument.
              const superProperties = Object.getPrototypeOf(this)._classProperties;
              if (superProperties !== undefined) {
                  superProperties.forEach((v, k) => this._classProperties.set(k, v));
              }
          }
      }
      /**
       * Creates a property accessor on the element prototype if one does not exist
       * and stores a PropertyDeclaration for the property with the given options.
       * The property setter calls the property's `hasChanged` property option
       * or uses a strict identity check to determine whether or not to request
       * an update.
       *
       * This method may be overridden to customize properties; however,
       * when doing so, it's important to call `super.createProperty` to ensure
       * the property is setup correctly. This method calls
       * `getPropertyDescriptor` internally to get a descriptor to install.
       * To customize what properties do when they are get or set, override
       * `getPropertyDescriptor`. To customize the options for a property,
       * implement `createProperty` like this:
       *
       * static createProperty(name, options) {
       *   options = Object.assign(options, {myOption: true});
       *   super.createProperty(name, options);
       * }
       *
       * @nocollapse
       */
      static createProperty(name, options = defaultPropertyDeclaration) {
          // Note, since this can be called by the `@property` decorator which
          // is called before `finalize`, we ensure storage exists for property
          // metadata.
          this._ensureClassProperties();
          this._classProperties.set(name, options);
          // Do not generate an accessor if the prototype already has one, since
          // it would be lost otherwise and that would never be the user's intention;
          // Instead, we expect users to call `requestUpdate` themselves from
          // user-defined accessors. Note that if the super has an accessor we will
          // still overwrite it
          if (options.noAccessor || this.prototype.hasOwnProperty(name)) {
              return;
          }
          const key = typeof name === 'symbol' ? Symbol() : `__${name}`;
          const descriptor = this.getPropertyDescriptor(name, key, options);
          if (descriptor !== undefined) {
              Object.defineProperty(this.prototype, name, descriptor);
          }
      }
      /**
       * Returns a property descriptor to be defined on the given named property.
       * If no descriptor is returned, the property will not become an accessor.
       * For example,
       *
       *   class MyElement extends LitElement {
       *     static getPropertyDescriptor(name, key, options) {
       *       const defaultDescriptor =
       *           super.getPropertyDescriptor(name, key, options);
       *       const setter = defaultDescriptor.set;
       *       return {
       *         get: defaultDescriptor.get,
       *         set(value) {
       *           setter.call(this, value);
       *           // custom action.
       *         },
       *         configurable: true,
       *         enumerable: true
       *       }
       *     }
       *   }
       *
       * @nocollapse
       */
      static getPropertyDescriptor(name, key, options) {
          return {
              // tslint:disable-next-line:no-any no symbol in index
              get() {
                  return this[key];
              },
              set(value) {
                  const oldValue = this[name];
                  this[key] = value;
                  this
                      .requestUpdateInternal(name, oldValue, options);
              },
              configurable: true,
              enumerable: true
          };
      }
      /**
       * Returns the property options associated with the given property.
       * These options are defined with a PropertyDeclaration via the `properties`
       * object or the `@property` decorator and are registered in
       * `createProperty(...)`.
       *
       * Note, this method should be considered "final" and not overridden. To
       * customize the options for a given property, override `createProperty`.
       *
       * @nocollapse
       * @final
       */
      static getPropertyOptions(name) {
          return this._classProperties && this._classProperties.get(name) ||
              defaultPropertyDeclaration;
      }
      /**
       * Creates property accessors for registered properties and ensures
       * any superclasses are also finalized.
       * @nocollapse
       */
      static finalize() {
          // finalize any superclasses
          const superCtor = Object.getPrototypeOf(this);
          if (!superCtor.hasOwnProperty(finalized)) {
              superCtor.finalize();
          }
          this[finalized] = true;
          this._ensureClassProperties();
          // initialize Map populated in observedAttributes
          this._attributeToPropertyMap = new Map();
          // make any properties
          // Note, only process "own" properties since this element will inherit
          // any properties defined on the superClass, and finalization ensures
          // the entire prototype chain is finalized.
          if (this.hasOwnProperty(JSCompiler_renameProperty('properties', this))) {
              const props = this.properties;
              // support symbols in properties (IE11 does not support this)
              const propKeys = [
                  ...Object.getOwnPropertyNames(props),
                  ...(typeof Object.getOwnPropertySymbols === 'function') ?
                      Object.getOwnPropertySymbols(props) :
                      []
              ];
              // This for/of is ok because propKeys is an array
              for (const p of propKeys) {
                  // note, use of `any` is due to TypeSript lack of support for symbol in
                  // index types
                  // tslint:disable-next-line:no-any no symbol in index
                  this.createProperty(p, props[p]);
              }
          }
      }
      /**
       * Returns the property name for the given attribute `name`.
       * @nocollapse
       */
      static _attributeNameForProperty(name, options) {
          const attribute = options.attribute;
          return attribute === false ?
              undefined :
              (typeof attribute === 'string' ?
                  attribute :
                  (typeof name === 'string' ? name.toLowerCase() : undefined));
      }
      /**
       * Returns true if a property should request an update.
       * Called when a property value is set and uses the `hasChanged`
       * option for the property if present or a strict identity check.
       * @nocollapse
       */
      static _valueHasChanged(value, old, hasChanged = notEqual) {
          return hasChanged(value, old);
      }
      /**
       * Returns the property value for the given attribute value.
       * Called via the `attributeChangedCallback` and uses the property's
       * `converter` or `converter.fromAttribute` property option.
       * @nocollapse
       */
      static _propertyValueFromAttribute(value, options) {
          const type = options.type;
          const converter = options.converter || defaultConverter;
          const fromAttribute = (typeof converter === 'function' ? converter : converter.fromAttribute);
          return fromAttribute ? fromAttribute(value, type) : value;
      }
      /**
       * Returns the attribute value for the given property value. If this
       * returns undefined, the property will *not* be reflected to an attribute.
       * If this returns null, the attribute will be removed, otherwise the
       * attribute will be set to the value.
       * This uses the property's `reflect` and `type.toAttribute` property options.
       * @nocollapse
       */
      static _propertyValueToAttribute(value, options) {
          if (options.reflect === undefined) {
              return;
          }
          const type = options.type;
          const converter = options.converter;
          const toAttribute = converter && converter.toAttribute ||
              defaultConverter.toAttribute;
          return toAttribute(value, type);
      }
      /**
       * Performs element initialization. By default captures any pre-set values for
       * registered properties.
       */
      initialize() {
          this._updateState = 0;
          this._updatePromise =
              new Promise((res) => this._enableUpdatingResolver = res);
          this._changedProperties = new Map();
          this._saveInstanceProperties();
          // ensures first update will be caught by an early access of
          // `updateComplete`
          this.requestUpdateInternal();
      }
      /**
       * Fixes any properties set on the instance before upgrade time.
       * Otherwise these would shadow the accessor and break these properties.
       * The properties are stored in a Map which is played back after the
       * constructor runs. Note, on very old versions of Safari (<=9) or Chrome
       * (<=41), properties created for native platform properties like (`id` or
       * `name`) may not have default values set in the element constructor. On
       * these browsers native properties appear on instances and therefore their
       * default value will overwrite any element default (e.g. if the element sets
       * this.id = 'id' in the constructor, the 'id' will become '' since this is
       * the native platform default).
       */
      _saveInstanceProperties() {
          // Use forEach so this works even if for/of loops are compiled to for loops
          // expecting arrays
          this.constructor
              ._classProperties.forEach((_v, p) => {
              if (this.hasOwnProperty(p)) {
                  const value = this[p];
                  delete this[p];
                  if (!this._instanceProperties) {
                      this._instanceProperties = new Map();
                  }
                  this._instanceProperties.set(p, value);
              }
          });
      }
      /**
       * Applies previously saved instance properties.
       */
      _applyInstanceProperties() {
          // Use forEach so this works even if for/of loops are compiled to for loops
          // expecting arrays
          // tslint:disable-next-line:no-any
          this._instanceProperties.forEach((v, p) => this[p] = v);
          this._instanceProperties = undefined;
      }
      connectedCallback() {
          // Ensure first connection completes an update. Updates cannot complete
          // before connection.
          this.enableUpdating();
      }
      enableUpdating() {
          if (this._enableUpdatingResolver !== undefined) {
              this._enableUpdatingResolver();
              this._enableUpdatingResolver = undefined;
          }
      }
      /**
       * Allows for `super.disconnectedCallback()` in extensions while
       * reserving the possibility of making non-breaking feature additions
       * when disconnecting at some point in the future.
       */
      disconnectedCallback() {
      }
      /**
       * Synchronizes property values when attributes change.
       */
      attributeChangedCallback(name, old, value) {
          if (old !== value) {
              this._attributeToProperty(name, value);
          }
      }
      _propertyToAttribute(name, value, options = defaultPropertyDeclaration) {
          const ctor = this.constructor;
          const attr = ctor._attributeNameForProperty(name, options);
          if (attr !== undefined) {
              const attrValue = ctor._propertyValueToAttribute(value, options);
              // an undefined value does not change the attribute.
              if (attrValue === undefined) {
                  return;
              }
              // Track if the property is being reflected to avoid
              // setting the property again via `attributeChangedCallback`. Note:
              // 1. this takes advantage of the fact that the callback is synchronous.
              // 2. will behave incorrectly if multiple attributes are in the reaction
              // stack at time of calling. However, since we process attributes
              // in `update` this should not be possible (or an extreme corner case
              // that we'd like to discover).
              // mark state reflecting
              this._updateState = this._updateState | STATE_IS_REFLECTING_TO_ATTRIBUTE;
              if (attrValue == null) {
                  this.removeAttribute(attr);
              }
              else {
                  this.setAttribute(attr, attrValue);
              }
              // mark state not reflecting
              this._updateState = this._updateState & ~STATE_IS_REFLECTING_TO_ATTRIBUTE;
          }
      }
      _attributeToProperty(name, value) {
          // Use tracking info to avoid deserializing attribute value if it was
          // just set from a property setter.
          if (this._updateState & STATE_IS_REFLECTING_TO_ATTRIBUTE) {
              return;
          }
          const ctor = this.constructor;
          // Note, hint this as an `AttributeMap` so closure clearly understands
          // the type; it has issues with tracking types through statics
          // tslint:disable-next-line:no-unnecessary-type-assertion
          const propName = ctor._attributeToPropertyMap.get(name);
          if (propName !== undefined) {
              const options = ctor.getPropertyOptions(propName);
              // mark state reflecting
              this._updateState = this._updateState | STATE_IS_REFLECTING_TO_PROPERTY;
              this[propName] =
                  // tslint:disable-next-line:no-any
                  ctor._propertyValueFromAttribute(value, options);
              // mark state not reflecting
              this._updateState = this._updateState & ~STATE_IS_REFLECTING_TO_PROPERTY;
          }
      }
      /**
       * This protected version of `requestUpdate` does not access or return the
       * `updateComplete` promise. This promise can be overridden and is therefore
       * not free to access.
       */
      requestUpdateInternal(name, oldValue, options) {
          let shouldRequestUpdate = true;
          // If we have a property key, perform property update steps.
          if (name !== undefined) {
              const ctor = this.constructor;
              options = options || ctor.getPropertyOptions(name);
              if (ctor._valueHasChanged(this[name], oldValue, options.hasChanged)) {
                  if (!this._changedProperties.has(name)) {
                      this._changedProperties.set(name, oldValue);
                  }
                  // Add to reflecting properties set.
                  // Note, it's important that every change has a chance to add the
                  // property to `_reflectingProperties`. This ensures setting
                  // attribute + property reflects correctly.
                  if (options.reflect === true &&
                      !(this._updateState & STATE_IS_REFLECTING_TO_PROPERTY)) {
                      if (this._reflectingProperties === undefined) {
                          this._reflectingProperties = new Map();
                      }
                      this._reflectingProperties.set(name, options);
                  }
              }
              else {
                  // Abort the request if the property should not be considered changed.
                  shouldRequestUpdate = false;
              }
          }
          if (!this._hasRequestedUpdate && shouldRequestUpdate) {
              this._updatePromise = this._enqueueUpdate();
          }
      }
      /**
       * Requests an update which is processed asynchronously. This should
       * be called when an element should update based on some state not triggered
       * by setting a property. In this case, pass no arguments. It should also be
       * called when manually implementing a property setter. In this case, pass the
       * property `name` and `oldValue` to ensure that any configured property
       * options are honored. Returns the `updateComplete` Promise which is resolved
       * when the update completes.
       *
       * @param name {PropertyKey} (optional) name of requesting property
       * @param oldValue {any} (optional) old value of requesting property
       * @returns {Promise} A Promise that is resolved when the update completes.
       */
      requestUpdate(name, oldValue) {
          this.requestUpdateInternal(name, oldValue);
          return this.updateComplete;
      }
      /**
       * Sets up the element to asynchronously update.
       */
      async _enqueueUpdate() {
          this._updateState = this._updateState | STATE_UPDATE_REQUESTED;
          try {
              // Ensure any previous update has resolved before updating.
              // This `await` also ensures that property changes are batched.
              await this._updatePromise;
          }
          catch (e) {
              // Ignore any previous errors. We only care that the previous cycle is
              // done. Any error should have been handled in the previous update.
          }
          const result = this.performUpdate();
          // If `performUpdate` returns a Promise, we await it. This is done to
          // enable coordinating updates with a scheduler. Note, the result is
          // checked to avoid delaying an additional microtask unless we need to.
          if (result != null) {
              await result;
          }
          return !this._hasRequestedUpdate;
      }
      get _hasRequestedUpdate() {
          return (this._updateState & STATE_UPDATE_REQUESTED);
      }
      get hasUpdated() {
          return (this._updateState & STATE_HAS_UPDATED);
      }
      /**
       * Performs an element update. Note, if an exception is thrown during the
       * update, `firstUpdated` and `updated` will not be called.
       *
       * You can override this method to change the timing of updates. If this
       * method is overridden, `super.performUpdate()` must be called.
       *
       * For instance, to schedule updates to occur just before the next frame:
       *
       * ```
       * protected async performUpdate(): Promise<unknown> {
       *   await new Promise((resolve) => requestAnimationFrame(() => resolve()));
       *   super.performUpdate();
       * }
       * ```
       */
      performUpdate() {
          // Abort any update if one is not pending when this is called.
          // This can happen if `performUpdate` is called early to "flush"
          // the update.
          if (!this._hasRequestedUpdate) {
              return;
          }
          // Mixin instance properties once, if they exist.
          if (this._instanceProperties) {
              this._applyInstanceProperties();
          }
          let shouldUpdate = false;
          const changedProperties = this._changedProperties;
          try {
              shouldUpdate = this.shouldUpdate(changedProperties);
              if (shouldUpdate) {
                  this.update(changedProperties);
              }
              else {
                  this._markUpdated();
              }
          }
          catch (e) {
              // Prevent `firstUpdated` and `updated` from running when there's an
              // update exception.
              shouldUpdate = false;
              // Ensure element can accept additional updates after an exception.
              this._markUpdated();
              throw e;
          }
          if (shouldUpdate) {
              if (!(this._updateState & STATE_HAS_UPDATED)) {
                  this._updateState = this._updateState | STATE_HAS_UPDATED;
                  this.firstUpdated(changedProperties);
              }
              this.updated(changedProperties);
          }
      }
      _markUpdated() {
          this._changedProperties = new Map();
          this._updateState = this._updateState & ~STATE_UPDATE_REQUESTED;
      }
      /**
       * Returns a Promise that resolves when the element has completed updating.
       * The Promise value is a boolean that is `true` if the element completed the
       * update without triggering another update. The Promise result is `false` if
       * a property was set inside `updated()`. If the Promise is rejected, an
       * exception was thrown during the update.
       *
       * To await additional asynchronous work, override the `_getUpdateComplete`
       * method. For example, it is sometimes useful to await a rendered element
       * before fulfilling this Promise. To do this, first await
       * `super._getUpdateComplete()`, then any subsequent state.
       *
       * @returns {Promise} The Promise returns a boolean that indicates if the
       * update resolved without triggering another update.
       */
      get updateComplete() {
          return this._getUpdateComplete();
      }
      /**
       * Override point for the `updateComplete` promise.
       *
       * It is not safe to override the `updateComplete` getter directly due to a
       * limitation in TypeScript which means it is not possible to call a
       * superclass getter (e.g. `super.updateComplete.then(...)`) when the target
       * language is ES5 (https://github.com/microsoft/TypeScript/issues/338).
       * This method should be overridden instead. For example:
       *
       *   class MyElement extends LitElement {
       *     async _getUpdateComplete() {
       *       await super._getUpdateComplete();
       *       await this._myChild.updateComplete;
       *     }
       *   }
       * @deprecated Override `getUpdateComplete()` instead for forward
       *     compatibility with `lit-element` 3.0 / `@lit/reactive-element`.
       */
      _getUpdateComplete() {
          return this.getUpdateComplete();
      }
      /**
       * Override point for the `updateComplete` promise.
       *
       * It is not safe to override the `updateComplete` getter directly due to a
       * limitation in TypeScript which means it is not possible to call a
       * superclass getter (e.g. `super.updateComplete.then(...)`) when the target
       * language is ES5 (https://github.com/microsoft/TypeScript/issues/338).
       * This method should be overridden instead. For example:
       *
       *   class MyElement extends LitElement {
       *     async getUpdateComplete() {
       *       await super.getUpdateComplete();
       *       await this._myChild.updateComplete;
       *     }
       *   }
       */
      getUpdateComplete() {
          return this._updatePromise;
      }
      /**
       * Controls whether or not `update` should be called when the element requests
       * an update. By default, this method always returns `true`, but this can be
       * customized to control when to update.
       *
       * @param _changedProperties Map of changed properties with old values
       */
      shouldUpdate(_changedProperties) {
          return true;
      }
      /**
       * Updates the element. This method reflects property values to attributes.
       * It can be overridden to render and keep updated element DOM.
       * Setting properties inside this method will *not* trigger
       * another update.
       *
       * @param _changedProperties Map of changed properties with old values
       */
      update(_changedProperties) {
          if (this._reflectingProperties !== undefined &&
              this._reflectingProperties.size > 0) {
              // Use forEach so this works even if for/of loops are compiled to for
              // loops expecting arrays
              this._reflectingProperties.forEach((v, k) => this._propertyToAttribute(k, this[k], v));
              this._reflectingProperties = undefined;
          }
          this._markUpdated();
      }
      /**
       * Invoked whenever the element is updated. Implement to perform
       * post-updating tasks via DOM APIs, for example, focusing an element.
       *
       * Setting properties inside this method will trigger the element to update
       * again after this update cycle completes.
       *
       * @param _changedProperties Map of changed properties with old values
       */
      updated(_changedProperties) {
      }
      /**
       * Invoked when the element is first updated. Implement to perform one time
       * work on the element after update.
       *
       * Setting properties inside this method will trigger the element to update
       * again after this update cycle completes.
       *
       * @param _changedProperties Map of changed properties with old values
       */
      firstUpdated(_changedProperties) {
      }
  }
  _a = finalized;
  /**
   * Marks class as having finished creating properties.
   */
  UpdatingElement[_a] = true;

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  const legacyCustomElement = (tagName, clazz) => {
      window.customElements.define(tagName, clazz);
      // Cast as any because TS doesn't recognize the return type as being a
      // subtype of the decorated class when clazz is typed as
      // `Constructor<HTMLElement>` for some reason.
      // `Constructor<HTMLElement>` is helpful to make sure the decorator is
      // applied to elements however.
      // tslint:disable-next-line:no-any
      return clazz;
  };
  const standardCustomElement = (tagName, descriptor) => {
      const { kind, elements } = descriptor;
      return {
          kind,
          elements,
          // This callback is called once the class is otherwise fully defined
          finisher(clazz) {
              window.customElements.define(tagName, clazz);
          }
      };
  };
  /**
   * Class decorator factory that defines the decorated class as a custom element.
   *
   * ```
   * @customElement('my-element')
   * class MyElement {
   *   render() {
   *     return html``;
   *   }
   * }
   * ```
   * @category Decorator
   * @param tagName The name of the custom element to define.
   */
  const customElement = (tagName) => (classOrDescriptor) => (typeof classOrDescriptor === 'function') ?
      legacyCustomElement(tagName, classOrDescriptor) :
      standardCustomElement(tagName, classOrDescriptor);
  const standardProperty = (options, element) => {
      // When decorating an accessor, pass it through and add property metadata.
      // Note, the `hasOwnProperty` check in `createProperty` ensures we don't
      // stomp over the user's accessor.
      if (element.kind === 'method' && element.descriptor &&
          !('value' in element.descriptor)) {
          return Object.assign(Object.assign({}, element), { finisher(clazz) {
                  clazz.createProperty(element.key, options);
              } });
      }
      else {
          // createProperty() takes care of defining the property, but we still
          // must return some kind of descriptor, so return a descriptor for an
          // unused prototype field. The finisher calls createProperty().
          return {
              kind: 'field',
              key: Symbol(),
              placement: 'own',
              descriptor: {},
              // When @babel/plugin-proposal-decorators implements initializers,
              // do this instead of the initializer below. See:
              // https://github.com/babel/babel/issues/9260 extras: [
              //   {
              //     kind: 'initializer',
              //     placement: 'own',
              //     initializer: descriptor.initializer,
              //   }
              // ],
              initializer() {
                  if (typeof element.initializer === 'function') {
                      this[element.key] = element.initializer.call(this);
                  }
              },
              finisher(clazz) {
                  clazz.createProperty(element.key, options);
              }
          };
      }
  };
  const legacyProperty = (options, proto, name) => {
      proto.constructor
          .createProperty(name, options);
  };
  /**
   * A property decorator which creates a LitElement property which reflects a
   * corresponding attribute value. A [[`PropertyDeclaration`]] may optionally be
   * supplied to configure property features.
   *
   * This decorator should only be used for public fields. Private or protected
   * fields should use the [[`internalProperty`]] decorator.
   *
   * @example
   * ```ts
   * class MyElement {
   *   @property({ type: Boolean })
   *   clicked = false;
   * }
   * ```
   * @category Decorator
   * @ExportDecoratedItems
   */
  function property(options) {
      // tslint:disable-next-line:no-any decorator
      return (protoOrDescriptor, name) => (name !== undefined) ?
          legacyProperty(options, protoOrDescriptor, name) :
          standardProperty(options, protoOrDescriptor);
  }

  /**
  @license
  Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
  This code may only be used under the BSD style license found at
  http://polymer.github.io/LICENSE.txt The complete set of authors may be found at
  http://polymer.github.io/AUTHORS.txt The complete set of contributors may be
  found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by Google as
  part of the polymer project is also subject to an additional IP rights grant
  found at http://polymer.github.io/PATENTS.txt
  */
  /**
   * Whether the current browser supports `adoptedStyleSheets`.
   */
  const supportsAdoptingStyleSheets = (window.ShadowRoot) &&
      (window.ShadyCSS === undefined || window.ShadyCSS.nativeShadow) &&
      ('adoptedStyleSheets' in Document.prototype) &&
      ('replace' in CSSStyleSheet.prototype);
  const constructionToken = Symbol();
  class CSSResult {
      constructor(cssText, safeToken) {
          if (safeToken !== constructionToken) {
              throw new Error('CSSResult is not constructable. Use `unsafeCSS` or `css` instead.');
          }
          this.cssText = cssText;
      }
      // Note, this is a getter so that it's lazy. In practice, this means
      // stylesheets are not created until the first element instance is made.
      get styleSheet() {
          if (this._styleSheet === undefined) {
              // Note, if `supportsAdoptingStyleSheets` is true then we assume
              // CSSStyleSheet is constructable.
              if (supportsAdoptingStyleSheets) {
                  this._styleSheet = new CSSStyleSheet();
                  this._styleSheet.replaceSync(this.cssText);
              }
              else {
                  this._styleSheet = null;
              }
          }
          return this._styleSheet;
      }
      toString() {
          return this.cssText;
      }
  }
  /**
   * Wrap a value for interpolation in a [[`css`]] tagged template literal.
   *
   * This is unsafe because untrusted CSS text can be used to phone home
   * or exfiltrate data to an attacker controlled site. Take care to only use
   * this with trusted input.
   */
  const unsafeCSS = (value) => {
      return new CSSResult(String(value), constructionToken);
  };
  const textFromCSSResult = (value) => {
      if (value instanceof CSSResult) {
          return value.cssText;
      }
      else if (typeof value === 'number') {
          return value;
      }
      else {
          throw new Error(`Value passed to 'css' function must be a 'css' function result: ${value}. Use 'unsafeCSS' to pass non-literal values, but
            take care to ensure page security.`);
      }
  };
  /**
   * Template tag which which can be used with LitElement's [[LitElement.styles |
   * `styles`]] property to set element styles. For security reasons, only literal
   * string values may be used. To incorporate non-literal values [[`unsafeCSS`]]
   * may be used inside a template string part.
   */
  const css = (strings, ...values) => {
      const cssText = values.reduce((acc, v, idx) => acc + textFromCSSResult(v) + strings[idx + 1], strings[0]);
      return new CSSResult(cssText, constructionToken);
  };

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  // IMPORTANT: do not change the property name or the assignment expression.
  // This line will be used in regexes to search for LitElement usage.
  // TODO(justinfagnani): inject version number at build time
  (window['litElementVersions'] || (window['litElementVersions'] = []))
      .push('2.5.1');
  /**
   * Sentinal value used to avoid calling lit-html's render function when
   * subclasses do not implement `render`
   */
  const renderNotImplemented = {};
  /**
   * Base element class that manages element properties and attributes, and
   * renders a lit-html template.
   *
   * To define a component, subclass `LitElement` and implement a
   * `render` method to provide the component's template. Define properties
   * using the [[`properties`]] property or the [[`property`]] decorator.
   */
  class LitElement extends UpdatingElement {
      /**
       * Return the array of styles to apply to the element.
       * Override this method to integrate into a style management system.
       *
       * @nocollapse
       */
      static getStyles() {
          return this.styles;
      }
      /** @nocollapse */
      static _getUniqueStyles() {
          // Only gather styles once per class
          if (this.hasOwnProperty(JSCompiler_renameProperty('_styles', this))) {
              return;
          }
          // Take care not to call `this.getStyles()` multiple times since this
          // generates new CSSResults each time.
          // TODO(sorvell): Since we do not cache CSSResults by input, any
          // shared styles will generate new stylesheet objects, which is wasteful.
          // This should be addressed when a browser ships constructable
          // stylesheets.
          const userStyles = this.getStyles();
          if (Array.isArray(userStyles)) {
              // De-duplicate styles preserving the _last_ instance in the set.
              // This is a performance optimization to avoid duplicated styles that can
              // occur especially when composing via subclassing.
              // The last item is kept to try to preserve the cascade order with the
              // assumption that it's most important that last added styles override
              // previous styles.
              const addStyles = (styles, set) => styles.reduceRight((set, s) => 
              // Note: On IE set.add() does not return the set
              Array.isArray(s) ? addStyles(s, set) : (set.add(s), set), set);
              // Array.from does not work on Set in IE, otherwise return
              // Array.from(addStyles(userStyles, new Set<CSSResult>())).reverse()
              const set = addStyles(userStyles, new Set());
              const styles = [];
              set.forEach((v) => styles.unshift(v));
              this._styles = styles;
          }
          else {
              this._styles = userStyles === undefined ? [] : [userStyles];
          }
          // Ensure that there are no invalid CSSStyleSheet instances here. They are
          // invalid in two conditions.
          // (1) the sheet is non-constructible (`sheet` of a HTMLStyleElement), but
          //     this is impossible to check except via .replaceSync or use
          // (2) the ShadyCSS polyfill is enabled (:. supportsAdoptingStyleSheets is
          //     false)
          this._styles = this._styles.map((s) => {
              if (s instanceof CSSStyleSheet && !supportsAdoptingStyleSheets) {
                  // Flatten the cssText from the passed constructible stylesheet (or
                  // undetectable non-constructible stylesheet). The user might have
                  // expected to update their stylesheets over time, but the alternative
                  // is a crash.
                  const cssText = Array.prototype.slice.call(s.cssRules)
                      .reduce((css, rule) => css + rule.cssText, '');
                  return unsafeCSS(cssText);
              }
              return s;
          });
      }
      /**
       * Performs element initialization. By default this calls
       * [[`createRenderRoot`]] to create the element [[`renderRoot`]] node and
       * captures any pre-set values for registered properties.
       */
      initialize() {
          super.initialize();
          this.constructor._getUniqueStyles();
          this.renderRoot = this.createRenderRoot();
          // Note, if renderRoot is not a shadowRoot, styles would/could apply to the
          // element's getRootNode(). While this could be done, we're choosing not to
          // support this now since it would require different logic around de-duping.
          if (window.ShadowRoot && this.renderRoot instanceof window.ShadowRoot) {
              this.adoptStyles();
          }
      }
      /**
       * Returns the node into which the element should render and by default
       * creates and returns an open shadowRoot. Implement to customize where the
       * element's DOM is rendered. For example, to render into the element's
       * childNodes, return `this`.
       * @returns {Element|DocumentFragment} Returns a node into which to render.
       */
      createRenderRoot() {
          return this.attachShadow(this.constructor.shadowRootOptions);
      }
      /**
       * Applies styling to the element shadowRoot using the [[`styles`]]
       * property. Styling will apply using `shadowRoot.adoptedStyleSheets` where
       * available and will fallback otherwise. When Shadow DOM is polyfilled,
       * ShadyCSS scopes styles and adds them to the document. When Shadow DOM
       * is available but `adoptedStyleSheets` is not, styles are appended to the
       * end of the `shadowRoot` to [mimic spec
       * behavior](https://wicg.github.io/construct-stylesheets/#using-constructed-stylesheets).
       */
      adoptStyles() {
          const styles = this.constructor._styles;
          if (styles.length === 0) {
              return;
          }
          // There are three separate cases here based on Shadow DOM support.
          // (1) shadowRoot polyfilled: use ShadyCSS
          // (2) shadowRoot.adoptedStyleSheets available: use it
          // (3) shadowRoot.adoptedStyleSheets polyfilled: append styles after
          // rendering
          if (window.ShadyCSS !== undefined && !window.ShadyCSS.nativeShadow) {
              window.ShadyCSS.ScopingShim.prepareAdoptedCssText(styles.map((s) => s.cssText), this.localName);
          }
          else if (supportsAdoptingStyleSheets) {
              this.renderRoot.adoptedStyleSheets =
                  styles.map((s) => s instanceof CSSStyleSheet ? s : s.styleSheet);
          }
          else {
              // This must be done after rendering so the actual style insertion is done
              // in `update`.
              this._needsShimAdoptedStyleSheets = true;
          }
      }
      connectedCallback() {
          super.connectedCallback();
          // Note, first update/render handles styleElement so we only call this if
          // connected after first update.
          if (this.hasUpdated && window.ShadyCSS !== undefined) {
              window.ShadyCSS.styleElement(this);
          }
      }
      /**
       * Updates the element. This method reflects property values to attributes
       * and calls `render` to render DOM via lit-html. Setting properties inside
       * this method will *not* trigger another update.
       * @param _changedProperties Map of changed properties with old values
       */
      update(changedProperties) {
          // Setting properties in `render` should not trigger an update. Since
          // updates are allowed after super.update, it's important to call `render`
          // before that.
          const templateResult = this.render();
          super.update(changedProperties);
          // If render is not implemented by the component, don't call lit-html render
          if (templateResult !== renderNotImplemented) {
              this.constructor
                  .render(templateResult, this.renderRoot, { scopeName: this.localName, eventContext: this });
          }
          // When native Shadow DOM is used but adoptedStyles are not supported,
          // insert styling after rendering to ensure adoptedStyles have highest
          // priority.
          if (this._needsShimAdoptedStyleSheets) {
              this._needsShimAdoptedStyleSheets = false;
              this.constructor._styles.forEach((s) => {
                  const style = document.createElement('style');
                  style.textContent = s.cssText;
                  this.renderRoot.appendChild(style);
              });
          }
      }
      /**
       * Invoked on each update to perform rendering tasks. This method may return
       * any value renderable by lit-html's `NodePart` - typically a
       * `TemplateResult`. Setting properties inside this method will *not* trigger
       * the element to update.
       */
      render() {
          return renderNotImplemented;
      }
  }
  /**
   * Ensure this class is marked as `finalized` as an optimization ensuring
   * it will not needlessly try to `finalize`.
   *
   * Note this property name is a string to prevent breaking Closure JS Compiler
   * optimizations. See updating-element.ts for more information.
   */
  LitElement['finalized'] = true;
  /**
   * Reference to the underlying library method used to render the element's
   * DOM. By default, points to the `render` method from lit-html's shady-render
   * module.
   *
   * **Most users will never need to touch this property.**
   *
   * This  property should not be confused with the `render` instance method,
   * which should be overridden to define a template for the element.
   *
   * Advanced users creating a new base class based on LitElement can override
   * this property to point to a custom render method with a signature that
   * matches [shady-render's `render`
   * method](https://lit-html.polymer-project.org/api/modules/shady_render.html#render).
   *
   * @nocollapse
   */
  LitElement.render = render$1;
  /** @nocollapse */
  LitElement.shadowRootOptions = { mode: 'open' };

  let PageContent = _decorate([customElement('page-content')], function (_initialize, _LitElement) {
    class PageContent extends _LitElement {
      constructor(...args) {
        super(...args);
        _initialize(this);
      }
    }
    return {
      F: PageContent,
      d: [{
        kind: "get",
        static: true,
        key: "styles",
        value: function () {
          return css`
      /** Component styling **/
      :host {
        display: block;
        margin: 0 auto;
        padding: 0 12px;
        max-width: 1024px;
      }

      @media only screen and (max-width: 900px) {
        :host {
          padding: 0;
        }
      }
    `;
        }
      }, {
        kind: "method",
        key: "render",
        value: function render() {
          return html`
      <slot></slot>
    `;
        }
      }]
    };
  }, LitElement);

  let SharedNavigation = _decorate([customElement('shared-nav')], function (_initialize, _LitElement) {
    class SharedNavigation extends _LitElement {
      constructor() {
        super();
        _initialize(this);
        this._mobileActive = false;
      }
    }
    return {
      F: SharedNavigation,
      d: [{
        kind: "get",
        static: true,
        key: "styles",
        value: function () {
          return css`
            /** Colors and variables **/
            :host {
            }
            @media (prefers-color-scheme: dark) {
                :host {
                }
            }

            /** Component styling **/
            :host {
            }

            :host .nav-container a {
                color: var(--link-font-color);
                text-decoration: none;
            }
            :host .nav-container a:hover {
                color: var(--link-font-color-hover);
            }

            :host .nav-container {
                display: flex;
                gap: 8px;
                margin-top: 8px;
                background: var(--g-background-color);
            }

            :host .nav-item {
                font-size: 16px;
                font-weight: 600;
                padding: 10px 16px;
            }
            :host .nav-item:hover {
                background-color: var(--g-background-extra2-color);
            }

            :host .nav-toggler {
                display: none;
                background-image: url('hamburger.svg');
                background-repeat: no-repeat;
                background-position: center;
                cursor: pointer;
                position: absolute;
                top: 0;
                left: 0;
                width: 48px;
                height: 48px;
            }
            :host .nav-toggler:hover {
                background-color: var(--g-background-extra2-color);
            }

            @media only screen and (max-width: 640px) {
                :host .nav-container {
                    display: none;
                    flex-direction: column;
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    padding-top: 40px;
                    padding-bottom: 12px;
                }
                :host .nav-container.nav-active {
                    display: flex;
                }

                :host .nav-toggler {
                    display: block;
                }
            }
        `;
        }
      }, {
        kind: "method",
        key: "_onMobileToggled",
        value: function _onMobileToggled() {
          this._mobileActive = !this._mobileActive;
          this.requestUpdate();
        }
      }, {
        kind: "method",
        key: "render",
        value: function render() {
          const containerClassList = ["nav-container"];
          if (this._mobileActive) {
            containerClassList.push("nav-active");
          }
          return html`
            <div class="${containerClassList.join(" ")}">
                <a href="https://julialang.org/" target="_blank" class="nav-item">
                    JuliaLang
                </a>
                <a href="https://github.com/JuliaLang/julia/" target="_blank" class="nav-item">
                    GitHub Repo
                </a>
            </div>
            <div
                class="nav-toggler"
                @click="${this._onMobileToggled}"
            ></div>
        `;
        }
      }]
    };
  }, LitElement);

  let IndexHeader = _decorate([customElement('gr-index-entry')], function (_initialize, _LitElement) {
    class IndexHeader extends _LitElement {
      constructor() {
        super();

        // Auto-refresh about once a minute so that the relative time of generation is always actual.
        _initialize(this);
        this._refreshTimeout = setTimeout(this._refresh.bind(this), 60 * 1000);
      }
    }
    return {
      F: IndexHeader,
      d: [{
        kind: "get",
        static: true,
        key: "styles",
        value: function () {
          return css`
          /** Colors and variables **/
          :host {
            --header-meta-color: #98a5b8;
          }
          @media (prefers-color-scheme: dark) {
            :host {
              --header-meta-color: #515c6c;
            }
          }

          /** Component styling **/
          :host {
          }

          :host .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          :host .header-metadata {
            color: var(--header-meta-color);
            text-align: right;
          }
          :host .header-metadata a {
            color: var(--link-font-color);
            text-decoration: none;
          }
          :host .header-metadata a:hover {
            color: var(--link-font-color-hover);
          }

          @media only screen and (max-width: 900px) {
            :host .header {
              flex-wrap: wrap;
              text-align: center;
            }
            :host .header-title,
            :host .header-metadata {
              width: 100%;
            }
            :host .header-metadata {
              padding-bottom: 12px;
              text-align: center;
            }
          }
        `;
        }
      }, {
        kind: "field",
        decorators: [property({
          type: Date
        })],
        key: "generated_at",
        value() {
          return null;
        }
      }, {
        kind: "method",
        key: "_refresh",
        value: function _refresh() {
          this.requestUpdate();

          // Continue updating.
          this._refreshTimeout = setTimeout(this._refresh.bind(this), 60 * 1000);
        }
      }, {
        kind: "method",
        key: "render",
        value: function render() {
          let generatedAt = "";
          let generatedRel = "";
          if (this.generated_at) {
            generatedAt = greports.format.formatTimestamp(this.generated_at);
            let timeValue = (Date.now() - this.generated_at) / (1000 * 60);
            let timeUnit = "minute";
            if (timeValue < 1) {
              generatedRel = "just now";
            } else {
              if (timeValue > 60) {
                timeValue = timeValue / 60;
                timeUnit = "hour";
              }
              generatedRel = greports.format.formatTimespan(-Math.round(timeValue), timeUnit);
            }
          }
          return html`
            <div class="header">
                <h1 class="header-title">
                    Julia PRs by File
                </h1>
                <div class="header-metadata">
                    ${this.generated_at ? html`
                        <span title="${generatedAt}">
                            data generated ${generatedRel}
                        </span>
                    ` : ''}
                    <br/>
                    <a
                            href="https://github.com/inkydragon/julia-prs"
                            target="_blank"
                    >
                        contribute on GitHub
                    </a>
                </div>
            </div>
        `;
        }
      }]
    };
  }, LitElement);

  let IndexDescription = _decorate([customElement('gr-index-description')], function (_initialize, _LitElement) {
    class IndexDescription extends _LitElement {
      constructor() {
        super();
        _initialize(this);
        this._availableRepos = [...greports.config.AVAILABLE_REPOSITORIES];
      }
    }
    return {
      F: IndexDescription,
      d: [{
        kind: "get",
        static: true,
        key: "styles",
        value: function () {
          return css`
          /** Colors and variables **/
          :host {
          }
          @media (prefers-color-scheme: dark) {
            :host {
            }
          }

          /** Component styling **/
          :host {
            line-height: 22px;
          }

          :host .header-description {
            display: flex;
            align-items: flex-end;
            color: var(--dimmed-font-color);
          }

          :host .header-description-column {
            flex: 2;
          }
          :host .header-description-column.header-extra-links {
            flex: 1;
            text-align: right;
          }

          :host .header-description a {
            color: var(--link-font-color);
            text-decoration: none;
          }
          :host .header-description a:hover {
            color: var(--link-font-color-hover);
          }

          :host hr {
            border: none;
            border-top: 1px solid var(--g-background-extra-color);
            width: 30%;
          }

          @media only screen and (max-width: 900px) {
            :host .header-description {
              padding: 0 8px;
              flex-direction: column;
            }

            :host .header-description-column {
              width: 100%;
            }
            :host .header-description-column.header-extra-links {
              text-align: center;
              padding-top: 12px;
            }
          }
        `;
        }
      }, {
        kind: "field",
        decorators: [property({
          type: Date
        })],
        key: "generated_at",
        value() {
          return null;
        }
      }, {
        kind: "method",
        key: "render",
        value: function render() {
          return html`
            <div class="header-description">
                <div class="header-description-column">
                    This page lists all open pull-requests (PRs) associated with the selected file
                    or folder.
                    <br>
                    The goal here is to help contributors and maintainers identify possible
                    conflicts and duplication.
                </div>
                <div class="header-description-column header-extra-links">
                    Available repositories:
                    ${this._availableRepos.map(item => {
          return html`
                        <br />
                        <a
                          href="?repo=${encodeURIComponent(item)}"
                          @click="${event => {
            event.preventDefault();
            greports.util.setPageState({
              repository: item
            }, false);
            window.location.reload();
          }}"
                        >${item}</a>
                      `;
        })}
                </div>
            </div>
        `;
        }
      }]
    };
  }, LitElement);

  const GH_PULL_URL_RE = RegExp("^https://github.com/([a-z0-9-_]+/[a-z0-9-_]+)/pull/([0-9]+)$", "i");
  const GH_PULL_REF_RE = RegExp("^([a-z0-9-_]+/[a-z0-9-_]+)?#([0-9]+)$", "i");
  const GH_PULL_NUMBER_RE = RegExp("^[#]?([0-9]+)$", "i");
  let PullFilter = _decorate([customElement('gr-pull-filter')], function (_initialize, _LitElement) {
    class PullFilter extends _LitElement {
      constructor() {
        super();
        _initialize(this);
        this._rawValue = "";
        this._resolvedValue = "";
      }
    }
    return {
      F: PullFilter,
      d: [{
        kind: "get",
        static: true,
        key: "styles",
        value: function () {
          return css`
          /** Colors and variables **/
          :host {
          }
          @media (prefers-color-scheme: dark) {
            :host {
            }
          }

          /** Component styling **/
          :host {
          }

          :host .pull-filter {
            display: flex;
            gap: 12px;
            align-items: center;
            justify-content: center;
            margin-top: 24px;
          }

          :host .pull-filter-value {
            position: relative;
            flex-grow: 1;
          }

          :host .pull-filter-value input {
            background: var(--g-background-extra2-color);
            border: 2px solid var(--g-background-extra-color);
            border-radius: 4px 4px;
            color: var(--g-font-color);
            font-size: 16px;
            padding: 8px 48px 8px 12px;
            width: calc(100% - 60px);
          }

          :host .pull-filter-reset {
            position: absolute;
            right: -3px;
            top: 0;
            bottom: 0;
            width: 36px;
            background-color: var(--g-background-extra-color);
            background-image: url('remove.svg');
            background-repeat: no-repeat;
            background-position: center;
            background-size: 20px 20px;
            border: 2px solid var(--g-background-extra-color);
            border-left: none;
            border-radius: 0 4px 4px 0;
            cursor: pointer;
          }
          :host .pull-filter-reset:hover {
            background-color: var(--g-background-extra2-color);
          }

          :host .pull-filter-resolved {
            font-weight: 600;
            padding: 0 8px;
            min-width: 60px;
          }

          @media only screen and (max-width: 900px) {
            :host .pull-filter {
                padding: 0 12px;
            }
          }
        `;
        }
      }, {
        kind: "field",
        decorators: [property({
          type: String
        })],
        key: "value",
        value() {
          return "";
        }
      }, {
        kind: "method",
        key: "updated",
        value: function updated(changedProperties) {
          if (changedProperties.has("value")) {
            this._rawValue = this.value;
            this._resolvedValue = this.value !== "" ? this._parsePullNumber(this.value) : "";
          }
        }
      }, {
        kind: "method",
        key: "_parsePullNumber",
        value: function _parsePullNumber(value) {
          let match = value.match(GH_PULL_URL_RE);
          if (match) {
            return match[2];
          }
          match = value.match(GH_PULL_REF_RE);
          if (match) {
            return match[2];
          }
          match = value.match(GH_PULL_NUMBER_RE);
          if (match) {
            return match[1];
          }
          return "00000";
        }
      }, {
        kind: "method",
        key: "_filterChanged",
        value: function _filterChanged(event) {
          this._resolvedValue = "";
          this._rawValue = event.target.value.trim();
          if (this._rawValue !== "") {
            this._resolvedValue = this._parsePullNumber(this._rawValue);
          }
          this.dispatchEvent(greports.util.createEvent("filterchanged", {
            "pull": this._resolvedValue
          }));
          this.requestUpdate();
        }
      }, {
        kind: "method",
        key: "_filterReset",
        value: function _filterReset(event) {
          this._rawValue = "";
          this._resolvedValue = "";
          this.dispatchEvent(greports.util.createEvent("filterchanged", {
            "pull": this._resolvedValue
          }));
          this.requestUpdate();
        }
      }, {
        kind: "method",
        key: "render",
        value: function render() {
          return html`
            <div class="pull-filter">
                <span class="pull-filter-label">Input PR link or number:</span>
                <div class="pull-filter-value">
                    <input
                        type="text"
                        .value="${this._rawValue}"
                        @change="${this._filterChanged.bind(this)}"
                    />
                    <div
                        class="pull-filter-reset"
                        @click="${this._filterReset.bind(this)}"
                    ></div>
                </div>
                <span class="pull-filter-resolved">
                    ${this._resolvedValue !== "" ? "#" + this._resolvedValue : ""}
                </span>
            </div>
        `;
        }
      }]
    };
  }, LitElement);

  let RootItem = _decorate([customElement('gr-root-item')], function (_initialize, _LitElement) {
    class RootItem extends _LitElement {
      constructor(...args) {
        super(...args);
        _initialize(this);
      }
    }
    return {
      F: RootItem,
      d: [{
        kind: "get",
        static: true,
        key: "styles",
        value: function () {
          return css`
          /** Colors and variables **/
          :host {
            --tab-hover-background-color: rgba(0, 0, 0, 0.14);
          }
          @media (prefers-color-scheme: dark) {
            :host {
              --tab-hover-background-color: rgba(255, 255, 255, 0.14);
            }
          }

          /** Component styling **/
          :host {
            max-width: 240px;
          }

          :host .root-item {
            color: var(--g-font-color);
            cursor: pointer;
            display: flex;
            flex-direction: row;
            gap: 8px;
            padding: 6px 12px 6px 6px;
            align-items: center;
          }
          :host .root-item:hover {
            background-color: var(--tab-hover-background-color);
          }

          :host .root-icon {
            background-image: url('filesystem.svg');
            background-size: 16px 16px;
            background-position: 50% 50%;
            background-repeat: no-repeat;
            border-radius: 2px;
            display: inline-block;
            width: 20px;
            height: 20px;
            min-width: 20px;
          }

          @media (prefers-color-scheme: light) {
            :host .root-icon {
              filter: brightness(0.5);
            }
          }

          :host .root-title {
            font-size: 14px;
            font-weight: 600;
            white-space: nowrap;
            overflow: hidden;
          }

          :host .root-branch {
            color: var(--link-font-color);
            flex-grow: 1;
            font-size: 14px;
            font-weight: 600;
            text-align: right;
          }
          :host .root-branch:hover {
            color: var(--link-font-color-hover);
          }

          @media only screen and (max-width: 900px) {
            :host .root-item {
              padding: 10px 16px 10px 12px;
            }

            :host .root-title,
            :host .root-branch {
              font-size: 16px;
            }
          }
        `;
        }
      }, {
        kind: "field",
        decorators: [property({
          type: String
        })],
        key: "repository",
        value() {
          return "";
        }
      }, {
        kind: "field",
        decorators: [property({
          type: String,
          reflect: true
        })],
        key: "branch",
        value() {
          return "";
        }
      }, {
        kind: "method",
        key: "_onIconClicked",
        value: function _onIconClicked(event) {
          event.preventDefault();
          event.stopPropagation();
          this.dispatchEvent(greports.util.createEvent("iconclick"), {});
        }
      }, {
        kind: "method",
        key: "_onBranchClicked",
        value: function _onBranchClicked(event) {
          event.preventDefault();
          event.stopPropagation();
          this.dispatchEvent(greports.util.createEvent("branchclick"), {});
        }
      }, {
        kind: "method",
        key: "render",
        value: function render() {
          return html`
            <div class="root-item">
                <div
                  class="root-icon"
                  @click="${this._onIconClicked}"
                ></div>
                <span class="root-title">
                    ${this.repository}
                </span>
                <span
                  class="root-branch"
                  @click="${this._onBranchClicked}"
                >
                    ${this.branch}
                </span>
            </div>
        `;
        }
      }]
    };
  }, LitElement);

  let FileItem = _decorate([customElement('gr-file-item')], function (_initialize, _LitElement) {
    class FileItem extends _LitElement {
      constructor(...args) {
        super(...args);
        _initialize(this);
      }
    }
    return {
      F: FileItem,
      d: [{
        kind: "get",
        static: true,
        key: "styles",
        value: function () {
          return css`
          /** Colors and variables **/
          :host {
            --tab-hover-background-color: rgba(0, 0, 0, 0.14);
            --tab-active-background-color: #d6e6ff;
            --tab-active-border-color: #397adf;
          }
          @media (prefers-color-scheme: dark) {
            :host {
              --tab-hover-background-color: rgba(255, 255, 255, 0.14);
              --tab-active-background-color: #2c3c55;
              --tab-active-border-color: #397adf;
            }
          }

          /** Component styling **/
          :host {
            max-width: 240px;
          }

          :host .file-item {
            border-left: 5px solid transparent;
            color: var(--g-font-color);
            cursor: pointer;
            display: flex;
            flex-direction: row;
            gap: 8px;
            padding: 3px 12px;
            align-items: center;
          }
          :host .file-item:hover {
            background-color: var(--tab-hover-background-color);
          }
          :host .file-item--active {
            background-color: var(--tab-active-background-color);
            border-left: 5px solid var(--tab-active-border-color);
          }

          :host .file-icon {
            background-size: 16px 16px;
            background-position: 50% 50%;
            background-repeat: no-repeat;
            border-radius: 2px;
            display: inline-block;
            width: 20px;
            height: 20px;
            min-width: 20px;
          }
          :host .file-icon--folder {
            background-image: url('folder.svg');
          }
          :host .file-icon--file {
            background-image: url('file.svg');
            filter: brightness(0.5);
          }

          @media (prefers-color-scheme: light) {
            :host .file-icon--folder {
              filter: brightness(0.5);
            }
            :host .file-icon--file {
              filter: none;
            }
          }

          :host .file-title {
            font-size: 13px;
            white-space: nowrap;
            overflow: hidden;
          }

          :host .file-pull-count {
            color: var(--dimmed-font-color);
            flex-grow: 1;
            font-size: 13px;
            text-align: right;
          }
          :host .file-pull-count--hot {
            color: var(--g-font-color);
            font-weight: 700;
          }

          @media only screen and (max-width: 900px) {
            :host .file-item {
              padding: 6px 16px;
            }

            :host .file-title,
            :host .file-pull-count {
              font-size: 16px;
            }
          }
        `;
        }
      }, {
        kind: "field",
        decorators: [property({
          type: String
        })],
        key: "path",
        value() {
          return "";
        }
      }, {
        kind: "field",
        decorators: [property({
          type: String,
          reflect: true
        })],
        key: "name",
        value() {
          return "";
        }
      }, {
        kind: "field",
        decorators: [property({
          type: String,
          reflect: true
        })],
        key: "type",
        value() {
          return "";
        }
      }, {
        kind: "field",
        decorators: [property({
          type: Boolean,
          reflect: true
        })],
        key: "active",
        value() {
          return false;
        }
      }, {
        kind: "field",
        decorators: [property({
          type: Number
        })],
        key: "pull_count",
        value() {
          return 0;
        }
      }, {
        kind: "method",
        key: "_onIconClicked",
        value: function _onIconClicked(event) {
          event.preventDefault();
          event.stopPropagation();
          this.dispatchEvent(greports.util.createEvent("iconclick"), {});
        }
      }, {
        kind: "method",
        key: "render",
        value: function render() {
          const classList = ["file-item"];
          if (this.active) {
            classList.push("file-item--active");
          }
          const iconClassList = ["file-icon", "file-icon--" + this.type];
          const countClassList = ["file-pull-count"];
          if (this.pull_count > 50) {
            countClassList.push("file-pull-count--hot");
          }
          return html`
            <div
              class="${classList.join(" ")}"
              title="${this.path}"
            >
                <div
                  class="${iconClassList.join(" ")}"
                  @click="${this._onIconClicked}"
                ></div>
                <span class="file-title">
                    ${this.name}
                </span>
                <span class="${countClassList.join(" ")}">
                    ${this.pull_count}
                </span>
            </div>
        `;
        }
      }]
    };
  }, LitElement);

  let FileList = _decorate([customElement('gr-file-list')], function (_initialize, _LitElement) {
    class FileList extends _LitElement {
      constructor() {
        super();
        _initialize(this);
        this._branchSelectorActive = false;
      }
    }
    return {
      F: FileList,
      d: [{
        kind: "get",
        static: true,
        key: "styles",
        value: function () {
          return css`
          /** Colors and variables **/
          :host {
            --files-background-color: #fcfcfa;
            --files-border-color: #515c6c;
          }
          @media (prefers-color-scheme: dark) {
            :host {
              --files-background-color: #0d1117;
              --files-border-color: #515c6c;
            }
          }

          /** Component styling **/
          :host {
            position: relative;
          }

          :host .file-list {
            background-color: var(--files-background-color);
            border-right: 2px solid var(--files-border-color);
            width: 320px;
            min-height: 216px;
          }

          :host .file-list-folder .file-list-folder {
            margin-left: 12px;
          }

          :host .branch-selector {
            display: none;
            position: absolute;
            top: 32px;
            left: 0;
            right: 0;
            flex-direction: column;
            gap: 4px;
            background-color: var(--g-background-extra2-color);
            border-top: 2px solid var(--g-background-color);
            border-bottom: 2px solid var(--g-background-color);
            padding: 10px 14px;
          }
          :host .branch-selector.branch-selector--active {
            display: flex;
          }

          :host .branch-selector ul {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 2px;
            list-style: none;
            margin: 0;
            padding: 0;
          }

          :host .branch-selector ul li {
            color: var(--link-font-color);
            cursor: pointer;
            padding: 2px 0;
          }
          :host .branch-selector ul li:hover {
            color: var(--link-font-color-hover);
          }

          @media only screen and (max-width: 900px) {
            :host {
              width: 100%
            }

            :host .file-list {
              width: 100% !important;
            }

            :host .branch-selector {
              border-top-width: 4px;
              border-bottom-width: 4px;
              font-size: 105%;
              padding: 16px 24px;
              top: 40px;
            }

            :host .branch-selector ul {
              gap: 4px;
            }

            :host .branch-selector ul li {
              padding: 4px 8px;
            }
          }
        `;
        }
      }, {
        kind: "field",
        decorators: [property({
          type: Array
        })],
        key: "branches",
        value() {
          return [];
        }
      }, {
        kind: "field",
        decorators: [property({
          type: Object
        })],
        key: "files",
        value() {
          return {};
        }
      }, {
        kind: "field",
        decorators: [property({
          type: String
        })],
        key: "selectedRepository",
        value() {
          return greports.config.DEFAULT_REPOSITORY;
        }
      }, {
        kind: "field",
        decorators: [property({
          type: String
        })],
        key: "selectedBranch",
        value() {
          return greports.config.DEFAULT_BRANCH;
        }
      }, {
        kind: "field",
        decorators: [property({
          type: String
        })],
        key: "selectedPath",
        value() {
          return "";
        }
      }, {
        kind: "field",
        decorators: [property({
          type: Array
        })],
        key: "selectedFolders",
        value() {
          return [];
        }
      }, {
        kind: "field",
        decorators: [property({
          type: String
        })],
        key: "filteredPull",
        value() {
          return "";
        }
      }, {
        kind: "method",
        key: "updated",
        value: function updated(changedProperties) {
          if (changedProperties.has("selectedPath") || changedProperties.has("selectedBranch") || changedProperties.has("files")) {
            this.selectedFolders = this._getOpenFolders(this.selectedPath);
          }
        }
      }, {
        kind: "method",
        key: "_onBranchClicked",
        value: function _onBranchClicked() {
          this._branchSelectorActive = !this._branchSelectorActive;
          this.requestUpdate();
        }
      }, {
        kind: "method",
        key: "_onBranchSelected",
        value: function _onBranchSelected(branchName) {
          this._branchSelectorActive = false;
          if (this.selectedBranch !== branchName) {
            this.selectedFolders = [];
          }
          this.requestUpdate();
          this.dispatchEvent(greports.util.createEvent("branchselect", {
            "branch": branchName
          }));
        }
      }, {
        kind: "method",
        key: "_toggleEntry",
        value: function _toggleEntry(entryType, entryPath, failOnMatch) {
          if (entryType === "root") {
            this.selectedFolders = [];
            this.requestUpdate();
          } else if (entryType === "folder") {
            const entryIndex = this.selectedFolders.indexOf(entryPath);
            if (entryIndex >= 0) {
              if (!failOnMatch) {
                this.selectedFolders.splice(entryIndex, 1);
              }
            } else {
              this.selectedFolders.push(entryPath);
            }
            this.requestUpdate();
          }
        }
      }, {
        kind: "method",
        key: "_onItemClicked",
        value: function _onItemClicked(entryType, entryPath, entryPulls) {
          this._toggleEntry(entryType, entryPath, true);
          this.dispatchEvent(greports.util.createEvent("pathclick", {
            "type": entryType,
            "path": entryPath,
            "pulls": entryPulls
          }));
        }
      }, {
        kind: "method",
        key: "_onItemIconClicked",
        value: function _onItemIconClicked(entryType, entryPath, entryPulls) {
          this._toggleEntry(entryType, entryPath, false);
          if (entryType === "root" || entryType === "file") {
            this.dispatchEvent(greports.util.createEvent("pathclick", {
              "type": entryType,
              "path": entryPath,
              "pulls": entryPulls
            }));
          }
        }
      }, {
        kind: "method",
        key: "_getOpenFolders",
        value: function _getOpenFolders(path) {
          if (path === "") {
            return [];
          }
          const pathBits = path.split("/").filter(item => item !== "");
          const selectedFolders = [];
          let currentPath = "";
          pathBits.slice(0, -1).forEach(item => {
            currentPath = currentPath === "" ? item : `${currentPath}/${item}`;
            selectedFolders.push(currentPath);
          });
          const branchFiles = this.files[this.selectedBranch] || {};
          if (typeof branchFiles[path] !== "undefined") {
            selectedFolders.push(path);
          }
          return selectedFolders;
        }
      }, {
        kind: "method",
        key: "renderFolder",
        value: function renderFolder(branchFiles, folderFiles) {
          return html`
        <div class="file-list-folder">
            ${folderFiles.length > 0 ? folderFiles.map(item => {
          if (this.filteredPull !== "" && !item.pulls.includes(parseInt(this.filteredPull, 10))) {
            return html``;
          }
          return html`
                        <div>
                            <gr-file-item
                                .path="${item.path}"
                                .name="${item.name}"
                                .type="${item.type}"
                                .pull_count="${item.pulls.length}"
                                ?active="${this.selectedPath.indexOf(item.path) === 0}"
                                @click="${this._onItemClicked.bind(this, item.type, item.path, item.pulls)}"
                                @iconclick="${this._onItemIconClicked.bind(this, item.type, item.path, item.pulls)}"
                            ></gr-file-item>

                            ${this.selectedFolders.includes(item.path) ? this.renderFolder(branchFiles, branchFiles[item.path] || []) : null}
                        </div>
                    `;
        }) : html`
                    <span>This path is empty</span>
                `}
        </div>
      `;
        }
      }, {
        kind: "method",
        key: "render",
        value: function render() {
          const branchFiles = this.files[this.selectedBranch];
          const topLevel = branchFiles[""] || [];
          const branchesClassList = ["branch-selector"];
          if (this._branchSelectorActive) {
            branchesClassList.push("branch-selector--active");
          }
          return html`
            <div class="file-list">
              <gr-root-item
                .repository="${this.selectedRepository}"
                .branch="${this.selectedBranch}"
                @click="${this._onItemClicked.bind(this, "root", "", [])}"
                @iconclick="${this._onItemIconClicked.bind(this, "root", "", [])}"
                @branchclick="${this._onBranchClicked}"
              ></gr-root-item>

              ${this.renderFolder(branchFiles, topLevel)}
            </div>
            <div class="${branchesClassList.join(" ")}">
              <div>Available branches:</div>
              <ul>
                ${this.branches.map(item => {
          return html`
                    <li
                      @click="${this._onBranchSelected.bind(this, item)}"
                    >
                      ${item}
                    </li>
                  `;
        })}
              </ul>
            </div>
        `;
        }
      }]
    };
  }, LitElement);

  let PullRequestItem = _decorate([customElement('gr-pull-request')], function (_initialize, _LitElement) {
    class PullRequestItem extends _LitElement {
      constructor(...args) {
        super(...args);
        _initialize(this);
      }
    }
    return {
      F: PullRequestItem,
      d: [{
        kind: "get",
        static: true,
        key: "styles",
        value: function () {
          return css`
          /** Colors and variables **/
          :host {
            --pr-border-color: #fcfcfa;
            --star-font-color: #ffcc31;
            --ghost-font-color: #738b99;
          }

          @media (prefers-color-scheme: dark) {
            :host {
              --pr-border-color: #0d1117;
              --star-font-color: #e0c537;
              --ghost-font-color: #495d68;
            }
          }

          /** Component styling **/
          :host {
            border-bottom: 3px solid var(--pr-border-color);
            display: block;
            padding: 14px 12px 20px 12px;
          }

          :host .pr-container {
            display: grid;
            grid-template-columns: minmax(0, 1fr) max-content;
            grid-template-areas:
              "title title"
              "author updated"
              "details created";
            column-gap: 24px;
            row-gap: 8px;
            align-items: start;
          }

          :host a {
            color: var(--link-font-color);
            text-decoration: none;
          }
          :host a:hover {
            color: var(--link-font-color-hover);
          }

          :host .pr-title-block {
            grid-area: title;
            min-width: 0;
          }

          :host .pr-title {
            display: inline;
            font-size: 20px;
            margin-top: 6px;
            min-width: 0;
          }

          :host .pr-title-line {
            line-height: 1.35;
            margin-top: 6px;
            min-width: 0;
            word-break: break-word;
          }

          :host .pr-state {
            color: var(--light-font-color);
            font-family: monospace;
            font-size: 16px;
            font-weight: 700;
            margin-right: 8px;
          }

          :host .pr-title-id {
            margin-right: 4px;
          }

          :host .pr-title-name {
            color: var(--g-font-color);
          }

          :host .pr-open-age {
            color: var(--light-font-color);
            font-size: 13px;
            margin-left: 10px;
            white-space: nowrap;
          }

          :host .pr-container--draft .pr-title {
            filter: saturate(0.4);
          }
          :host .pr-container--draft .pr-title-name {
            opacity: 0.7;
          }
          :host .pr-container--draft .pr-state {
            opacity: 0.8;
          }

          :host .pr-meta {
            color: var(--dimmed-font-color);
            font-size: 13px;
          }

          :host .pr-author {
            grid-area: author;
          }

          :host .pr-details {
            grid-area: details;
            display: flex;
            flex-wrap: wrap;
            gap: 18px;
          }

          :host .pr-detail {
            white-space: nowrap;
          }

          :host .pr-detail--actions {
            color: var(--light-font-color);
          }

          :host .pr-detail-value {
            font-weight: 700;
          }

          :host .pr-time {
            color: var(--dimmed-font-color);
            font-size: 13px;
            text-align: right;
            white-space: nowrap;
          }
          :host .pr-time-value {
            border-bottom: 1px dashed var(--g-font-color);
            cursor: help;
            font-weight: 700;
          }

          :host .pr-author-value {
            font-weight: 700;
          }
          :host .pr-author-value--hot:before {
            content: "★";
            color: var(--star-font-color);
          }
          :host .pr-author-value--ghost {
            color: var(--ghost-font-color);
            font-weight: 600;
          }

          :host .pr-updated {
            grid-area: updated;
          }

          :host .pr-created {
            grid-area: created;
          }

          @media only screen and (max-width: 900px) {
            :host {
              padding: 14px 0 20px 0;
            }

            :host .pr-container {
              grid-template-columns: minmax(0, 1fr);
              grid-template-areas:
                "title"
                "author"
                "updated"
                "created"
                "details";
              row-gap: 10px;
            }

            :host .pr-updated,
            :host .pr-created {
              text-align: left;
            }

            :host .pr-open-age {
              display: inline-block;
              margin-left: 0;
              margin-top: 6px;
            }
          }
        `;
        }
      }, {
        kind: "field",
        decorators: [property({
          type: String
        })],
        key: "id",
        value() {
          return '';
        }
      }, {
        kind: "field",
        decorators: [property({
          type: String
        })],
        key: "title",
        value() {
          return '';
        }
      }, {
        kind: "field",
        decorators: [property({
          type: String,
          reflect: true
        })],
        key: "url",
        value() {
          return '';
        }
      }, {
        kind: "field",
        decorators: [property({
          type: String,
          reflect: true
        })],
        key: "diff_url",
        value() {
          return '';
        }
      }, {
        kind: "field",
        decorators: [property({
          type: String,
          reflect: true
        })],
        key: "patch_url",
        value() {
          return '';
        }
      }, {
        kind: "field",
        decorators: [property({
          type: Boolean
        })],
        key: "draft",
        value() {
          return false;
        }
      }, {
        kind: "field",
        decorators: [property({
          type: String,
          reflect: true
        })],
        key: "milestone",
        value() {
          return '';
        }
      }, {
        kind: "field",
        decorators: [property({
          type: String,
          reflect: true
        })],
        key: "branch",
        value() {
          return '';
        }
      }, {
        kind: "field",
        decorators: [property({
          type: String
        })],
        key: "created_at",
        value() {
          return '';
        }
      }, {
        kind: "field",
        decorators: [property({
          type: String
        })],
        key: "updated_at",
        value() {
          return '';
        }
      }, {
        kind: "field",
        decorators: [property({
          type: Object
        })],
        key: "author",
        value() {
          return null;
        }
      }, {
        kind: "field",
        decorators: [property({
          type: String
        })],
        key: "repository",
        value() {
          return '';
        }
      }, {
        kind: "method",
        key: "_formatOpenAge",
        value: function _formatOpenAge(timestamp) {
          const createdAt = new Date(timestamp);
          if (Number.isNaN(createdAt.getTime())) {
            return 'open';
          }
          const diffMs = Math.max(0, Date.now() - createdAt.getTime());
          const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
          if (diffDays < 14) {
            return `open ${Math.max(1, diffDays)}d`;
          }
          if (diffDays < 60) {
            return `open ${Math.floor(diffDays / 7)}wk`;
          }
          if (diffDays < 365) {
            return `open ${Math.floor(diffDays / 30)}mo`;
          }
          return `open ${Math.floor(diffDays / 365)}yr`;
        }
      }, {
        kind: "method",
        key: "render",
        value: function render() {
          const author = this.author || {
            id: '',
            user: 'ghost',
            pull_count: 0
          };
          const authorClassList = ["pr-author-value"];
          if (author.pull_count > 40) {
            authorClassList.push("pr-author-value--hot");
          }
          if (author.id === "") {
            authorClassList.push("pr-author-value--ghost");
          }
          const stateLabel = this.draft ? '[~]' : '[o]';
          const openAge = this._formatOpenAge(this.created_at);
          return html`
            <div class="pr-container ${this.draft ? "pr-container--draft" : ""}">
                <div class="pr-title-block">
                    <div class="pr-title-line">
                        <span class="pr-state" title="${this.draft ? 'Draft PR' : 'Open PR'}">${stateLabel}</span>
                        <a
                            class="pr-title"
                            href="${this.url}"
                            target="_blank"
                        >
                            <span class="pr-title-id">#${this.id}</span>
                            <span class="pr-title-name">${this.title}</span>
                        </a>
                        <span class="pr-open-age">${openAge}</span>
                    </div>
                </div>

                <div class="pr-author pr-meta">
                    <span>author: </span>
                    <a
                        class="${authorClassList.join(" ")}"
                        href="https://github.com/${this.repository}/pulls/${author.user}"
                        target="_blank"
                        title="Open ${author.pull_count} ${author.pull_count > 1 ? 'PRs' : 'PR'} by ${author.user}"
                    >
                        ${author.user}
                    </a>
                </div>

                <div class="pr-details pr-meta">
                    <div class="pr-detail">
                        <span>branch: </span>
                        <span class="pr-detail-value">
                            ${this.branch}
                        </span>
                    </div>
                    <div class="pr-detail">
                        <span>milestone: </span>
                        ${this.milestone != null ? html`
                            <a
                                href="${this.milestone.url}"
                                target="_blank"
                                class="pr-detail-value"
                            >
                                ${this.milestone.title}
                            </a>
                        ` : html`
                            <span class="pr-detail-value">none</span>
                        `}
                    </div>
                    <span class="pr-detail pr-detail--actions">
                        (
                        <a
                            href="${this.diff_url}"
                            target="_blank"
                        >
                            diff
                        </a> |
                        <a
                            href="${this.patch_url}"
                            target="_blank"
                        >
                            patch
                        </a>
                        )
                    </span>
                </div>

                <div class="pr-time pr-updated">
                    <span>updated: </span>
                    <span
                        class="pr-time-value"
                        title="${greports.format.formatTimestamp(this.updated_at)}"
                    >
                        ${greports.format.formatDate(this.updated_at)}
                    </span>
                </div>

                <div class="pr-time pr-created">
                    <span>created: </span>
                    <span
                        class="pr-time-value"
                        title="${greports.format.formatTimestamp(this.created_at)}"
                    >
                        ${greports.format.formatDate(this.created_at)}
                    </span>
                </div>
            </div>
        `;
        }
      }]
    };
  }, LitElement);

  let PullRequestList = _decorate([customElement('gr-pull-list')], function (_initialize, _LitElement) {
    class PullRequestList extends _LitElement {
      constructor(...args) {
        super(...args);
        _initialize(this);
      }
    }
    return {
      F: PullRequestList,
      d: [{
        kind: "get",
        static: true,
        key: "styles",
        value: function () {
          return css`
          /** Colors and variables **/
          :host {
            --pulls-background-color: #e5edf8;
            --pulls-toolbar-color: #9bbaed;
            --pulls-toolbar-accent-color: #5a6f90;
          }
          @media (prefers-color-scheme: dark) {
            :host {
              --pulls-background-color: #191d23;
              --pulls-toolbar-color: #222c3d;
              --pulls-toolbar-accent-color: #566783;
            }
          }

          /** Component styling **/
          :host {
            flex-grow: 1;
          }

          :host input[type=checkbox] {
            margin: 0;
            vertical-align: bottom;
          }

          :host select {
            background: var(--pulls-background-color);
            border: 1px solid var(--pulls-background-color);
            color: var(--g-font-color);
            font-size: 12px;
            outline: none;
            min-width: 60px;
          }

          :host .file-pulls {
            background-color: var(--pulls-background-color);
            border-radius: 0 4px 4px 0;
            padding: 8px 12px;
            max-width: 760px;
          }

          :host .file-pulls-toolbar {
            background: var(--pulls-toolbar-color);
            border-radius: 4px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            gap: 8px;
            padding: 10px 14px;
            margin-bottom: 6px;
          }

          :host .pulls-count {
            font-size: 15px;
          }
          :host .pulls-count strong {
            font-size: 18px;
          }
          :host .pulls-count-total {
            color: var(--dimmed-font-color);
          }

          :host .pulls-path {
            font-size: 15px;
          }
          :host .pulls-path strong {
            font-size: 16px;
            font-weight: 600;
            word-break: break-all;
          }

          @media only screen and (max-width: 900px) {
            :host .file-pulls {
              padding: 8px;
              max-width: 95%;
              margin: 0px auto;
            }

            :host .pulls-count {
              font-size: 17px;
              text-align: center;
              width: 100%;
            }
            :host .pulls-count strong {
              font-size: 20px;
            }

            :host .pulls-path {
              font-size: 17px;
              text-align: center;
              width: 100%;
            }
            :host .pulls-path strong {
              font-size: 18px;
            }
          }
        `;
        }
      }, {
        kind: "field",
        decorators: [property({
          type: Array
        })],
        key: "pulls",
        value() {
          return [];
        }
      }, {
        kind: "field",
        decorators: [property({
          type: Object
        })],
        key: "authors",
        value() {
          return {};
        }
      }, {
        kind: "field",
        decorators: [property({
          type: String
        })],
        key: "selectedRepository",
        value() {
          return "";
        }
      }, {
        kind: "field",
        decorators: [property({
          type: String
        })],
        key: "selectedBranch",
        value() {
          return "";
        }
      }, {
        kind: "field",
        decorators: [property({
          type: String
        })],
        key: "selectedPath",
        value() {
          return "";
        }
      }, {
        kind: "field",
        decorators: [property({
          type: Array
        })],
        key: "selectedPulls",
        value() {
          return [];
        }
      }, {
        kind: "field",
        decorators: [property({
          type: String
        })],
        key: "filteredPull",
        value() {
          return "";
        }
      }, {
        kind: "method",
        key: "render",
        value: function render() {
          if (this.selectedPath === "") {
            return html``;
          }
          let pulls = [].concat(this.pulls);
          pulls = pulls.filter(item => {
            if (item.target_branch !== this.selectedBranch) {
              return false;
            }
            if (!this.selectedPulls.includes(item.public_id)) {
              return false;
            }
            return true;
          });
          pulls.sort((a, b) => b.public_id - a.public_id);
          const total_pulls = this.pulls.length;
          let filtered_pulls = pulls.length;
          const has_pinned = this.filteredPull !== "";
          if (has_pinned) {
            filtered_pulls -= 1;
          }
          return html`
            <div class="file-pulls">
                ${pulls.map(item => {
          if (!has_pinned || parseInt(this.filteredPull, 10) !== item.public_id) {
            return html``;
          }
          let author = null;
          if (typeof this.authors[item.authored_by] != "undefined") {
            author = this.authors[item.authored_by];
          }
          return html`
                        <gr-pull-request
                            .id="${item.public_id}"
                            .title="${item.title}"
                            .url="${item.url}"
                            ?draft="${item.is_draft}"

                            .milestone="${item.milestone}"
                            .branch="${item.target_branch}"

                            .created_at="${item.created_at}"
                            .updated_at="${item.updated_at}"
                            .author="${author}"

                            .diff_url="${item.diff_url}"
                            .patch_url="${item.patch_url}"
                            .repository="${this.selectedRepository}"
                        />
                    `;
        })}

                <div class="file-pulls-toolbar">
                    <div class="pulls-path">
                      <span>Current path: </span>
                      <strong>./${this.selectedPath}</strong>
                    </div>
                    <div class="pulls-count">
                        <span>${has_pinned ? "Other " : ""}PRs affecting this path: </span>
                        <strong>${filtered_pulls}</strong>
                        ${filtered_pulls !== total_pulls ? html`
                            <span class="pulls-count-total"> (out of ${total_pulls})</span>
                        ` : ''}
                    </div>
                </div>

                ${pulls.map(item => {
          if (has_pinned && parseInt(this.filteredPull, 10) === item.public_id) {
            return html``;
          }
          let author = null;
          if (typeof this.authors[item.authored_by] != "undefined") {
            author = this.authors[item.authored_by];
          }
          return html`
                        <gr-pull-request
                            .id="${item.public_id}"
                            .title="${item.title}"
                            .url="${item.url}"
                            ?draft="${item.is_draft}"

                            .milestone="${item.milestone}"
                            .branch="${item.target_branch}"

                            .created_at="${item.created_at}"
                            .updated_at="${item.updated_at}"
                            .author="${author}"

                            .diff_url="${item.diff_url}"
                            .patch_url="${item.patch_url}"
                            .repository="${this.selectedRepository}"
                        />
                    `;
        })}
            </div>
        `;
        }
      }]
    };
  }, LitElement);

  let EntryComponent = _decorate([customElement('entry-component')], function (_initialize, _LitElement) {
    class EntryComponent extends _LitElement {
      constructor() {
        super();
        _initialize(this);
        this._entryRequested = false;
        this._isLoading = true;
        this._generatedAt = null;
        this._authors = {};
        this._branches = [];
        this._files = {};
        this._pulls = [];
        this._selectedRepository = greports.config.DEFAULT_REPOSITORY;
        this._selectedBranch = greports.config.DEFAULT_BRANCH;
        this._selectedPath = "";
        this._selectedPathPulls = [];
        this._filteredPull = "";
        this._filterAuthor = "";
        this._urlState = greports.util.getPageState();
        this._restoreUserPreferences();
        this._requestData();
      }
    }
    return {
      F: EntryComponent,
      d: [{
        kind: "get",
        static: true,
        key: "styles",
        value: function () {
          return css`
          /** Colors and variables **/
          :host {
          }
          @media (prefers-color-scheme: dark) {
            :host {
            }
          }

          /** Component styling **/
          :host {
          }

          :host .files {
            display: flex;
            padding: 24px 0;
          }

          @media only screen and (max-width: 900px) {
            :host .files {
              flex-wrap: wrap;
            }
          }
        `;
        }
      }, {
        kind: "method",
        key: "connectedCallback",
        value: function connectedCallback() {
          _superPropGet(EntryComponent, "connectedCallback", this, 3)([]);
          this._onPopState = this._handlePopState.bind(this);
          window.addEventListener("popstate", this._onPopState);
        }
      }, {
        kind: "method",
        key: "disconnectedCallback",
        value: function disconnectedCallback() {
          window.removeEventListener("popstate", this._onPopState);
          _superPropGet(EntryComponent, "disconnectedCallback", this, 3)([]);
        }
      }, {
        kind: "method",
        key: "performUpdate",
        value: function performUpdate() {
          this._requestData();
          _superPropGet(EntryComponent, "performUpdate", this, 3)([]);
        }
      }, {
        kind: "method",
        key: "_restoreUserPreferences",
        value: function _restoreUserPreferences() {
          const userPreferences = greports.util.getLocalPreferences();
          this._selectedRepository = this._urlState.repository || userPreferences["selectedRepository"];
          this._restoreSelectedBranch();
          if (this._urlState.branch !== "") {
            this._selectedBranch = this._urlState.branch;
          }
          this._selectedPath = this._urlState.path || "";
          this._filteredPull = this._urlState.pull || "";
          this._filterAuthor = this._urlState.author || "";
        }
      }, {
        kind: "method",
        key: "_restoreSelectedBranch",
        value: function _restoreSelectedBranch() {
          const userPreferences = greports.util.getLocalPreferences();
          if (typeof userPreferences["selectedBranches"][this._selectedRepository] !== "undefined") {
            this._selectedBranch = userPreferences["selectedBranches"][this._selectedRepository];
          } else {
            this._selectedBranch = "master";
          }
        }
      }, {
        kind: "method",
        key: "_saveUserPreferences",
        value: function _saveUserPreferences() {
          const storedPreferences = greports.util.getLocalPreferences();
          let selectedBranches = storedPreferences["selectedBranches"];
          selectedBranches[this._selectedRepository] = this._selectedBranch;
          const currentPreferences = {
            "selectedRepository": this._selectedRepository,
            "selectedBranches": selectedBranches
          };
          greports.util.setLocalPreferences(currentPreferences);
        }
      }, {
        kind: "method",
        key: "_requestData",
        value: async function _requestData() {
          if (this._entryRequested) {
            return;
          }
          this._entryRequested = true;
          this._isLoading = true;
          const requested_repo = this._urlState.repository;
          if (requested_repo !== "" && this._selectedRepository !== requested_repo) {
            this._selectedRepository = requested_repo;
            this._restoreSelectedBranch();
          }
          const data = await greports.api.getData(this._selectedRepository);
          if (data) {
            this._generatedAt = data.generated_at;
            this._authors = data.authors;
            this._pulls = data.pulls;
            data.branches.forEach(branch => {
              if (typeof data.files[branch] === "undefined") {
                return;
              }
              this._branches.push(branch);
              const branchFiles = {};
              data.files[branch].forEach(file => {
                if (file.type === "file" || file.type === "folder") {
                  if (typeof branchFiles[file.parent] === "undefined") {
                    branchFiles[file.parent] = [];
                  }
                  branchFiles[file.parent].push(file);
                }
              });
              for (let folderName in branchFiles) {
                branchFiles[folderName].sort((a, b) => {
                  if (a.type === "folder" && b.type !== "folder") {
                    return -1;
                  }
                  if (b.type === "folder" && a.type !== "folder") {
                    return 1;
                  }
                  const a_name = a.path.toLowerCase();
                  const b_name = b.path.toLowerCase();
                  if (a_name > b_name) return 1;
                  if (a_name < b_name) return -1;
                  return 0;
                });
              }
              this._files[branch] = branchFiles;
            });

            // If our preferred branch doesn't exist, pick master.
            if (typeof this._files[this._selectedBranch] === "undefined") {
              this._selectedBranch = "master";
            }
            // If master doesn't exist, pick the first available.
            if (typeof this._files[this._selectedBranch] === "undefined" && data.branches.length > 0) {
              this._selectedBranch = data.branches[0];
            }
            this._restoreSelectedPathPulls();
            this._syncUrlState(true);
          } else {
            this._generatedAt = null;
            this._authors = {};
            this._branches = [];
            this._files = {};
            this._pulls = [];
            this._selectedBranch = "master";
            this._selectedPath = "";
            this._selectedPathPulls = [];
            this._syncUrlState(true);
          }
          this._isLoading = false;
          this.requestUpdate();
        }
      }, {
        kind: "method",
        key: "_restoreSelectedPathPulls",
        value: function _restoreSelectedPathPulls() {
          if (this._selectedPath === "") {
            this._selectedPathPulls = [];
            return;
          }
          const branchFiles = this._files[this._selectedBranch] || {};
          const topLevel = branchFiles[""] || [];
          const selectedEntry = this._findFileEntry(branchFiles, topLevel, this._selectedPath);
          if (!selectedEntry) {
            this._selectedPath = "";
            this._selectedPathPulls = [];
            return;
          }
          this._selectedPathPulls = selectedEntry.pulls || [];
          if (this._filteredPull !== "") {
            const pullNumber = parseInt(this._filteredPull, 10);
            if (!this._selectedPathPulls.includes(pullNumber)) {
              this._selectedPath = "";
              this._selectedPathPulls = [];
            }
          }
        }
      }, {
        kind: "method",
        key: "_findFileEntry",
        value: function _findFileEntry(branchFiles, entries, targetPath) {
          for (const item of entries) {
            if (item.path === targetPath) {
              return item;
            }
            if (item.type === "folder") {
              const childEntry = this._findFileEntry(branchFiles, branchFiles[item.path] || [], targetPath);
              if (childEntry) {
                return childEntry;
              }
            }
          }
          return null;
        }
      }, {
        kind: "method",
        key: "_syncUrlState",
        value: function _syncUrlState(replace = false) {
          const generatedAt = this._generatedAt ? greports.format.formatDate(this._generatedAt) : "";
          greports.util.setPageState({
            repository: this._selectedRepository,
            branch: this._selectedBranch,
            path: this._selectedPath,
            pull: this._filteredPull,
            author: this._filterAuthor,
            generatedAt: generatedAt
          }, replace);
        }
      }, {
        kind: "method",
        key: "_handlePopState",
        value: function _handlePopState() {
          this._urlState = greports.util.getPageState();
          if (this._urlState.repository !== "" && this._urlState.repository !== this._selectedRepository) {
            window.location.reload();
            return;
          }
          this._restoreUserPreferences();
          this._restoreSelectedPathPulls();
          this.requestUpdate();
        }
      }, {
        kind: "method",
        key: "_onPullFilterChanged",
        value: function _onPullFilterChanged(event) {
          this._filteredPull = event.detail.pull;
          if (this._filteredPull !== "") {
            const pullNumber = parseInt(this._filteredPull, 10);
            if (!this._selectedPathPulls.includes(pullNumber)) {
              this._selectedPath = "";
              this._selectedPathPulls = [];
            }
          }
          this._syncUrlState();
          this.requestUpdate();
        }
      }, {
        kind: "method",
        key: "_onBranchSelected",
        value: function _onBranchSelected(event) {
          if (this._selectedBranch === event.detail.branch) {
            return;
          }
          this._selectedBranch = event.detail.branch;
          this._selectedPath = "";
          this._selectedPathPulls = [];
          this._saveUserPreferences();
          this._syncUrlState();
          this.requestUpdate();
        }
      }, {
        kind: "method",
        key: "_onPathClicked",
        value: function _onPathClicked(event) {
          this._selectedPath = event.detail.path;
          this._selectedPathPulls = event.detail.pulls;
          this._syncUrlState();
          this.requestUpdate();
          window.scrollTo(0, 0);
        }
      }, {
        kind: "method",
        key: "render",
        value: function render() {
          return html`
            <page-content>
                <shared-nav></shared-nav>
                <gr-index-entry .generated_at="${this._generatedAt}"></gr-index-entry>
                <gr-index-description></gr-index-description>

                ${this._isLoading ? html`
                    <h3>Loading...</h3>
                ` : html`
                    <gr-pull-filter
                        .value="${this._filteredPull}"
                        @filterchanged="${this._onPullFilterChanged}"
                    ></gr-pull-filter>

                    <div class="files">
                        <gr-file-list
                            .branches="${this._branches}"
                            .files="${this._files}"
                            .selectedRepository="${this._selectedRepository}"
                            .selectedBranch="${this._selectedBranch}"
                            .selectedPath="${this._selectedPath}"
                            .filteredPull="${this._filteredPull}"
                            @branchselect="${this._onBranchSelected}"
                            @pathclick="${this._onPathClicked}"
                        ></gr-file-list>

                        <gr-pull-list
                            .pulls="${this._pulls}"
                            .authors="${this._authors}"
                            .selectedRepository="${this._selectedRepository}"
                            .selectedBranch="${this._selectedBranch}"
                            .selectedPath="${this._selectedPath}"
                            .selectedPulls="${this._selectedPathPulls}"
                            .filteredPull="${this._filteredPull}"
                        ></gr-pull-list>
                    </div>
                `}
            </page-content>
        `;
        }
      }]
    };
  }, LitElement);

  return EntryComponent;

}());
