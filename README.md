React Kronos 1.6
================

A fast, intuitive, and elegant date and time picker for React.

## Philosophy

- Works straight out of the box with minimal props
- Provide a few props and options that give lots of control
- Allow for granular control when needed
- Style is done in JS and can be easily modified
- Beautiful code and appearance

> #### Rationale
>
> Even though there are many React Date and/or Time components, I'm developing my own because none of them do everything that I need.
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
3. Use
```jsx
<Kronos
  date={this.state.datetime}
  onChange={this.onChange}
/>
```

**Props:**
- `date` - *Date()*, *Moment()*, *ISO*, or *string* (if string, must match `format`)
- `time` - *Date()*, *Moment()*, *ISO*, or *string* (if string, must match `format`)
- `timeStep` - *number* : minutes for time step (if not specified: 30 minutes)
- `format` - *string* : [Moment formatting](http://momentjs.com/docs/#/parsing/string-format/) of date / time
- `onChange` - *function* : native onChange method
- `onChangeDateTime` - *function* : change method called when there is a new value
- `returnAs` - *string* : onChange format `JS_DATE`, `MOMENT`, `ISO`, `STRING` (default: same as input)
- `min` - *Date()*, *Moment()*, *ISO* to set as the minimum datetime
- `max` - *Date()*, *Moment()*, *ISO* to set as the maximum datetime
- `minTime` - *Date()*, *Moment()*, *ISO* to set as the minimum time (only the time will be used)
- `maxTime` - *Date()*, *Moment()*, *ISO* to set as the maximum time (only the time will be used)
- `closeOnSelect` - *boolean* : closes the dropdown when a value is selected (default: `true`)
- `closeOnBlur` - *boolean* : closes the dropdown when the field is blurred (default: `true`)
- `shouldTriggerOnChangeForDateTimeOutsideRange` - *boolean*: optionally allow dates outside min/max range to trigger onChanges (default: `false`)
- `preventClickOnDateTimeOutsideRange` - *boolean*: optionally prevent users from clicking on dates outside min/max range (default: `false`)
- `hideOutsideDateTimes` - *boolean*: optionally hide times that do not pass validation
- `placeholder` - *string* : placeholder text when there is no value
- `name` - *string* : name used for the input form
- `disabled` - *boolean* : prevent interaction with input field
- `inputStyle` - *object* : inline styles for input field
- `inputClassName` - *string* : `.class` for input field
- `inputId` - *string* : `#id` for input field
- `calendarStyle` - *object* : inline styles for calendar
- `calendarClassName` - *string* : `.class` for calendar
- `options:`
  - `color` - *string* : the highlight color in the UI as a hex
  - `corners` - *number* : the pixel size of rounded corners (default: `4`)
  - `font` - *string* : the font family (default: `Source Sans Pro`)
  - `locale` - *object* : Moment locale [customization](http://momentjs.com/docs/#/customization/)
    - `lang` - *string* : language (default: `en` for english)
    - `settings` - *object* : properties to override as an object (default: `{ week: { dow: 1 }, weekdaysMin: ['M', 'T', 'W', 'T', 'F', 'S', 'S'] }`)
  - `format`: - *object* : Moment formatting for cell titles
    - `today`: - *string* : default: `Today`
    - `year`: - *string* : default: `YYYY`
    - `month`: - *string* : default: `MMM`
    - `day`: - *string* : default: `D`
    - `hour`: - *string* : default: `h:mm a`

## Construction progress

#### Roadmap

**Needed**
- Provide docs on website
- options:
  - date (restrict calendar to show only days, or with months, or with years)
  - time (set increments, set ranges of time)
- support for connected start & end date+time
  - date (show range on calendar)
  - time (show "0 hours", "0.5 hours", "1 hour", &c)

#### Ideas

- input field masking
- ⇧+arrow uses the higher order unit
- specify required props & non-required (what happens if none are included)
- add warning messages to help use component properly
- mobile support
- wide browser compatibility
- prop: `styles` - granular styling (overwrite any style, or provide entire theme)
- add crazy awesome date/time interpretation/parsing similar to that in The Hit List
- set up solid unit tests


#### Thanks

- **!!!** [gaearon](https://github.com/gaearon) big thanks to Dan Abramov who has built some incredible react components ([hot-loader](https://github.com/gaearon/react-hot-loader), [dnd](https://github.com/gaearon/react-dnd)), written excellent [articles](https://medium.com/@dan_abramov), and answered many questions
- **!** [vjeux](https://github.com/vjeux) leading the CSS in JS movement
