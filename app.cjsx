React = require 'react'
moment = require 'moment-range'
Kronos = require 'kronos'


module.exports = React.createClass
  displayName: 'App'

  render: ->

    props =
      options:
        color: '#1a8317'
        corners: 3
      # closeOnBlur: false
      # style:
      #   bleh: 'hmm'

    <div>
      <Kronos
        date={@state.datetime}
        onChange={@onChange}
        format='MM . DD . YYYY'
        {... props}
      />
      <Kronos
        time={@state.datetime}
        onChange={@onChange}
        {... props}
      />
    </div>

  onChange: (datetime) ->
    console.log 'onChange:', datetime
    @setState datetime: datetime

  getInitialState: ->
    datetime: moment().toISOString()
