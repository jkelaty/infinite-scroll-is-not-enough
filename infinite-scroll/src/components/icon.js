import React from "react"
import { CSSTransition } from "react-transition-group"

const Icon = (props) => {
  let count = []

  if (props.curr && props.curr > 0) {
    if (props.prev) {
      count = (
        <CSSTransition
          key={props.prev.toString() + props.curr.toString()}
          in={true}
          appear={true}
          timeout={800}
        >
          <span className={`icon-count-wrapper` + ((props.prev > props.curr) ? ` reverse` : ``)}>
              <span className={`icon-count curr-count`}>{props.curr}</span>
              <span className={`icon-count prev-count`}>{props.prev}</span>
          </span>
        </CSSTransition>
      )
    }
    else {
      count = (
        <span className={`icon-count-wrapper`}>
          <span className={`icon-count`}>{props.curr}</span>
        </span>
      )
    }
  }

  return (
    <span className={`icon-wrapper icon-wrapper-` + props.type}>
      <span className={`icon-wrapper-outer icon-wrapper-outer-` + props.type} onClick={props.callback}>

        <span className={`icon-wrapper-inner icon-wrapper-inner-` + props.type}>
          {props.icon}
        </span>

        {count}

      </span>
    </span>
  )
}

export default Icon;
