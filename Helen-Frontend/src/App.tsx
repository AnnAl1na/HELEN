import './App.css'

import Home from './components/Home'
import PdfViewer from './components/PdfViewer'
import Navbar from './Navbar'

import Learn from './Pages/Learn'
import Notes from './Pages/Notes'
// import SpeechToTextWithResponse from './SpeechToTextWithResponse'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Test from './Pages/Test'



function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>

        {/* <Route path="/" element={<SpeechToTextWithResponse />} /> */}
        <Route path="/" element={<Home/>} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/test" element={<Test />} />
        <Route path="/pdf-viewer/:pdfPath" element={<PdfViewer />} />
      </Routes>
    </Router>
  )
}

export default App
