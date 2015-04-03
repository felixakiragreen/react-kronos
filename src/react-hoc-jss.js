'use strict'

import jss from 'jss'


export default function getPropsAndAttach(Component, Rules, Options) {

  function attach(rules, options) {
    var sheet = jss.createStyleSheet(rules, options).attach()
    return sheet
  }

  var StyledComponent = {

    componentWillMount() {
      var rules
        = typeof Rules === 'function'
        ? Rules(this.props)
        : Rules

      var options
        = typeof Options === 'function'
        ? Options(this.props)
        : Options

      this.sheet = attach(rules, options)
    },

    componentWillUnmount() {
      this.sheet.detach()
      this.sheet = null
    },

    classSet: function (classNames) {
      var sheet = this.sheet

      return Object
        .keys(classNames)
        .filter(function (className) {
          return classNames[className]
        })
        .map(function (className) {
          return sheet.classes[className] || className
        })
        .join(' ')
    },

    render() {
      return (
        <Component
          {...this.props}
          classes={this.sheet.classes}
          classSet={this.classSet}
        />
      )
    }

  }

  // Support React Hot Loader
  if (module.hot) {
    StyledComponent.componentWillReceiveProps = function(nextProps) {
      if (this.props !== nextProps) {
        var rules
          = typeof Rules === 'function'
          ? Rules(nextProps)
          : Rules
        var options
          = typeof Options === 'function'
          ? Options(nextProps)
          : Options

        this.sheet.detach()
        this.sheet = attach(rules, options)
      }
    }
  }

  return React.createClass(StyledComponent)
}
