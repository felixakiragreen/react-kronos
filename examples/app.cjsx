React = require 'react'
moment = require 'moment-range'
Kronos = require 'kronos'


module.exports = React.createClass
  displayName: 'App'

  render: ->
    <div>
      <Kronos
        date={@state.datetime}
        onChange={@onChange}
      />
      <Kronos
        time={@state.datetime}
        onChange={@onChange}
      />
    </div>

  onChange: (datetime) ->
    console.log 'onChange:', datetime
    @setState datetime: datetime

  getInitialState: ->
    datetime: do moment().toISOString
