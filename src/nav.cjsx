'use strict'

React = require 'react'

getPropsAndAttach = require './react-hoc-jss'
getStyle = require './styles'


Navigation = React.createClass
  displayName: 'Navigation'

  render: ->
    <div className={@props.classes.nav}>
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

  propTypes:
    onPrev: React.PropTypes.func
    onNext: React.PropTypes.func
    onTitle: React.PropTypes.func
    title: React.PropTypes.string


module.exports = getPropsAndAttach Navigation, (props) -> getStyle 'navigation'
