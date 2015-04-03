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

> #### Rationale
>
> Even though there are many React Date and/or Time components, I'm developing my own because > none of them do everything that I need.
>
> Key requirements:
> - Separate date and/or time components (many only have date)
> - Easily style-able from JS (not have to muck around in the css)
> - Return multiple time formats (Date, Moment, ISO, string)
> - Lightweight, use no jquery
> - Active on focus, disappear on blur
> - Efficient keyboard navigation

## [Demo](http://dubert.github.io/react-kronos)

## Usage

1. NPM install `npm install react-kronos`
2. Require Kronos `import Kronos from 'react-kronos'`
3. Include
```jsx
<Kronos
  date={this.state.datetime}
  onChange={this.onChange}
/>
```

**Props:**
- `date` - Date(), Moment, ISO, or string (must match `format`)
- `time` - Date(), Moment, ISO, or string (must match `format`)
- `format` - [Moment formatting](http://momentjs.com/docs/#/parsing/string-format/) of date / time
- `onChange` - change method called when there is a new value
- `returnAs` - onChange format `JS_DATE`, `MOMENT`, `ISO`, `STRING` (default: same as input)
- `closeOnSelect` - closes the dropdown when a value is selected (default: `true`)
- `closeOnBlur` - closes the dropdown when the field is blurred (default: `true`)
- `placeholder` - placeholder text when there is no value
- `options:`
  - `color` - the highlight color in the UI
  - `corners` - the pixel size of rounded corners (default: `4`)
  - `font` - the font family (default: `Source Sans Pro`)
  - `moment:` - customize according to [Moments documentation](http://momentjs.com/docs/#/customization/)
    - `lang` - language (default: `en` for english)
    - `settings` - properties to override as an object (default: `{ week: { dow: 1 }, weekdaysMin: ['M', 'T', 'W', 'T', 'F', 'S', 'S'] }`)

#### See Also

Kronos is built from scratch, but heavily inspired by:

*UX & UI:*
- Google Calendar's input fields

*Code & UX:*
- [react-widgets datetimepicker](http://jquense.github.io/react-widgets/docs/#/datetime-picker)
- [react-input-calendar](https://github.com/Rudeg/react-input-calendar)

#### Thanks

- **!!!** [gaearon](https://github.com/gaearon) big thanks to Dan Abramov who has built some incredible react components ([hot-loader](https://github.com/gaearon/react-hot-loader), [dnd](https://github.com/gaearon/react-dnd)), written excellent [articles](https://medium.com/@dan_abramov), and answered many questions
- **!** [vjeux](https://github.com/vjeux) leading the CSS in JS movement

## Construction progress

#### TODO:
- **Demo website**
- **Publish to NPM**
- **Features**
- **Usage / Documentation**

#### Roadmap

**0.1:**
- ~~date & time inputs~~
- ~~formatting (input & returning)~~
- ~~common style variables:~~
  - ~~highlight color~~
  - ~~font family~~
  - ~~rounded corners~~
- ~~options: customize with moment locale~~

**0.2:**
- prop: `styles` - granular styling (overwrite any style, or provide entire theme)
- options:
  - date (restrict calendar to show only days, or with months, or with years)
  - time (set increments, set ranges of time)

**0.3:**
- prop: `min` - minimum allowable date+time
  - hard (user cannot select a date/time, or type/paste a value)
  - soft (user can select/input values but it becomes red)
- prop: `max` - maximum allowable date+time
  - hard
  - soft
- support for connected start & end date+time
  - date (show range on calendar)
  - time (show "0 hours", "0.5 hours", "1 hour", &c)

#### Ideas

- input field masking
- scroll time list as user arrows up+down
- ⇧+arrow uses the higher order unit
- maintain a CHANGELOG
- address required props & non-required (what happens if none are included)
