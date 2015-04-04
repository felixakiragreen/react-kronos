'use strict'

React = require 'react'
moment = require 'moment-range'

jss = require 'jss'
jss.use require 'jss-nested'
jss.use require 'jss-camel-case'
jss.use require 'jss-vendor-prefixer'
jss.use require 'jss-px'

{ Keys, Levels, Units, Types } = require './constants'
Calendar = require './calendar'
getPropsAndAttach = require './react-hoc-jss'
getStyle = require './styles'


Kronos = React.createClass
  displayName: 'Kronos'

  render: ->
    <div className={@props.classes.kronos}>
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
        className={@props.classes.input}
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

  getInitialState: ->
    datetime: @getDateTimeInput().datetime
    input: @getDateTimeInput().input
    type: @getDateTimeInput().type
    visible: false
    level: do @getDefaultLevel

  getDateTimeInput: (props) ->
      props ?= @props
      prop = props.date or props.time or null
      datetime = @parse prop
      isoRegex = /((\d{4}\-\d\d\-\d\d)[tT]([\d:\.]*)?)([zZ]|([+\-])(\d\d):?(\d\d))/
      type = switch typeof prop
        when 'object'
          if moment.isDate prop
            Types.JS_DATE
          else if moment.isMoment prop
            Types.MOMENT
          else
            null
        when 'string'
          if prop.match isoRegex
            Types.ISO
          else
            Types.STRING

      datetime: datetime
      input: datetime.format(@format props) or null
      type: type

  getDefaultLevel: ->
    if @props.date
      Units.DAY
    else if @props.time
      Units.HOUR
    else
      null

  format: (props) ->
    props ?= @props
    if props.format
      props.format
    else if props.date
      'MM-DD-YYYY'
    else if props.time
      'h:mm a'
    else
      null

  toggle: (visible) ->
    visible ?= not @state.visible
    @setState visible: visible unless visible is @state.visible

  parse: (input) ->
    parsing = moment input, do @format, true
    if not do parsing.isValid
      test = new Date input
      if isNaN do test.getTime
        test = if @state?.datetime then @state.datetime else do moment
      parsing = moment test

    parsing

  save: (saving) ->
    { datetime } = @state
    if @props.date
      saving.hours do datetime.hours
      saving.minutes do datetime.minutes
    if @props.time
      saving.date do datetime.date
      saving.month do datetime.month
      saving.year do datetime.year
    @setState
      datetime: saving
      input: saving.format do @format

    @commit saving

  commit: (datetime) ->
    returnAs = @props.returnAs or @state.type
    result = switch returnAs
      when Types.ISO then do datetime.toISOString
      when Types.JS_DATE then do datetime.toDate
      when Types.MOMENT then datetime
      when Types.STRING then datetime.format do @format

    @props.onChange? result

  onChange: (e) ->
    input = e.target.value
    datetime = moment input, do @format, true
    if do datetime.isValid
      @save datetime
    else
      @setState input: input

  onSelect: (datetime, close) ->
    @setState
      visible: if @props.closeOnSelect and close then !@state.visible else @state.visible
    @save datetime

  onBlur: ->
    if @above
      do React.findDOMNode @refs.input
        .focus
    else
      @toggle false if @props.closeOnBlur

    if @state.input is @state.datetime.format do @format
      return
    else
      datetime = @parse @state.input
      @save datetime

  onKeyDown: (code) ->
    datetime = @state.datetime or do moment
    lvl = Levels[@state.level]

    switch code
      when Keys.UP
        @onSelect datetime.subtract lvl.key.span, lvl.key.unit
      when Keys.DOWN
        @onSelect datetime.add lvl.key.span, lvl.key.unit
      when Keys.ENTER
        if lvl.down
          @setState level: lvl.down
        else
          if @state.input is datetime.format do @format
            do @toggle
          else
            @toggle true unless @state.visible
            datetime = @parse @state.input
            @save datetime

  above: false

  propTypes:
    date: React.PropTypes.any
    time: React.PropTypes.any
    # min: React.PropTypes.any
    # max: React.PropTypes.any
    format: React.PropTypes.string
    onChange: React.PropTypes.func
    returnAs: React.PropTypes.oneOf [
      Types.ISO
      Types.JS_DATE
      Types.MOMENT
      Types.STRING
    ]
    closeOnSelect: React.PropTypes.bool
    closeOnBlur: React.PropTypes.bool
    placeholder: React.PropTypes.string
    options: React.PropTypes.object
    # styles: React.PropTypes.object

  getDefaultProps: ->
    closeOnSelect: true
    closeOnBlur: true

  componentWillReceiveProps: (nextProps) ->
    if @props isnt nextProps
      @setState
        datetime: @getDateTimeInput(nextProps).datetime
        input: @getDateTimeInput(nextProps).input


module.exports = getPropsAndAttach Kronos, (props) -> getStyle 'index', props
