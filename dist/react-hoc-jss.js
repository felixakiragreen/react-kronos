'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = getPropsAndAttach;

var _React = require('react');

var _React2 = _interopRequireWildcard(_React);

var _jss = require('jss');

var _jss2 = _interopRequireWildcard(_jss);

'use strict';

function getPropsAndAttach(Component, Rules, Options) {

  function attach(rules, options) {
    var sheet = _jss2['default'].createStyleSheet(rules, options).attach();
    return sheet;
  }

  var StyledComponent = {

    componentWillMount: function componentWillMount() {
      var rules = typeof Rules === 'function' ? Rules(this.props) : Rules;

      var options = typeof Options === 'function' ? Options(this.props) : Options;

      this.sheet = attach(rules, options);
    },

    componentWillUnmount: function componentWillUnmount() {
      this.sheet.detach();
      this.sheet = null;
    },

    classSet: function classSet(classNames) {
      var sheet = this.sheet;

      return Object.keys(classNames).filter(function (className) {
        return classNames[className];
      }).map(function (className) {
        return sheet.classes[className] || className;
      }).join(' ');
    },

    render: function render() {
      return _React2['default'].createElement(Component, _extends({}, this.props, {
        classes: this.sheet.classes,
        classSet: this.classSet
      }));
    }

  };

  // Support React Hot Loader
  if (module.hot) {
    StyledComponent.componentWillReceiveProps = function (nextProps) {
      if (this.props !== nextProps) {
        var rules = typeof Rules === 'function' ? Rules(nextProps) : Rules;
        var options = typeof Options === 'function' ? Options(nextProps) : Options;

        this.sheet.detach();
        this.sheet = attach(rules, options);
      }
    };
  }

  return _React2['default'].createClass(StyledComponent);
}

module.exports = exports['default'];