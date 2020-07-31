import { useEffect } from "react"
import { navigate } from "gatsby"

// 404 redirects to home page
export default () => {
  useEffect(() => {
    navigate('/')
  }, [])
  return null
}

