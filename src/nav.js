import React, { Component } from 'react'
import PropTypes from 'prop-types'

import createStyledComponent from './styled-component'
import getStyle from './styles'


class Navigation extends Component {

  static propTypes = {
    onPrev: PropTypes.func,
    onNext: PropTypes.func,
    onTitle: PropTypes.func,
    title: PropTypes.string,
  }

  render() {
    return (
      <div className={this.props.classes.nav}>
        <div className='arrow' onClick={this.props.onPrev}>
          «
        </div>
        <div className='title' onClick={this.props.onTitle}>
          {this.props.title}
        </div>
        <div className='arrow' onClick={this.props.onNext}>
          »
        </div>
      </div>
    )
  }
}

export default createStyledComponent(Navigation,
  (props, id) => getStyle('navigation', props, id)
)
