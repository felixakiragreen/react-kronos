color = require 'color'
{ Colors } = require './constants'

module.exports =

  IndexStyle:
    kronos:
      position: 'relative'
      display: 'flex'
      color: 'hsl(0, 0%, 50%)'
      '& *':
        fontFamily: 'Source Sans Pro'
        margin: 0
        padding: 0
        boxSizing: 'border-box'
        userSelect: 'none'

    input:
      border: '1px solid transparent'
      borderRadius: 4
      fontSize: 16
      '&:focus':
        background:
          do color Colors.HIGHLIGHT
            .alpha 0.1
            .rgbaString
        outline: 'none'
        borderColor: Colors.HIGHLIGHT

  CalendarStyle:
    calendar:
      position: 'absolute'
      top: '100%'
      left: 0
      padding: 6
      background: 'white'
      border: '1px solid ' + do color 'black'
        .alpha 0.15
        .rgbString
      borderRadius: 4
      boxShadow: '0 0 7px 5px hsla(0, 0%, 0%, 0.05)'
      textAlign: 'center'
      zIndex: 2

    grid:
      width: 182
      '&.hours':
        height: 200
        width: 100
        overflow: 'auto'
        paddingRight: 6
      '&::-webkit-scrollbar':
        width: 8
      '&::-webkit-scrollbar-track':
        background: do color(Colors.HIGHLIGHT).alpha(0.05).rgbString
        boxShadow: 'inset 0 0 3px rgba(0, 0, 0, 0.15)'
        borderRadius: 4
      '&::-webkit-scrollbar-thumb':
        borderRadius: 4
        background: Colors.HIGHLIGHT
        boxShadow: 'inset 0 0 3px rgba(0, 0, 0, 0.3)'

    today:
      display: 'flex'
      justifyContent: 'center'
      alignItems: 'center'
      height: 26
      cursor: 'pointer'
      border: '1px solid transparent'
      borderRadius: 4
      marginTop: 3
      '&:hover':
        borderColor:
          do color Colors.HIGHLIGHT
            .alpha 0.5
            .rgbString
        color: Colors.HIGHLIGHT

  NavStyle:
    nav:
      display: 'flex'
      cursor: 'pointer'
      lineHeight: '32px'

      '& > div':
        border: '1px solid'
        borderColor: 'transparent'
        borderRadius: 4
        '&:hover':
          borderColor:
            do color Colors.HIGHLIGHT
              .alpha 0.5
              .rgbString
          color: Colors.HIGHLIGHT
        '&.arrow':
          flex: 1
          fontSize: 24
        '&.title':
          flex: 2

  CellStyle:
    cell:
      display: 'inline-flex'
      alignItems: 'center'
      justifyContent: 'center'
      border: '1px solid'
      borderColor: 'white'
      borderRadius: 4
      fontSize: 15
      cursor: 'pointer'
      '&:not(.selected):not(.header):hover':
        backgroundColor:
          do color Colors.HIGHLIGHT
            .alpha 0.25
            .rgbString
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
          do color Colors.HIGHLIGHT
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
          do color Colors.HIGHLIGHT
            .alpha 0.75
            .rgbString
        color: Colors.HIGHLIGHT

      '&.selected':
        backgroundColor: Colors.HIGHLIGHT
        color: 'white'
