_ = require 'lodash'
color = require 'color'
moment = require 'moment-range'

_options = {}

setOptions = (options, uuid) ->
  if options?.moment
    moment.locale options.moment.lang, options.moment.settings
  else
    moment.locale 'en',
      week: dow: 1
      weekdaysMin: ['M', 'T', 'W', 'T', 'F', 'S', 'S']

  _options[uuid] = _.omit options, 'moment'

getStyle = (page, props, uuid) ->

  setOptions props.options, uuid

  defaultOptions =
    color: '#1e7e9e'
    corners: 4
    font: 'Source Sans Pro'

  options = _.assign defaultOptions, _options[uuid]

  style = switch page
    when 'index' then index options
    when 'calendar' then calendar options
    when 'navigation' then navigation options
    when 'cell' then cell options

  style

module.exports = getStyle

# Styles for each page

index = (options) ->
  kronos:
    position: 'relative'
    display: 'flex'
    color: 'hsl(0, 0%, 50%)'
    '& *':
      fontFamily: options.font
      margin: 0
      padding: 0
      boxSizing: 'border-box'
      userSelect: 'none'

  input:
    border: '1px solid transparent'
    borderRadius: options.corners
    fontSize: 16
    padding: '3px 6px'
    background: 'white'
    '&:focus':
      outline: 'none'
      borderColor: options.color

calendar = (options) ->
  calendar:
    position: 'absolute'
    top: '100%'
    left: 0
    padding: 6
    background: 'white'
    border: '1px solid hsla(0, 0%, 0%, 0.15)'
    borderRadius: options.corners
    boxShadow: '0 0 7px 5px hsla(0, 0%, 0%, 0.05)'
    textAlign: 'center'
    zIndex: 2

  grid:
    width: 182
    '&.hours':
      height: 200
      width: 96 + options.corners * 2
      overflow: 'auto'
      paddingRight: 6
    '&::-webkit-scrollbar':
      width: if options.corners <= 2 then 4 else options.corners * 2
    '&::-webkit-scrollbar-track':
      background: do color(options.color).alpha(0.05).rgbString
      boxShadow: 'inset 0 0 3px rgba(0, 0, 0, 0.15)'
      borderRadius: options.corners
    '&::-webkit-scrollbar-thumb':
      borderRadius: options.corners
      background: options.color
      boxShadow: 'inset 0 0 3px rgba(0, 0, 0, 0.3)'

  today:
    display: 'flex'
    justifyContent: 'center'
    alignItems: 'center'
    height: 30
    cursor: 'pointer'
    border: '1px solid transparent'
    borderRadius: options.corners
    marginTop: 3
    '&:hover':
      borderColor:
        do color options.color
          .alpha 0.5
          .rgbString
      color: options.color

  cell:
    display: 'inline-flex'
    alignItems: 'center'
    justifyContent: 'center'
    border: '1px solid transparent'
    borderRadius: options.corners
    fontSize: 15
    cursor: 'pointer'
    '&:not(.selected):not(.header):hover':
      backgroundColor:
        do color options.color
          .alpha 0.2
          .rgbString
      '&:not(.today)':
        color: 'hsl(0, 0%, 25%)'
    '&.years':
      width: 58
      height: 38
    '&.months':
      width: 58
      height: 38
    '&.days':
      width: 26
      height: 26
    '&.hours':
      display: 'flex'
      lineHeight: 1.5

    '&.header':
      cursor: 'default'
      color:
        do color options.color
          .alpha 0.4
          .rgbString
      fontWeight: 700
    '&.past':
      opacity: 0.4
    '&.future':
      opacity: 0.4

    '&.today':
      fontWeight: 700
      border: '1px solid'
      borderColor:
        do color options.color
          .alpha 0.75
          .rgbString
      color: options.color

    '&.selected':
      backgroundColor: options.color
      color: 'white'


navigation = (options) ->
  nav:
    display: 'flex'
    cursor: 'pointer'
    lineHeight: '32px'

    '& > div':
      border: '1px solid'
      borderColor: 'transparent'
      borderRadius: options.corners
      '&:hover':
        borderColor:
          do color options.color
            .alpha 0.5
            .rgbString
        color: options.color
      '&.arrow':
        flex: 1
        fontSize: 24
      '&.title':
        flex: 2
