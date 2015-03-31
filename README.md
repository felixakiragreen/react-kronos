# UNDER CONSTRUCTION
*Goal to publish to NPM by April 5th, 2015*

React Kronos
============

A fast, intuitive, and elegant date and time picker for React.

## Philosophy

- Works straight out of the box with no props
- Provide a couple props and options that give lots of control
- Allow for granular control when needed
- Style is done in JS and can be easily modified
- Beautiful code and appearance

#### Rationale

Even though there are many React Date and/or Time components, I'm developing my own because none of them do everything that I need.

Key requirements:
- Separate date and/or time components (many only have date)
- Easily style-able from JS (not have to muck around in the css)
- Return multiple time formats (Moment, ISO, string)
- Lightweight, use no jquery
- Active on focus, disappear on blur
- Good keyboard navigation

#### See Also

Kronos is built from scratch, but heavily inspired by:

*UX:*
- Google Calendar's input fields

*Code & UX:*
- [react-widgets datetimepicker](http://jquense.github.io/react-widgets/docs/#/datetime-picker)
- [react-input-calendar](https://github.com/Rudeg/react-input-calendar)

#### Thanks

- **!!!** [gaearon](https://github.com/gaearon) big thanks to Dan Abramov who has built some incredible react components ([hot-loader](https://github.com/gaearon/react-hot-loader), [dnd](https://github.com/gaearon/react-dnd)), written excellent [articles](https://medium.com/@dan_abramov), and answered many questions
- **!** [vjeux](https://github.com/vjeux) leading CSS in JS

## Construction progress

#### TODO

- **Demo** [instructions](https://help.github.com/categories/github-pages-basics/)
- **Install**
- **Features**
- **Usage / Documentation**
- create examples/
- create dist/
- create docs/

#### Props

- ~~date~~
- ~~time~~
- min : minimum allowable value
- max : maximum allowable value
-  ~~format~~ : [Moment formatting](http://momentjs.com/docs/#/parsing/string-format/) of date / time
- ~~onChange~~ : change method called when there is a new value
- ~~returnAs~~ : onChange format: Date(), Moment(), ISO, String
- ~~close~~ : closes the dropdown when a value is selected
- ~~placeholder~~ : placeholder text when there is no value
- options
  - date (show years, months, days)
  - time (periods of time (every 30 min, hour), range of time)
  - moment locale (for customization)
- style (CSS)
  - common variables
    - highlight color
    - rounded corner
  - granular style

#### Ideas

- min time also shows from now (0 hours, 0.5 hours, &c)
- min & max make the fields red
