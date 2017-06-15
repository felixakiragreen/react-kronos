import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

export default class Cell extends Component {
  static propTypes = {
    label: PropTypes.string,
    level: PropTypes.string,
    type: PropTypes.string,
    selected: PropTypes.bool,
    today: PropTypes.bool,
    onClick: PropTypes.func,
    classes: PropTypes.object,
  }

  render() {
    const classes = cn(
      this.props.classes.cell,
      this.props.level,
      this.props.type,
      { selected: this.props.selected },
      { today: this.props.today },
      { 'outside-range': !this.props.invalid },
    )

    return (
      <div
        className={classes}
        onClick={() => this.props.onClick(this.props.moment)}
      >
        {this.props.label}
      </div>
    )
  }
}
