import React from "react"
import { CSSTransition } from "react-transition-group"

/*
 * Icon Component
 *
 * Used as a wrapper for icons when callbacks and
 * a count label needs to be applied. Handles
 * animating previous -> current count labels
 */
const Icon = (props) => {
  let count = []

  // Show count next to icon (e.g. number of likes)
  if (props.curr && props.curr > 0) {
    let curr_length = props.curr.toString().length

    if (props.prev) {
      // Animate from previous count -> current count
      let prev_length   = props.prev.toString().length
      let wrapper_width = (Math.max(curr_length, prev_length) * 8.13 + 5) + 'px' // Ensure count doesn't overflow from container

      count = (
        <CSSTransition
          key={props.prev.toString() + props.curr.toString()}
          in={true}
          appear={true}
          timeout={800}>

          <span className={`icon-count-wrapper` + ((props.prev > props.curr) ? ` reverse` : ``)} style={{width: wrapper_width}}>
            <span className={`icon-count curr-count`}>{props.curr}</span>
            <span className={`icon-count prev-count`}>{props.prev}</span>
          </span>
          
        </CSSTransition>
      )
    }
    else {
      // Show count without animation
      let wrapper_width = (curr_length * 8.13 + 5) + 'px'

      count = (
        <span className={`icon-count-wrapper`} style={{width: wrapper_width}}>
          <span className={`icon-count`}>{props.curr}</span>
        </span>
      )
    }
  }

  return (
    <span className={`icon-wrapper icon-wrapper-${props.type}`}>
      <span className={`icon-wrapper-outer icon-wrapper-outer-${props.type}`} onClick={props.callback}>

        <span className={`icon-wrapper-inner icon-wrapper-inner-${props.type}` + (props.inanimate ? ` inanimate` : ``)}>
          {props.icon}
        </span>

        {count}

      </span>
    </span>
  )
}

export default Icon

