import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import Moment from 'moment'

import cn from 'classnames'

import jss from 'jss'
jss.use(require('jss-nested'))
jss.use(require('jss-camel-case'))
jss.use(require('jss-vendor-prefixer'))
jss.use(require('jss-px'))

import { Keys, Levels, Units, Types } from './constants'
import Calendar from './calendar'
import createStyledComponent from './styled-component'
import getStyle from './styles'

const ISOregex = /((\d{4}\-\d\d\-\d\d)[tT]([\d:\.]*)?)([zZ]|([+\-])(\d\d):?(\d\d))/


class Kronos extends Component {

  constructor(props) {
    super(props)

    this.state = {
      datetime: this.getDateTimeInput().datetime,
      input: this.getDateTimeInput().input,
      type: this.getDateTimeInput().type,
      visible: false,
      level: this.getDefaultLevel(),
    }
  }

  static propTypes = {
    date: PropTypes.any,
    time: PropTypes.any,
    min: PropTypes.any,
    max: PropTypes.any,
    shouldTriggerOnChangeForDateTimeOutsideRange: PropTypes.bool,
    preventClickOnDateTimeOutsideRange: PropTypes.bool,
    format: PropTypes.string,
    onChange: PropTypes.func,
    returnAs: PropTypes.oneOf([
      Types.ISO,
      Types.JS_DATE,
      Types.MOMENT,
      Types.STRING,
    ]),
    closeOnSelect: PropTypes.bool,
    closeOnBlur: PropTypes.bool,
    placeholder: PropTypes.string,
    options: PropTypes.object,
    // styles: React.PropTypes.object
  }

  static defaultProps = {
    closeOnSelect: true,
    closeOnBlur: true,
    shouldTriggerOnChangeForDateTimeOutsideRange: false,
    preventClickOnDateTimeOutsideRange: false,
  }

  static above = false

  componentWillReceiveProps(nextProps) {
    if (this.props != nextProps) {
      this.validate(this.getDateTimeInput(nextProps).datetime, null, true)
      this.setState({
        datetime: this.getDateTimeInput(nextProps).datetime,
        input: this.getDateTimeInput(nextProps).input,
      })
    }
  }

  getDateTimeInput(props) {
    props = props || this.props
    let prop = props.date || props.time || null

    let datetime, input, type
    if (prop === null) {
      datetime = Moment()
      input = null
      type = Types.MOMENT
    }
    else {
      datetime = this.parse(prop)
      input = datetime.format(this.format(props))
      switch (typeof prop) {
        case 'object':
          if (Moment.isDate(prop)) {
            type = Types.JS_DATE
          }
          else if (Moment.isMoment(prop)) {
            type = Types.MOMENT
          }
          else {
            type = null
          }
          break
        case 'string':
          if (prop.match(ISOregex)) {
            type = Types.ISO
          }
          else {
            type = Types.STRING
          }
          break
      }
    }

    return {
      datetime: datetime,
      input: input,
      type: type,
    }
  }

  getDefaultLevel() {
    if (typeof this.props.date !== 'undefined') {
      return Units.DAY
    }
    else if (typeof this.props.time !== 'undefined') {
      return Units.HOUR
    }
    else {
      console.warn('Please set a date or time prop. It can be null but not undefined.')
      return Units.DAY
    }
  }

  format(props) {
    props = props || this.props
    if (props.format) {
      return props.format
    }
    else if (props.date) {
      return 'MM-DD-YYYY'
    }
    else if (props.time) {
      return 'h:mm a'
    }
    else {
      return null
    }
  }

  toggle(visible) {
    if (typeof visible === 'undefined') {
      visible = !this.state.visible
    }
    this.setState({ visible })
  }

  parse(input) {
    if (input === null) return null
    let parsing = Moment(input, this.format(), true)
    if (!parsing.isValid()) {
      let test = new Date(input)
      if (isNaN(test.getTime())) {
        test = this.state && this.state.datetime || Moment()
      }

      parsing = Moment(test)
    }

    return parsing
  }

  save(saving) {
    const { datetime } = this.state
    if (this.props.date) {
      saving.hours(datetime.hours())
      saving.minutes(datetime.minutes())
    }
    if (this.props.time) {
      saving.date(datetime.date())
      saving.month(datetime.month())
      saving.year(datetime.year())
    }
    this.setState({
      datetime: saving,
      input: saving.format(this.format()),
    })

    if (this.validate(saving, null, true)) this.commit(saving)
  }

  validate(datetime, timeUnit, isSaving) {
    let outsideRange = false

    if (this.props.min && Moment(datetime).isBefore(this.props.min) ) {
      outsideRange = true
    }
    if (this.props.max && Moment(datetime).isAfter(this.props.max) ) {
      outsideRange = true
    }

    if (outsideRange && timeUnit !== 'hours') {
      if (Moment(datetime).isSame(this.props.min, timeUnit) || Moment(datetime).isSame(this.props.max, timeUnit)) {
        outsideRange = false
      }
    }

    if (isSaving) {
      this.setState({ dateTimeExceedsValidRange: outsideRange })
      if (this.props.shouldTriggerOnChangeForDateTimeOutsideRange) return true
    }

    return !outsideRange
  }

  commit(datetime) {
    let returnAs = this.props.returnAs || this.state.type
    let result
    switch (returnAs) {
      case Types.ISO:
        result = datetime.toISOString()
        break
      case Types.JS_DATE:
        result = datetime.toDate()
        break
      case Types.MOMENT:
        result = datetime
        break
      case Types.STRING:
        result = datetime.format(this.format())
        break
    }

    this.props.onChange && this.props.onChange(result)
  }

  onChange(e) {
    let input = e.target.value
    let datetime = Moment(input, this.format(), true)
    if (datetime.isValid()) {
      this.save(datetime)
    }
    else if (input == '') {
      this.setState({
        datetime: null,
        input: '',
      })
      this.props.onChange && this.props.onChange(null)
    }
    else {
      this.setState({ input })
    }
  }

  onSelect(datetime, close, timeUnit) {
    let shouldClose = close
    const { visible } = this.state
    const {
      closeOnSelect,
      preventClickForDateTimeOutsideRange,
    } = this.props

    if (timeUnit) {
      if (!this.validate(datetime, timeUnit.unit)) shouldClose = false
    }
    else {
      if (!this.validate(datetime)) shouldClose = false
    }
    if (close && shouldClose === false && preventClickForDateTimeOutsideRange) return

    this.setState({ visible: closeOnSelect && shouldClose ? !visible : visible })
    this.save(datetime)
  }

  onBlur() {
    if (this.above) {
      ReactDOM.findDOMNode(this.refs.input).focus()
    }
    else if (this.props.closeOnBlur) {
      this.toggle(false)
    }
    if (this.state.input == this.state.datetime.format(this.format())) {
      return
    }
    else {
      datetime = this.parse(this.state.input)
      if (datetime) this.save(datetime)
    }
  }

  onKeyDown(code) {
    let datetime = this.state.datetime || Moment()
    let lvl = Levels[this.state.level]

    switch (code) {
      case Keys.UP:
        this.onSelect(datetime.subtract(lvl.key.span, lvl.key.unit))
        break
      case Keys.DOWN:
        this.onSelect(datetime.add(lvl.key.span, lvl.key.unit))
        break
      case Keys.ENTER:
        if (lvl.down) {
          this.setState({ level: lvl.down })
        }
        else {
          if (this.state.input == datetime.format(this.format())) {
            if (!this.validate(datetime)) {
              this.toggle(true)
            }
            else {
              this.toggle()
            }
          }
          else {
            if (!this.state.visible) this.toggle(true)
            datetime = this.parse(this.state.input)
            this.save(datetime)
          }
        }
        break
    }
  }

  render() {
    const mainClasses = cn('react-kronos',
      this.props.id,
      this.props.classes.kronos
    )
    const inputClasses = cn(this.props.classes.input,
      { 'outside-range': this.state.dateTimeExceedsValidRange }
    )

    return (
      <div className={mainClasses}>
        <input
          type='text'
          ref='input'
          value={this.state.input}
          onClick={() => this.toggle(true)}
          onFocus={() => this.toggle(true)}
          onBlur={::this.onBlur}
          onKeyDown={(e) => this.onKeyDown(e.keyCode)}
          onChange={::this.onChange}
          placeholder={this.props.placeholder}
          className={inputClasses}
        />
      { this.state.visible &&
          <Calendar
            id={this.props.id}
            datetime={this.state.datetime}
            onSelect={::this.onSelect}
            above={(bool) => this.above = bool}
            level={this.state.level}
            setLevel={(level) => this.setState({ level }) }
            validate={::this.validate}
          />
        }
      </div>
    )
  }

}


export default createStyledComponent(Kronos,
  (props, id) => getStyle('index', props, id)
)
