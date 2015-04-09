'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = createStyledComponent;

var _React = require('react');

var _React2 = _interopRequireWildcard(_React);

var _jss = require('jss');

var _jss2 = _interopRequireWildcard(_jss);

function createStyledComponent(Component, rules, options) {

  function attach(rules, options) {
    return _jss2['default'].createStyleSheet(rules, options).attach();
  }

  function makeUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0;
      var v = c === 'x' ? r : r & 3 | 8;
      return v.toString(16);
    });
  }

  var StyledComponent = (function (_React$Component) {
    function StyledComponent() {
      _classCallCheck(this, StyledComponent);

      if (_React$Component != null) {
        _React$Component.apply(this, arguments);
      }
    }

    _inherits(StyledComponent, _React$Component);

    _createClass(StyledComponent, [{
      key: 'componentWillMount',
      value: function componentWillMount() {
        var uuid = this.props.id ? this.props.id : makeUUID();
        var _rules = typeof rules === 'function' ? rules(this.props, uuid) : rules;
        var _options = typeof options === 'function' ? options(this.props, uuid) : options;

        this.sheet = attach(_rules, _options);
        this.uuid = uuid;
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        this.sheet.detach();
        this.sheet = null;
      }
    }, {
      key: 'classSet',
      value: function classSet(classNames) {
        return Object.keys(classNames).filter(function (className) {
          return classNames[className];
        }).map(function (className) {
          return this.sheet.classes[className] || className;
        }).join(' ');
      }
    }, {
      key: 'render',
      value: function render() {
        return _React2['default'].createElement(Component, _extends({
          id: this.uuid,
          classes: this.sheet.classes,
          classSet: this.classSet
        }, this.props));
      }
    }]);

    return StyledComponent;
  })(_React2['default'].Component);

  // Support React Hot Loader
  if (module.hot) {
    var _ret = (function () {
      var HotStyledComponent = (function (_StyledComponent) {
        function HotStyledComponent() {
          _classCallCheck(this, HotStyledComponent);

          if (_StyledComponent != null) {
            _StyledComponent.apply(this, arguments);
          }
        }

        _inherits(HotStyledComponent, _StyledComponent);

        _createClass(HotStyledComponent, [{
          key: 'componentWillReceiveProps',
          value: function componentWillReceiveProps(nextProps) {
            if (this.props !== nextProps) {
              var _rules = typeof rules === 'function' ? rules(nextProps, this.uuid) : rules;
              var _options = typeof options === 'function' ? options(nextProps, this.uuid) : options;

              this.sheet.detach();
              this.sheet = attach(_rules, _options);
            }
          }
        }]);

        return HotStyledComponent;
      })(StyledComponent);

      return {
        v: HotStyledComponent
      };
    })();

    if (typeof _ret === 'object') {
      return _ret.v;
    }
  }

  return StyledComponent;
}

module.exports = exports['default'];