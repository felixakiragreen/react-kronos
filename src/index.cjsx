React = require 'react'
Moment = require 'moment-range'
cn = require 'classnames'

jss = require 'jss'
jss.use require 'jss-nested'
jss.use require 'jss-camel-case'
jss.use require 'jss-vendor-prefixer'
jss.use require 'jss-px'

{ Keys, Levels, Units, Types } = require './constants'
Calendar = require './calendar'
createStyledComponent = require './styled-component'
getStyle = require './styles'


Kronos = React.createClass
  displayName: 'Kronos'

  above: false

  propTypes:
    date: React.PropTypes.any
    time: React.PropTypes.any
    min: React.PropTypes.any
    max: React.PropTypes.any
    shouldTriggerOnChangeForDateTimeOutsideRange: React.PropTypes.bool
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
    shouldTriggerOnChangeForDateTimeOutsideRange: false

  componentWillReceiveProps: (nextProps) ->
    if @props isnt nextProps
      @validate @getDateTimeInput(nextProps).datetime, null, true
      @setState
        datetime: @getDateTimeInput(nextProps).datetime
        input: @getDateTimeInput(nextProps).input

  getInitialState: ->
    datetime: @getDateTimeInput().datetime
    input: @getDateTimeInput().input
    type: @getDateTimeInput().type
    visible: false
    level: do @getDefaultLevel

  getDateTimeInput: (props) ->
    props ?= @props
    prop = props.date or props.time or null
    if prop is null
      datetime = do Moment
      input = null
      type = Types.MOMENT
    else
      datetime = @parse prop
      input = datetime.format(@format props)
      isoRegex = /((\d{4}\-\d\d\-\d\d)[tT]([\d:\.]*)?)([zZ]|([+\-])(\d\d):?(\d\d))/
      type = switch typeof prop
        when 'object'
          if Moment.isDate prop
            Types.JS_DATE
          else if Moment.isMoment prop
            Types.MOMENT
          else
            null
        when 'string'
          if prop.match isoRegex
            Types.ISO
          else
            Types.STRING

    datetime: datetime
    input: input
    type: type

  getDefaultLevel: ->
    if typeof @props.date isnt 'undefined'
      Units.DAY
    else if typeof @props.time isnt 'undefined'
      Units.HOUR
    else
      console.warn 'Please set a date or time prop. It can be null but not undefined.'
      Units.DAY

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
    if input is null then return null
    parsing = Moment input, do @format, true
    if not do parsing.isValid
      test = new Date input
      if isNaN do test.getTime
        test = if @state?.datetime then @state.datetime else do Moment
      parsing = Moment test

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

    if @validate saving, null, true then @commit saving

  validate: (datetime, timeUnit, isSaving) ->
    outsideRange = false

    if @props.min and Moment(datetime).isBefore @props.min
      outsideRange = true
    if @props.max and Moment(datetime).isAfter @props.max
      outsideRange = true

    if outsideRange and timeUnit isnt 'hours'
      if Moment(datetime).isSame(@props.min, timeUnit) or Moment(datetime).isSame(@props.max, timeUnit)
        outsideRange = false

    if isSaving
      @setState dateTimeExceedsValidRange: outsideRange
      if @props.shouldTriggerOnChangeForDateTimeOutsideRange then return true

    return !outsideRange

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
    datetime = Moment input, do @format, true
    if do datetime.isValid
      @save datetime
    else if input is ''
      @setState
        datetime: null
        input: ''
      @props.onChange? null
    else
      @setState input: input

  onSelect: (datetime, close) ->
    close or= close
    if !@validate datetime then close = false
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
      if datetime then @save datetime

  onKeyDown: (code) ->
    datetime = @state.datetime or do Moment
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

  render: ->
    mainClasses = cn 'react-kronos',
      @props.id,
      @props.classes.kronos
    inputClasses = cn @props.classes.input,
      { 'outside-range': @state.dateTimeExceedsValidRange }

    <div className={mainClasses}>
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
        className={inputClasses}
      />
      { @state.visible and
        <Calendar
          id={@props.id}
          datetime={@state.datetime}
          onSelect={@onSelect}
          above={(bool) => @above = bool}
          level={@state.level}
          setLevel={(level) => @setState level: level}
          validate={@validate}
        />
      }
    </div>

module.exports = createStyledComponent Kronos,
  (props, id) -> getStyle 'index', props, id
