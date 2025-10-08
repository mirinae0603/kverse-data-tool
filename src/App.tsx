import './App.css'
import ImageCropAnnotator from './feature/dashboard/components/ImageAnnotator';
import ImageMapping from './feature/dashboard/components/ImageMapping';
import MarkdownViewer from './feature/dashboard/components/MarkdownViewer';
import UploadFiles from './feature/dashboard/components/UploadFIles';
import Dashboard from './feature/dashboard/Dashboard'
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<Dashboard />}>
            <Route path="/" element={<UploadFiles />} />
            <Route path="/images/unlabelled" element={<ImageMapping mode="unlabelled" />}></Route>
            <Route path="/images/labelled" element={<ImageMapping mode="labelled" />}></Route>
            <Route path="/markdown-viewer" element={<MarkdownViewer />}></Route>
            <Route path="/image-annotations" element={<ImageCropAnnotator />}></Route>
          </Route>
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
