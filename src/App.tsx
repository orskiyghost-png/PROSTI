import { Route, Routes } from 'react-router-dom'
import Shell from './components/Shell'
import Home from './pages/Home'
import About from './pages/About'
import Works from './pages/Works'
import Project from './pages/Project'
import Services from './pages/Services'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route element={<Shell />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="works" element={<Works />} />
        <Route path="works/:slug" element={<Project />} />
        <Route path="services" element={<Services />} />
        <Route path="contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
