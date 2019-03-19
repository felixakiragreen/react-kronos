import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import Moment from 'moment'

import cn from 'classnames'

import jss from 'jss'
import preset from 'jss-preset-default'
jss.setup(preset())

import { Keys, Levels, Units, Types } from './constants'
import Calendar from './calendar'
import createStyledComponent from './styled-component'
import getStyle from './styles'

const ISOregex = /((\d{4}\-\d\d\-\d\d)[tT]([\d:\.]*)?)([zZ]|([+\-])(\d\d):?(\d\d))/
const minutesOfDay = m => {
  return Moment(m).minutes() + Moment(m).hours() * 60
}

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
    timeStep: PropTypes.number,
    min: PropTypes.any,
    max: PropTypes.any,
    minTime: PropTypes.any,
    maxTime: PropTypes.any,
    shouldTriggerOnChangeForDateTimeOutsideRange: PropTypes.bool,
    preventClickOnDateTimeOutsideRange: PropTypes.bool,
    format: PropTypes.string,
    onChangeDateTime: PropTypes.func,
    returnAs: PropTypes.oneOf([
      Types.ISO,
      Types.JS_DATE,
      Types.MOMENT,
      Types.STRING,
    ]),
    closeOnSelect: PropTypes.bool,
    closeOnBlur: PropTypes.bool,
    placeholder: PropTypes.string,
    name: PropTypes.string,
    disabled: PropTypes.bool,
    inputStyle: PropTypes.object,
    inputClassName: PropTypes.string,
    inputId: PropTypes.string,
    calendarStyle: PropTypes.object,
    calendarClassName: PropTypes.string,
    options: PropTypes.shape({
      color: PropTypes.string,
      corners: PropTypes.number,
      font: PropTypes.string,
      locale: PropTypes.shape({
        lang: PropTypes.string,
        settings: PropTypes.object,
      }),
      format: PropTypes.shape({
        today: PropTypes.string,
        year: PropTypes.string,
        month: PropTypes.string,
        day: PropTypes.string,
        hour: PropTypes.string,
      }),
    }),
    hideOutsideDateTimes: PropTypes.bool,
    // Advanced controls
    controlVisibility: PropTypes.bool,
    visible: PropTypes.bool,
    onClick: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onSelect: PropTypes.func,
  }

  static defaultProps = {
    closeOnSelect: true,
    closeOnBlur: true,
    controlVisibility: false,
    shouldTriggerOnChangeForDateTimeOutsideRange: false,
    preventClickOnDateTimeOutsideRange: false,
    visible: false,
    disabled: false,
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
    } else {
      datetime = this.parse(prop)
      input = datetime.format(this.format(props))
      switch (typeof prop) {
        case 'object':
          if (Moment.isDate(prop)) {
            type = Types.JS_DATE
          } else if (Moment.isMoment(prop)) {
            type = Types.MOMENT
          } else {
            type = null
          }
          break
        case 'string':
          if (prop.match(ISOregex)) {
            type = Types.ISO
          } else {
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
    } else if (typeof this.props.time !== 'undefined') {
      return Units.HOUR
    } else {
      console.warn(
        'Please set a date or time prop. It can be null but not undefined.'
      )
      return Units.DAY
    }
  }

  format(props) {
    props = props || this.props
    if (typeof props.format !== 'undefined') {
      return props.format
    } else if (typeof props.date !== 'undefined') {
      return 'MM-DD-YYYY'
    } else if (typeof props.time !== 'undefined') {
      return 'h:mm a'
    } else {
      return null
    }
  }

  toggle(visible) {
    // Attempt to exit early
    if (visible === this.state.visible) {
      return
    }
    if (typeof visible === 'undefined') {
      visible = !this.state.visible
    }
    if (visible !== this.state.visible) {
      this.setState({ visible })
    }
  }

  parse(input) {
    if (input === null) return null
    let parsing = Moment(input, this.format(), true)
    if (!parsing.isValid()) {
      let test = new Date(input)
      if (isNaN(test.getTime())) {
        test = (this.state && this.state.datetime) || Moment()
      }

      parsing = Moment(test)
    }

    return parsing
  }

  save(saving) {
    const { datetime } = this.state
    if (typeof this.props.date !== 'undefined') {
      saving.hours(datetime.hours())
      saving.minutes(datetime.minutes())
    }
    if (typeof this.props.time !== 'undefined') {
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

    if (this.props.min && Moment(datetime).isBefore(this.props.min)) {
      outsideRange = true
    }
    if (this.props.max && Moment(datetime).isAfter(this.props.max)) {
      outsideRange = true
    }

    if (
      this.props.minTime &&
      minutesOfDay(datetime) < minutesOfDay(this.props.minTime)
    ) {
      outsideRange = true
    }
    if (
      this.props.maxTime &&
      minutesOfDay(datetime) > minutesOfDay(this.props.maxTime)
    ) {
      outsideRange = true
    }

    if (outsideRange && timeUnit !== 'hours') {
      if (
        Moment(datetime).isSame(this.props.min, timeUnit) ||
        Moment(datetime).isSame(this.props.max, timeUnit)
      ) {
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

    this.props.onChangeDateTime && this.props.onChangeDateTime(result)
  }

  onClickInput(e) {
    if (this.props.controlVisibility) {
      if (this.props.onClick) this.props.onClick(e)
    } else {
      this.toggle(true)
    }
  }

  onFocusInput(e) {
    if (this.props.controlVisibility) {
      if (this.props.onFocus) this.props.onFocus(e)
    } else {
      this.toggle(true)
    }
  }

  onBlurInput(e) {
    let datetime = this.state.datetime || Moment()

    if (this.above) {
      ReactDOM.findDOMNode(this._input).focus()
    } else if (this.props.closeOnBlur) {
      this.toggle(false)
      if (this.props.onBlur) this.props.onBlur(e)
    }
    if (this.state.input == this.state.datetime.format(this.format())) {
      return
    } else {
      datetime = this.parse(this.state.input)
      if (datetime) this.save(datetime)
    }
  }

  onChangeInput(e) {
    if (this.props.onChange) this.props.onChange(e)

    let input = e.target.value
    let datetime = Moment(input, this.format(), true)
    if (datetime.isValid()) {
      this.save(datetime)
    } else if (input == '') {
      this.setState({
        datetime: null,
        input: '',
      })
      this.props.onChangeDateTime && this.props.onChangeDateTime(null)
    } else {
      this.setState({ input })
    }
  }

  onSelect(datetime, close, timeUnit) {
    let shouldClose = close
    const { visible } = this.state
    const { closeOnSelect, preventClickOnDateTimeOutsideRange } = this.props

    if (timeUnit) {
      if (!this.validate(datetime, timeUnit.unit)) shouldClose = false
    } else {
      if (!this.validate(datetime)) shouldClose = false
    }

    if (close && shouldClose === false && preventClickOnDateTimeOutsideRange) {
      return
    }

    const willBeVisible = closeOnSelect && shouldClose ? !visible : visible

    this.setState({ visible: willBeVisible })

    this.save(datetime)

    if (this.props.onSelect) {
      this.props.onSelect(datetime, willBeVisible, shouldClose)
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
        } else {
          if (this.state.input == datetime.format(this.format())) {
            if (!this.validate(datetime)) {
              this.toggle(true)
            } else {
              this.toggle()
            }
          } else {
            if (!this.state.visible) this.toggle(true)
            datetime = this.parse(this.state.input)
            if (datetime) this.save(datetime)
          }
        }
        break
    }
  }

  render() {
    const mainClasses = cn(
      'react-kronos',
      this.props.instance,
      this.props.classes.kronos
    )
    const inputClasses = cn(
      this.props.inputClassName,
      this.props.classes.input,
      { 'outside-range': this.state.dateTimeExceedsValidRange }
    )
    const visible = this.props.controlVisibility
      ? this.props.visible
      : this.state.visible

    return (
      <div className={mainClasses}>
        <input
          type='text'
          id={this.props.inputId}
          ref={input => (this._input = input)}
          value={this.state.input || ''}
          onClick={::this.onClickInput}
          onFocus={::this.onFocusInput}
          onBlur={::this.onBlurInput}
          onKeyDown={e => this.onKeyDown(e.keyCode)}
          onChange={::this.onChangeInput}
          placeholder={this.props.placeholder}
          name={this.props.name}
          className={inputClasses}
          disabled={this.props.disabled}
          style={this.props.inputStyle}
        />
        {visible && (
          <Calendar
            instance={this.props.instance}
            datetime={this.state.datetime}
            onSelect={::this.onSelect}
            above={bool =>
              typeof bool === 'undefined' ? this.above : (this.above = bool)
            }
            level={this.state.level}
            setLevel={level => this.setState({ level })}
            validate={::this.validate}
            options={this.props.options}
            inputRect={this._input.getClientRects()[0]}
            hideOutsideDateTimes={this.props.hideOutsideDateTimes}
            timeStep={this.props.timeStep}
            style={this.props.calendarStyle}
            className={this.props.calendarClassName}
          />
        )}
      </div>
    )
  }
}

export default createStyledComponent(Kronos, (props, instance) =>
  getStyle('index', props, instance)
)
