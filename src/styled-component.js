import React from 'react'
import jss from 'jss'

export default function createStyledComponent(Component, rules, options) {
  function attach(rules, options) {
    return jss.createStyleSheet(rules, options).attach()
  }

  function makeUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      let r = (Math.random() * 16) | 0
      let v = c === 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  }

  class StyledComponent extends React.Component {
    componentWillMount() {
      let uuid = this.props.instance ? this.props.instance : makeUUID()
      let _rules = typeof rules === 'function' ? rules(this.props, uuid) : rules
      let _options = typeof options === 'function'
        ? options(this.props, uuid)
        : options

      this.sheet = attach(_rules, _options)
      this.uuid = uuid
    }

    componentWillUnmount() {
      this.sheet.detach()
      this.sheet = null
    }

    classSet(classNames) {
      return Object.keys(classNames)
        .filter(function(className) {
          return classNames[className]
        })
        .map(function(className) {
          return this.sheet.classes[className] || className
        })
        .join(' ')
    }

    render() {
      return (
        <Component
          instance={this.uuid}
          ref={'kronos'}
          classes={this.sheet.classes}
          classSet={this.classSet}
          {...this.props}
        />
      )
    }
  }

  // Support React Hot Loader
  if (module.hot) {
    class HotStyledComponent extends StyledComponent {
      componentWillReceiveProps(nextProps) {
        if (this.props !== nextProps) {
          let _rules = typeof rules === 'function'
            ? rules(nextProps, this.uuid)
            : rules
          let _options = typeof options === 'function'
            ? options(nextProps, this.uuid)
            : options

          this.sheet.detach()
          this.sheet = attach(_rules, _options)
        }
      }
    }

    return HotStyledComponent
  }

  return StyledComponent
}
