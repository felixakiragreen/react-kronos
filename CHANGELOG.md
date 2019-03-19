# Changelog

## 1.7.2

- Update to React 16.8.4
- Remove Lodash dependency

## 1.7.1

- [bug] fixed issue where hour/minute dropdown would not scroll to user entered time when a `timeStep` was entered [#70](https://github.com/dubert/react-kronos/issues/70) (thanks [LAT-Rosie](https://github.com/LAT-Rosie))

## 1.7.0

- upgrade to React 16.3.1
- upgrade to Babel 7.0.0-beta

## 1.6.0

**Breaking**:

- renamed `options.moment` prop to `options.locale`

**Non-breaking**:

- refactored how the locale is set to fix several issues
- add `disabled` prop
- add `inputStyle`, `inputClassName`, and `inputId` props
- add `calendarStyle` and `calendarClassName` props
- add `shouldClose` parameter to controlled `onSelect` callback

## 1.5.4

- removed margin and padding style that was clashing

## 1.5.3

- update jss dependency to latest version (6.3.0)

## 1.5.2

- [bug] fix prop `timeStep` so it reads the passed prop [#53](https://github.com/dubert/react-kronos/issues/53) (thanks [Slapbox](https://github.com/Slapbox))

## 1.5.1

- [bug] fix showing minute cells when passing `timeStep` prop to a date component

## 1.5.0

- [feature] added `hideOutsideDateTimes` to hide times that cannot be selected [#45](https://github.com/dubert/react-kronos/pull/45) (thanks [Commander-lol](https://github.com/Commander-lol))
- [feature] added `timeStep` prop to configure the number of minutes in an interval [#48](https://github.com/dubert/react-kronos/issues/48) (thanks [ochervak](https://github.com/ochervak))

## 1.4.2

- [bug] fixed issue with toggling visibility on controlled inputs [#41](https://github.com/dubert/react-kronos/issues/41)

## 1.4.1

- added `name` prop to input ([@dalkir](https://github.com/dalkir) in [#40](https://github.com/dubert/react-kronos/pull/40))

## 1.4.0

- dropdown now detects how much space is available and positions itself above or below the input automatically
- made production ready ([@yury-dymov](https://github.com/yury-dymov) in [#39](https://github.com/dubert/react-kronos/pull/39))

## 1.3.0

- added format props for all cell titles
- added minTime/maxTime props for the time picker (ignores date)

## 1.2.7

- [bug] fixed navigation between months in controlled state

## 1.2.6

- [bug] fixed error when manually typing in dates & times

## 1.2.5

- [bug] fixed bug created by React 15 when clearing input and pressing enter

## 1.2.4

- updated all packages to latest versions (most notably react to 15)
- moved react & react-dom to peerDependencies
- added controlled and uncontrolled states

## 1.2.3

- [bug] moment settings were being overwritten

## 1.2.2

- [bug] null inputs are now allowed

## 1.2.1

- [bug] clicking on the hours scrollview will no longer jump around

## 1.2.0

- update react-transform, babel
- added 'kronos' ref to toggle visibility from outside the component

## 1.1.1

- fix bug: provide /lib for entry point
- update packages (react, babel)

## 1.1.0

- added new prop: preventClickOnDateTimeOutsideRange

## 1.0.0

- now following semantic versioning
- full rewrite in ES6

## 0.3.1

- update to react 0.14
- update babel-loader
- switch to using fbjs for keymirror

## 0.3.0

- added new prop: shouldTriggerOnChangeForDateTimeOutsideRange
- on click of 'Today', if it's already today, panel dismisses

## 0.2.4

- [bug] fixed bug related to hour scrolling and jumping entire page

## 0.2.3

- [bug] clicking the decades button in calendar navigator will not crash anymore
- [bug] min and max date will not be red for same dates
- hour selector will scroll to selected hour or nearest hour

## 0.2.2

- fixed JSS modules
- KNOWN ISSUE: minified is not working

## 0.2.1

- fixed dependency

## 0.2.0

- added `min` & `max` props for date ranges

## 0.1.6

- allow empty input strings for null
- for moment-range@1.0.9 until it is fixed

## 0.1.5

- clean up

## 0.1.4

- fix moment and prop options initialization

## 0.1.3

- fix setting of moment locale
- add '.react-kronos' as a top level css class for customization
- allow for null date/time values
- remove colored background from input focus
- move Lodash to be peer dependency

## 0.1.2

- add React 0.13 as peer dependency
- fix react defined [issue](https://github.com/dubert/react-kronos/issues/1)
- fix multiple instances [issue](https://github.com/dubert/react-kronos/issues/5)

## 0.1.1

- initial release
