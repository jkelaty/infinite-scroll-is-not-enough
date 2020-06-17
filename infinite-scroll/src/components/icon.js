import React from "react"

const Icon = (props) => {
  return (
    <span className={`icon-wrapper icon-wrapper-` + props.type}>
      <span className={`icon-wrapper-outer icon-wrapper-outer-` + props.type} onClick={props.callback}>

        <span className={`icon-wrapper-inner icon-wrapper-inner-` + props.type}>
          {props.icon}
        </span>

        {props.count ?
          <span className={`icon-count`}>{props.count}</span>
        : null}

      </span>
    </span>
  )
}

export default Icon;
