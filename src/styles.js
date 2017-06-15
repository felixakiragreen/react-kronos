import omit from 'lodash/omit'
import assign from 'lodash/assign'
import color from 'color'
import Moment from 'moment'
import 'moment-range'

let _moment = false
let _options = {}

function initializeMoment(options) {
  if (_moment) return

  let lang = Moment.locale()

  if (options && options.locale) {
    if (options.locale.lang) {
      lang = options.locale.lang
      Moment.locale(lang)
    }
    if (options.locale.settings) {
      Moment.updateLocale(lang, options.locale.settings)
    }
  } else {
    Moment.updateLocale(lang, {
      week: { dow: 1 },
      weekdaysMin: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    })
  }

  _moment = true
}

function initializeOptions(options, instance) {
  _options[instance] = omit(options, 'moment')
}

export default function getStyle(page, props, instance) {
  initializeMoment(props.options)
  if (props.options) {
    initializeOptions(props.options, instance)
  }
  let defaultOptions = {
    color: '#1e7e9e',
    corners: 4,
    font: 'Source Sans Pro',
  }
  let options = assign(defaultOptions, _options[instance])

  if (props.disabled) {
    options.inputDisabled = true
  }

  let style
  switch (page) {
    case 'index':
      style = index(options)
      break
    case 'calendar':
      style = calendar(options)
      break
    case 'navigation':
      style = navigation(options)
      break
  }

  return style
}

// Styles for each page

function index(options) {
  return {
    kronos: {
      position: 'relative',
      display: 'flex',
      color: 'hsl(0, 0%, 50%)',
      '& *': {
        fontFamily: options.font,
        boxSizing: 'border-box',
        userSelect: 'none',
      },
    },
    input: {
      border: '1px solid transparent',
      borderRadius: options.corners,
      borderColor: color(options.color).alpha(0.2).rgbString(),
      fontSize: 16,
      padding: '3px 6px',
      background: 'white',
      '&.outside-range': {
        color: 'white',
        background: '#d0021b',
      },
      '&:hover': {
        cursor: options.inputDisabled ? 'not-allowed' : 'default',
      },
      '&:focus': {
        outline: 'none',
        borderColor: color(options.color).alpha(0.5).rgbString(),
      },
    },
  }
}

function calendar(options) {
  return {
    calendarBelow: {
      position: 'absolute',
      top: '100%',
      left: 0,
      padding: 6,
      background: 'white',
      border: '1px solid hsla(0, 0%, 0%, 0.15)',
      borderRadius: options.corners,
      boxShadow: '0 0 7px 5px hsla(0, 0%, 0%, 0.05)',
      textAlign: 'center',
      zIndex: 2,
    },
    calendarAbove: {
      position: 'absolute',
      bottom: '100%',
      left: 0,
      padding: 6,
      background: 'white',
      border: '1px solid hsla(0, 0%, 0%, 0.15)',
      borderRadius: options.corners,
      boxShadow: '0 0 7px 5px hsla(0, 0%, 0%, 0.05)',
      textAlign: 'center',
      zIndex: 2,
    },
    grid: {
      width: 182,
      '&.hours': {
        height: 223,
        width: 96 + options.corners * 2,
        overflow: 'auto',
        paddingRight: 6,
      },
      '&::-webkit-scrollbar': {
        width: options.corners <= 2 ? 4 : options.corners * 2,
      },
      '&::-webkit-scrollbar-track': {
        background: color(options.color).alpha(0.05).rgbString(),
        boxShadow: 'inset 0 0 3px rgba(0, 0, 0, 0.15)',
        borderRadius: options.corners,
      },
      '&::-webkit-scrollbar-thumb': {
        borderRadius: options.corners,
        background: options.color,
        boxShadow: 'inset 0 0 3px rgba(0, 0, 0, 0.3)',
      },
    },
    today: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: 30,
      cursor: 'pointer',
      border: '1px solid transparent',
      borderRadius: options.corners,
      marginTop: 3,
      '&:hover': {
        borderColor: color(options.color).alpha(0.5).rgbString(),
        color: options.color,
      },
    },
    cell: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '1px solid transparent',
      borderRadius: options.corners,
      fontSize: 15,
      cursor: 'pointer',
      '&:not(.selected):not(.header):hover': {
        backgroundColor: color(options.color).alpha(0.2).rgbString(),
        '&:not(.today)': {
          color: 'hsl(0, 0%, 25%)',
        },
        '&.outside-range': {
          color: '#d0021b',
          backgroundColor: color('#d0021b').alpha(0.2).rgbString(),
          cursor: 'not-allowed',
        },
      },
      '&.years': {
        width: 58,
        height: 38,
      },
      '&.months': {
        width: 58,
        height: 38,
      },
      '&.days': {
        width: 26,
        height: 26,
      },
      '&.hours': {
        display: 'flex',
        lineHeight: 1.5,
      },
      '&.header': {
        cursor: 'default',
        color: color(options.color).alpha(0.4).rgbString(),
        fontWeight: 700,
      },
      '&.past': {
        opacity: 0.4,
      },
      '&.future': {
        opacity: 0.4,
      },
      '&.today': {
        fontWeight: 700,
        border: '1px solid',
        borderColor: color(options.color).alpha(0.75).rgbString(),
        color: options.color,
      },
      '&.selected': {
        backgroundColor: options.color,
        color: 'white',
        '&.outside-range': {
          backgroundColor: '#d0021b',
        },
      },
      '&:not(.selected).outside-range': {
        color: '#d0021b',
      },
    },
  }
}

function navigation(options) {
  return {
    nav: {
      display: 'flex',
      cursor: 'pointer',
      lineHeight: '32px',
      '& > div': {
        border: '1px solid',
        borderColor: 'transparent',
        borderRadius: options.corners,
        '&:hover': {
          borderColor: color(options.color).alpha(0.5).rgbString(),
          color: options.color,
        },
        '&.arrow': {
          flex: 1,
          fontSize: 24,
        },
        '&.title': {
          flex: 2,
        },
      },
    },
  }
}
