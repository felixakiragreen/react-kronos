# UNDER CONSTRUCTION 
**Goal to publish to NPM by April 5th, 2015**


# React Kronos
=====================

A fast, intuitive, and elegant date and time picker for React.

## Philosophy

- works straight out of the box with no props
- few props and styles that give lots of control
- granular control when needed
- all style is done in JS and can be easily tweaked
- beautiful code and style

### See Also

I built Kronos because even though there are many excellent Date and/or Time components, none quite did everything that I wanted. 

Kronos was built from scratch, but heavily inspired by:

*UX:*
Google Calendar's input fields

*Code & UX:*
[react-widgets datetimepicker](http://jquense.github.io/react-widgets/docs/#/datetime-picker)
[react-input-calendar](https://github.com/Rudeg/react-input-calendar)


### Thanks

- **!!!** [gaearon](https://github.com/gaearon) big thanks to Dan Abramov who has built some incredible react components ([hot-loader](https://github.com/gaearon/react-hot-loader), [dnd](https://github.com/gaearon/react-dnd)), written excellent [articles](https://medium.com/@dan_abramov), and helped me out in a number of ways. 
- **!** [vjeux](https://github.com/vjeux) leading CSS in JS


### Construction progress:

#### TODO:
- [ ] **Demo** [instructions](https://help.github.com/categories/github-pages-basics/)
- [ ] **Install**
- [ ] **Features**
- [ ] **Usage / Documentation**

- [ ] create examples
- [ ] create dist
- [ ] create docs

#### Props:

- [x] date
- [x] time

- [ ] min - minimum allowable value
- [ ] max - maximum allowable value

- [x] format - [Moment formatting](http://momentjs.com/docs/#/parsing/string-format/) of date / time
- [x] onChange - change method called when there is a new value
- [x] returnAs - onChange format: Date(), Moment(), ISO, String
- [x] close - closes the dropdown when a value is selected
- [x] placeholder - placeholder text when there is no value

- options
  + [ ] date (show years, months, days)
  + [ ] time (periods of time (every 30 min, hour), range of time)
  + [ ] moment locale (for customization)

- style (CSS)
  + [ ] common variables
  	* [ ] highlight color
  	* [ ] rounded corner
  + [ ] granular style


#### Ideas:

* min Time also shows 'fromNow': 0 hours, 0.5 hours, &c
* min & max make the fields red
