React = require 'react'
moment = require 'moment-range'

{ Keys, Levels } = require './constants'


module.exports =

  above: false

  toggle: (visible) ->
    visible ?= not @state.visible
    @setState visible: visible unless visible is @state.visible

  parse: (input) ->

    # format, with strict parsing true, so we catch bad dates
    parsing = moment input, do @format, true

    # if the new date didn't match our format, see if the native js date can parse it
    if not do parsing.isValid
      test = new Date input

      # if native js cannot parse
      if isNaN do test.getTime
        if @state?.datetime
          # use current datetime
          test = @state.datetime
        else
          # or else make new one
          test = do moment

      parsing = moment test

    parsing

  save: (saving) ->
    { datetime } = @state

    if @props.date
      saving.hours do datetime.hours
      saving.minutes do datetime.minutes
    if @props.time
      saving.date do datetime.date
      saving.month do datetime.month
      saving.year do datetime.year

    @setState
      datetime: saving
      input: saving.format do @format

    @commit saving

  commit: (datetime) ->
    result = switch @props.returnAs
      when 'string' then datetime.format do @format
      when 'iso' then do datetime.toISOString
      when 'moment' then datetime
      when 'jsdate' then do datetime.toDate

    @props.onChange? result

  onChange: (e) ->
    input = e.target.value
    datetime = moment input, do @format, true
    if do datetime.isValid
      @save datetime
    else
      @setState input: input

  onSelect: (datetime, close) ->
    @setState
      visible: if @props.close and close then !@state.visible else @state.visible

    @save datetime

  onBlur: ->
    if @above
      do React.findDOMNode @refs.input
        .focus
    else
      @toggle false

    if @state.input is @state.datetime.format do @format
      return
    else
      datetime = @parse @state.input
      @save datetime

  onKeyDown: (code) ->
    datetime = @state.datetime or do moment
    lvl = Levels[@state.level]

    switch code

      when Keys.UP
        # SHIFT to do months?
        @onSelect datetime.subtract lvl.key.span, lvl.key.unit

      when Keys.DOWN
        # SHIFT to do months?
        @onSelect datetime.add lvl.key.span, lvl.key.unit

      when Keys.ENTER
        if lvl.down
          @setState level: lvl.down
        else
          if @state.input is datetime.format do @format
            do @toggle
          else
            @toggle true unless @state.visible
            datetime = @parse @state.input
            @save datetime
