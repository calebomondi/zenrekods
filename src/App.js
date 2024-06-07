import './App.css'
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';
import FileManager from './components/FileHandler/Filemanager';
import FileViewer from './components/FileHandler/FileViewer';



function App() {
  return (
    
    <div className="App">
      <Router>
        <Routes>
          <Route exact path='/' element={<FileManager />}/>
          <Route exact path='/view' element={<FileViewer />}/>
        </Routes>
      </Router>
    </div>
    
  );
}

export default App;
