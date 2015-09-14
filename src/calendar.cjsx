React = require 'react'
Moment = require 'moment-range'
cn = require 'classnames'

{ Levels, Units } = require './constants'
Navigation = require './nav'
Cell = require './cell'
createStyledComponent = require './styled-component'
getStyle = require './styles'


Calendar = React.createClass
  displayName: 'Calendar'

  render: ->
    dates = @props.level isnt 'hours'
    <div
      className={@props.classes.calendar}
      onMouseDown={(e) => @props.above true ; e}
      onMouseUp={(e) => @props.above false ; e}
    >
      { dates and
        <Navigation
          id={@props.id}
          onPrev={@onNavigateLeft}
          onNext={@onNavigateRight}
          onTitle={@onNavigateUp}
          title={@getTitle[@props.level] @props.datetime}
        /> }
      <div ref='grid' className={cn @props.classes.grid, @props.level}>
        { @getCells[@props.level] @props.datetime
            .map (cell, i) =>
              type = switch
                when cell.header then 'header'
                when cell.past then 'past'
                when cell.future then 'future'
                else 'base'
              <Cell
                key={i}
                ref={if cell.selected or cell.nearestBefore then 'selected'}
                label={cell.label}
                level={@props.level}
                type={type}
                selected={cell.selected}
                today={cell.today}
                moment={cell.moment}
                onClick={@onNavigateCell}
                classes={@props.classes}
                invalid={@props.validate(cell.moment, @props.level)}
              />
        }
        { dates and
          <div className={@props.classes.today} onClick={this.onToday}>
            Today
          </div>
        }
      </div>
    </div>

  componentDidMount: ->
    if @props.level is 'hours'
      @refs.selected and React.findDOMNode(@refs.selected).scrollIntoView()

  onNavigateCell: (datetime) ->
    lvl = Levels[@props.level]
    @props.setLevel lvl.down if lvl.down
    @props.onSelect datetime, !lvl.down

  onNavigateUp: ->
    lvl = Levels[@props.level]
    if lvl.up then @props.setLevel lvl.up

  onNavigateLeft: ->
    lvl = Levels[@props.level].nav
    @props.onSelect @props.datetime.subtract lvl.span, lvl.unit

  onNavigateRight: ->
    lvl = Levels[@props.level].nav
    @props.onSelect @props.datetime.add lvl.span, lvl.unit

  onToday: ->
    @props.onSelect do Moment

  getTitle:
    years: (datetime) ->
      datetime or= do Moment
      start = datetime.clone().subtract 4, 'years'
      end = datetime.clone().add 7, 'years'
      years = []

      Moment()
        .range start, end
        .by Units.YEAR, (year) ->
          years.push
            label: year.format 'YYYY'
            selected: year.isSame datetime, 'year'

      [years[0].label, years[years.length-1].label].join('-')

    months: (datetime) ->
      datetime or= do Moment
      datetime.format 'YYYY'

    days: (datetime) ->
      datetime or= do Moment
      datetime.format 'MMMM'

    hours: (datetime) -> null

  getCells:
    years: (datetime) ->
      datetime or= do Moment
      start = datetime.clone().subtract 4, 'years'
      end = datetime.clone().add 7, 'years'
      years = []

      Moment()
        .range start, end
        .by Units.YEAR, (year) ->
          years.push
            moment: year
            label: year.format 'YYYY'
            selected: year.isSame datetime, 'year'

      years

    months: (datetime) ->
      datetime or= do Moment
      start = datetime.clone().startOf 'year'
      end = datetime.clone().endOf 'year'
      months = []

      Moment()
        .range start, end
        .by Units.MONTH, (month) ->
          months.push
            moment: month
            label: month.format 'MMM'
            selected: month.isSame datetime, 'month'

      months

    days: (datetime) ->
      datetime or= do Moment
      start = datetime.clone().startOf('month').weekday 0
      end = datetime.clone().endOf('month').weekday 6
      days = []

      Moment.weekdaysMin()
        .forEach (day) ->
          days.push
            label: day
            header: true

      Moment()
        .range start, end
        .by Units.DAY, (day) ->
          days.push
            moment: day
            label: day.format 'D'
            past: day.isBefore datetime, 'month'
            future: day.isAfter datetime, 'month'
            selected: day.isSame datetime, 'day'
            today: day.isSame do Moment, 'day'

      days

    hours: (datetime) ->
      datetime or= do Moment
      start = datetime.clone().startOf 'day'
      end = datetime.clone().endOf 'day'
      hours = []
      closeBefore = datetime.clone().subtract 31, 'minutes'
      closeAfter = datetime.clone().add 31, 'minutes'

      Moment()
        .range start, end
        .by Units.HOUR, (hour) ->
          hours.push
            moment: hour
            label: hour.format 'h:mm a'
            selected: hour.isSame datetime, 'minute'
            nearestBefore: hour.isBetween closeBefore, datetime
            nearestAfter: hour.isBetween datetime, closeAfter
          halfHour = hour.clone().add 30, 'minutes'
          hours.push
            moment: halfHour
            label: halfHour.format 'h:mm a'
            selected: halfHour.isSame datetime, 'minute'
            nearestBefore: halfHour.isBetween closeBefore, datetime
            nearestAfter: halfHour.isBetween datetime, closeAfter

      hours

  propTypes:
    datetime: React.PropTypes.object.isRequired
    onSelect: React.PropTypes.func.isRequired
    level: React.PropTypes.string.isRequired
    setLevel: React.PropTypes.func.isRequired
    onMouseDown: React.PropTypes.func
    onMouseUp: React.PropTypes.func


module.exports = createStyledComponent Calendar,
  (props, id) -> getStyle 'calendar', props, id
