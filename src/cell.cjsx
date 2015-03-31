React = require 'react'
cn = require 'classnames'

useSheet = require 'react-jss'
{ CellStyle } = require './styles'


module.exports = React.createClass
  displayName: 'Cell'

  render: ->
    classes = cn @sheet.classes.cell,
      @props.level,
      @props.type,
      { selected: @props.selected },
      { today: @props.today }

    <div
      className={classes}
      onClick={=> @props.onClick @props.moment if @props.moment}
    >
      {@props.label}
    </div>

  mixins: [
    useSheet(CellStyle)
  ]

  propTypes:
    label: React.PropTypes.string
    level: React.PropTypes.string
    type: React.PropTypes.string
    selected: React.PropTypes.bool
    today: React.PropTypes.bool
    onClick: React.PropTypes.func
    classes: React.PropTypes.object
