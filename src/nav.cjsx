React = require 'react'

createStyledComponent = require './styled-component'
getStyle = require './styles'


Navigation = React.createClass
  displayName: 'Navigation'

  propTypes:
    onPrev: React.PropTypes.func
    onNext: React.PropTypes.func
    onTitle: React.PropTypes.func
    title: React.PropTypes.string

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

module.exports = createStyledComponent Navigation,
  (props, id) -> getStyle 'navigation', props, id
