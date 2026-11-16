import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Nav from './Nav'
import Footer from './Footer'
import Grain from './Grain'
import Cursor from './Cursor'
import RouteTransition from './RouteTransition'
import { initLenis } from '../motion/lenis'

export default function Shell() {
  const { pathname } = useLocation()
  useEffect(() => initLenis(), [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <>
      <a className="skip-link micro" href="#main">К содержимому</a>
      <Nav />
      <main id="main" tabIndex={-1}>
        <RouteTransition>
          <Outlet />
        </RouteTransition>
      </main>
      <Footer />
      <Grain />
      <Cursor />
    </>
  )
}
