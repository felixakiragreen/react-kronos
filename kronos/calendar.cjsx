React = require 'react'
moment = require 'moment-range'
cn = require 'classnames'

{ Levels, Units } = require './constants'
Cell = require './cell'
Navigation = require './nav'

useSheet = require 'react-jss'
{ CalendarStyle } = require './styles'


module.exports = React.createClass
  displayName: 'Calendar'

  render: ->
    dates = @props.level isnt 'hours'
    <div
      className={@sheet.classes.calendar}
      onMouseDown={(e) => @props.above true ; e}
      onMouseUp={(e) => @props.above false ; e}
    >
      { dates and
        <Navigation
          onPrev={@onNavigateLeft}
          onNext={@onNavigateRight}
          onTitle={@onNavigateUp}
          title={@getTitle[@props.level] @props.datetime}
        /> }
      <div ref='grid' className={cn @sheet.classes.grid, @props.level}>
        { @getCells[@props.level] @props.datetime
            .map (cell, i) =>
              type = switch
                when cell.header then 'header'
                when cell.past then 'past'
                when cell.future then 'future'
                else 'base'
              <Cell
                key={i}
                ref={if cell.selected then 'selected' else null}
                label={cell.label}
                level={@props.level}
                type={type}
                selected={cell.selected}
                today={cell.today}
                moment={cell.moment}
                onClick={@onNavigateCell}
                classes={@props.classes}
              />
        }
        { dates and
          <div className={@sheet.classes.today} onClick={this.onToday}>
            Today
          </div>
        }
      </div>
    </div>

  onNavigateCell: (datetime) ->
    lvl = Levels[@props.level]
    @props.setLevel lvl.down if lvl.down
    @props.onSelect datetime, !lvl.down

  onNavigateUp: ->
    lvl = Levels[@props.level]
    @props.setLevel lvl.up

  onNavigateLeft: ->
    lvl = Levels[@props.level].nav
    @props.onSelect @props.datetime.subtract lvl.span, lvl.unit

  onNavigateRight: ->
    lvl = Levels[@props.level].nav
    @props.onSelect @props.datetime.add lvl.span, lvl.unit

  onToday: ->
    @props.onSelect do moment

  getTitle:
    years: (datetime) ->
      datetime or= do moment
      start = datetime.clone().subtract 4, 'years'
      end = datetime.clone().add 7, 'years'
      years = []

      moment()
        .range start, end
        .by Units.YEAR, (year) ->
          years.push
            label: year.format 'YYYY'
            selected: year.isSame datetime, 'year'

      [years[0].label, years[years.length-1].label].join('-')

    months: (datetime) ->
      datetime or= do moment
      datetime.format 'YYYY'

    days: (datetime) ->
      datetime or= do moment
      datetime.format 'MMMM'

    hours: (datetime) -> null

  getCells:
    years: (datetime) ->
      datetime or= do moment
      start = datetime.clone().subtract 4, 'years'
      end = datetime.clone().add 7, 'years'
      years = []

      moment()
        .range start, end
        .by Units.YEAR, (year) ->
          years.push
            moment: year
            label: year.format 'YYYY'
            selected: year.isSame datetime, 'year'

      years

    months: (datetime) ->
      datetime or= do moment
      start = datetime.clone().startOf 'year'
      end = datetime.clone().endOf 'year'
      months = []

      moment()
        .range start, end
        .by Units.MONTH, (month) ->
          months.push
            moment: month
            label: month.format 'MMM'
            selected: month.isSame datetime, 'month'

      months

    days: (datetime) ->
      datetime or= do moment
      start = datetime.clone().startOf('month').weekday 0
      end = datetime.clone().endOf('month').weekday 6
      days = []

      moment.weekdaysMin()
        .forEach (day) ->
          days.push
            label: day
            header: true

      moment()
        .range start, end
        .by Units.DAY, (day) ->
          days.push
            moment: day
            label: day.format 'D'
            past: day.isBefore datetime, 'month'
            future: day.isAfter datetime, 'month'
            selected: day.isSame datetime, 'day'
            today: day.isSame do moment, 'day'

      days

    hours: (datetime) ->
      datetime or= do moment
      start = datetime.clone().startOf 'day'
      end = datetime.clone().endOf 'day'
      hours = []

      moment()
        .range start, end
        .by Units.HOUR, (hour) ->
          hours.push
            moment: hour
            label: hour.format 'h:mm a'
            selected: hour.isSame datetime, 'minute'
            fromNow: ''
          halfHour = hour.clone().add 30, 'minutes'
          hours.push
            moment: halfHour
            label: halfHour.format 'h:mm a'
            selected: halfHour.isSame datetime, 'minute'
            fromNow: ''

      hours

  mixins: [
    useSheet(CalendarStyle)
  ]

  propTypes:
    datetime: React.PropTypes.object.isRequired
    onSelect: React.PropTypes.func.isRequired
    level: React.PropTypes.string.isRequired
    setLevel: React.PropTypes.func.isRequired
    onMouseDown: React.PropTypes.func
    onMouseUp: React.PropTypes.func
    # min: React.PropTypes.any

  # componentWillUpdate: (nextProps, nextState) ->

    # TODO: arrows move scroll position
    # TODO: parsing entered text moves scroll position
    # TODO: selecting does not

    # if @props.level is 'hours'
    #
    #   console.log 'this.refs:', @refs
    #
    #   list = React.findDOMNode @refs.grid
    #   hour = React.findDOMNode @refs.selected

      # console.log 'list.scrollTop:', list.scrollTop
      # console.log 'list.offsetHeight:', list.offsetHeight
      # console.log 'list.scrollHeight:', list.scrollHeight
      # console.log 'hour.offsetTop:', hour.offsetTop
      # console.log 'hour.offsetHeight:', hour.offsetHeight
      # console.log 'hour.scrollHeight:', hour.scrollHeight
      #
      # topOfList = list.scrollTop
      # topOfHour = hour.offsetTop
      # bottomOfList = list.scrollTop + list.offsetHeight
      # bottomOfHour = hour.offsetTop + hour.offsetHeight
      #
      # console.log 'bottomOfHour:', bottomOfHour
      # console.log 'bottomOfList:', bottomOfList
      # console.log 'topOfHour:', topOfHour
      # console.log 'topOfList:', topOfList
      #
      # if bottomOfHour > bottomOfList
      #   console.log '---BOTTOM'
      #   @scrollPosition = bottomOfHour - list.offsetHeight - hour.offsetHeight * 2 + 6
      # else if topOfHour < topOfList
      #   console.log '----TOP'
      #   @scrollPosition = list.scrollTop
      # else
      #   @scrollPosition = null
      #
      # console.log 'bottomOfList:', bottomOfList
      # console.log 'hour.offsetTop:', hour.offsetTop
      # console.log ':', d
      # console.log 'this.scrollPosition:', @scrollPosition
      #
      # @shouldScrollBottom = `node.scrollTop + node.offsetHeight == node.scrollHeight`

  # componentDidUpdate: (prevProps, prevState) ->
    # if @scrollPosition
    #   console.log 'update'
    #   list = @refs.hours.getDOMNode()
    #   list.scrollTop = @scrollPosition
