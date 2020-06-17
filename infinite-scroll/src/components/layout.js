import React from "react"
import NavBar from "./navbar"

const Layout = ({ location, title, children }) => {
  const darkMode = true;

  return (
    <div className={`infinite-scroll` + (darkMode ? ` ui-black` : null)}>
      <header>
        <NavBar title={title}/>
      </header>

      <main className={`tweets`}>
        {children}
      </main>

      <footer>
      </footer>
    </div>
  )
}

export default Layout
