React = require 'react'

useSheet = require 'react-jss'
{ NavStyle } = require './styles'


module.exports = React.createClass
  displayName: 'Navigation'

  render: ->
    <div className={@sheet.classes.nav}>
      <div className='arrow' onClick={@props.onPrev}>
        «
      </div>
      <div className='title' onClick={@props.onTitle}>
        {@props.title}
      </div>
      <div className='arrow' onClick={@props.onNext}>
        »
      </div>
    </div>

  mixins: [
    useSheet(NavStyle)
  ]

  propTypes:
    onPrev: React.PropTypes.func
    onNext: React.PropTypes.func
    onTitle: React.PropTypes.func
    title: React.PropTypes.string
