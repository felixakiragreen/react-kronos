import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'

import Moment from 'moment'
require('moment-range')
import cn from 'classnames'

import { Levels, Units } from './constants'
import Navigation from './nav'
import Cell from './cell'
import createStyledComponent from './styled-component'
import getStyle from './styles'


class Calendar extends Component {

  static PropTypes = {
    datetime: PropTypes.object.isRequired,
    onSelect: PropTypes.func.isRequired,
    level: PropTypes.string.isRequired,
    setLevel: PropTypes.func.isRequired,
    onMouseDown: PropTypes.func,
    onMouseUp: PropTypes.func,
  }

  componentDidMount() {
    this.scrollToHour()
  }

  componentDidUpdate(prevProps) {
    this.scrollToHour()
  }

  scrollToHour() {
    if (this.props.level == 'hours' && this.refs.selected) {
      // TRY THIS (update in index too)
      // const selected = this.refs.selected
      // alternate
      const selected = ReactDOM.findDOMNode(this.refs.selected)
      selected.parentNode.scrollTop = selected.offsetTop - 6
    }
  }

  onNavigateCell(datetime) {
    const lvl = Levels[this.props.level]
    if (lvl.down) this.props.setLevel(lvl.down)
    this.props.onSelect(datetime, !lvl.down, lvl.key)
  }

  onNavigateUp() {
    const lvl = Levels[this.props.level]
    if (lvl.up) this.props.setLevel(lvl.up)
  }

  onNavigateLeft() {
    const lvl = Levels[this.props.level].nav
    this.props.onSelect(this.props.datetime.subtract(lvl.span, lvl.unit))
  }

  onNavigateRight() {
    const lvl = Levels[this.props.level].nav
    this.props.onSelect(this.props.datetime.add(lvl.span, lvl.unit))
  }

  onToday() {
    const lvl = Levels[this.props.level]
    if (Moment(this.props.datetime).isSame(Moment(), 'day')) {
      this.props.onSelect(Moment(), !lvl.down)
    }
    else {
      this.props.onSelect(Moment())
    }
  }

  getTitle(unit, datetime) {
    datetime = datetime || Moment()
    switch (unit) {
      case 'years':
        const start = datetime.clone().subtract(4, 'years')
        const end = datetime.clone().add(7, 'years')
        let years = []

        Moment()
          .range(start, end)
          .by(Units.YEAR, year => {
            years.push({
              label: year.format('YYYY'),
              selected: year.isSame(datetime, 'year'),
            })
          })
        return [years[0].label, years[years.length-1].label].join('-')

      case 'months':
        return datetime.format('YYYY')

      case 'days':
        return datetime.format('MMMM')

      case 'hours':
        return null
    }

  }

  getCells(unit, datetime) {
    datetime = datetime || Moment()
    switch (unit) {
      case 'years': {
        const start = datetime.clone().subtract(4, 'years')
        const end = datetime.clone().add(7, 'years')
        let years = []

        Moment()
          .range(start, end)
          .by(Units.YEAR, year => {
            years.push({
              moment: year,
              label: year.format('YYYY'),
              selected: year.isSame(datetime, 'year'),
            })
          })

        return years
      }

      case 'months': {
        const start = datetime.clone().startOf('year')
        const end = datetime.clone().endOf('year')
        let months = []

        Moment()
          .range(start, end)
          .by(Units.MONTH, month => {
            months.push({
              moment: month,
              label: month.format('MMM'),
              selected: month.isSame(datetime, 'month'),
            })
          })

        return months
      }

      case 'days': {
        const start = datetime.clone().startOf('month').weekday(0)
        const end = datetime.clone().endOf('month').weekday(6)
        let days = []

        Moment.weekdaysMin()
          .forEach(day => {
            days.push({
              label: day,
              header: true,
            })
          })

        Moment()
          .range(start, end)
          .by(Units.DAY, day => {
            days.push({
              moment: day,
              label: day.format('D'),
              past: day.isBefore(datetime, 'month'),
              future: day.isAfter(datetime, 'month'),
              selected: day.isSame(datetime, 'day'),
              today: day.isSame(Moment(), 'day'),
            })
          })

        return days
      }

      case 'hours': {
        const start = datetime.clone().startOf('day')
        const end = datetime.clone().endOf('day')
        let hours = []
        const closeBefore = datetime.clone().subtract(31, 'minutes')
        const closeAfter = datetime.clone().add(31, 'minutes')

        Moment()
          .range(start, end)
          .by(Units.HOUR, hour => {
            hours.push({
              moment: hour,
              label: hour.format('h:mm a'),
              selected: hour.isSame(datetime, 'minute'),
              nearestBefore: hour.isBetween(closeBefore, datetime),
              nearestAfter: hour.isBetween(datetime, closeAfter),
            })
            let halfHour = hour.clone().add(30, 'minutes')
            hours.push({
              moment: halfHour,
              label: halfHour.format('h:mm a'),
              selected: halfHour.isSame(datetime, 'minute'),
              nearestBefore: halfHour.isBetween(closeBefore, datetime),
              nearestAfter: halfHour.isBetween(datetime, closeAfter),
            })
          })

        return hours
      }

    }
  }

  render() {
    const { level, datetime, classes } = this.props

    return (
      <div
        className={classes.calendar}
        onMouseDown={e => this.props.above(true)}
        onMouseUp={e => this.props.above(false)}
      >
        { level != 'hours' &&
          <Navigation
            id={this.props.id}
            onPrev={::this.onNavigateLeft}
            onNext={::this.onNavigateRight}
            onTitle={::this.onNavigateUp}
            title={this.getTitle(level, datetime)}
          /> }
        <div ref='grid' className={cn(classes.grid, level)}>
          { this.getCells(level, datetime).map( (cell, i) => {
              let type
              switch (true) {
                case cell.header:
                  type = 'header'
                  break
                case cell.past:
                  type = 'past'
                  break
                case cell.future:
                  type = 'future'
                  break
                default:
                  type = 'base'
                  break
              }
              return (
                <Cell
                  key={i}
                  ref={(cell.selected || cell.nearestBefore) ? 'selected' : null}
                  label={cell.label}
                  level={level}
                  type={type}
                  selected={cell.selected}
                  today={cell.today}
                  moment={cell.moment}
                  onClick={::this.onNavigateCell}
                  classes={classes}
                  invalid={this.props.validate(cell.moment, level)}
                />
              )
            })
          }
          { level != 'hours' &&
            <div className={classes.today} onClick={::this.onToday}>
              Today
            </div>
          }
        </div>
      </div>
    )
  }

}


export default createStyledComponent(Calendar,
  (props, id) => getStyle('calendar', props, id)
)
