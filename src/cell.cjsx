React = require 'react'
cn = require 'classnames'


module.exports = React.createClass
  displayName: 'Cell'

  propTypes:
    label: React.PropTypes.string
    level: React.PropTypes.string
    type: React.PropTypes.string
    selected: React.PropTypes.bool
    today: React.PropTypes.bool
    onClick: React.PropTypes.func
    classes: React.PropTypes.object

  render: ->
    classes = cn @props.classes.cell,
      @props.level,
      @props.type,
      { selected: @props.selected },
      { today: @props.today },
      { 'outside-range': not @props.invalid }

    <div
      className={classes}
      onClick={=> @props.onClick @props.moment}
    >
      {@props.label}
    </div>
