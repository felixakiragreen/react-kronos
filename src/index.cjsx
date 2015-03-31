React = require 'react'
moment = require 'moment-range'

{ Units } = require './constants'

Calendar = require './calendar'
Utils = require './utils'

jss = require 'jss'
jss.use require 'jss-nested'
jss.use require 'jss-camel-case'
jss.use require 'jss-vendor-prefixer'
jss.use require 'jss-px'

useSheet = require 'react-jss'
{ IndexStyle } = require './styles'


module.exports = React.createClass
  displayName: 'Kronos'

  render: ->
    <div className={@sheet.classes.kronos}>
      <input
        type='text'
        ref='input'
        value={@state.input}
        onClick={=> @toggle true}
        onFocus={=> @toggle true}
        onBlur={@onBlur}
        onKeyDown={(e) => @onKeyDown e.keyCode}
        onChange={@onChange}
        placeholder={@props.placeholder}
        className={@sheet.classes.input}
      />
      { @state.visible and
        <Calendar
          datetime={@state.datetime or do moment}
          onSelect={@onSelect}
          above={(bool) => @above = bool}
          level={@state.level}
          setLevel={(level) => @setState level: level}
        />
      }
    </div>

  # genius
  # level={(level) => if level then @setState level: level else @state.level}

  getInitialState: ->
    datetime: @getDateTimeInput().datetime
    input: @getDateTimeInput().input
    visible: false
    level: do @getDefaultLevel

  getDateTimeInput: (props) ->
      props ?= @props
      prop = props.date or props.time or null
      datetime = @parse prop

      datetime: datetime
      input: datetime.format(do @format) or null

  getDefaultLevel: ->
    if @props.date
      Units.DAY
    else if @props.time
      Units.HOUR
    else
      null

  format: ->
    if @props.format
      @props.format
    else if @props.date
      'MM-DD-YYYY'
    else if @props.time
      'h:mm a'
    else
      null

  mixins: [
    Utils
    useSheet(IndexStyle)
  ]

  propTypes:
    date: React.PropTypes.any
    time: React.PropTypes.any
    min: React.PropTypes.any
    max: React.PropTypes.any

    format: React.PropTypes.string
    onChange: React.PropTypes.func
    returnAs: React.PropTypes.oneOf [
      'jsdate'
      'moment'
      'iso'
      'string'
    ]
    close: React.PropTypes.bool
    placeholder: React.PropTypes.string

    styles: React.PropTypes.object
    options: React.PropTypes.object

  getDefaultProps: ->
    close: true
    returnAs: 'iso'

  componentDidMount: ->
    moment.locale 'en',
      week: dow: 1
      weekdaysMin: ['M', 'T', 'W', 'T', 'F', 'S', 'S']

  componentWillReceiveProps: (nextProps) ->
    @setState
      datetime: @getDateTimeInput(nextProps).datetime
      input: @getDateTimeInput(nextProps).input
