import React, { useState, useEffect } from 'react';
import { createFolder, uploadFile, deleteFile, getFolders, getFolderContents, deleteFolder  } from '../../api';
import './Filemanager.css'
import { useNavigate } from 'react-router-dom';

function FileManager() {
  const [folderName, setFolderName] = useState('');
  const [file, setFile] = useState(null);
  //const [fileName, setFileName] = useState('');
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [folderContents, setFolderContents] = useState([]);
  const [isVisible,setIsVisible] = useState(false);
  const [showDelFol, setShowDelFol] = useState(false)
  const navigate = useNavigate();

  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    try {
      const data = await getFolders();
      setFolders(data);
    } catch (error) {
      console.error('Error fetching folders:', error);
    }
  };

  const fetchFolderContents = async (folderName) => {
    try {
      const data = await getFolderContents(folderName);
      setFolderContents(data);
      setSelectedFolder(folderName);
    } catch (error) {
      console.error('Error fetching folder contents:', error);
    }
  };

  const handleCreateFolder = async () => {
    try {
      await createFolder(folderName);
      fetchFolders();
      setFolderName('');
    } catch (error) {
      console.error('Error creating folder:', error);
    }
  };

  const handleUploadFile = async () => {
    try {
      await uploadFile(selectedFolder, file);
      fetchFolderContents(selectedFolder);
      setFile(null);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleDeleteFile = async (fileName) => {
    try {
      await deleteFile(selectedFolder, fileName);
      fetchFolderContents(selectedFolder);
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const handleDeleteFolder = async () => {
    try {
      await deleteFolder(selectedFolder);
      fetchFolders()
      setSelectedFolder(null)
      console.log('Folder deleted successfully');
    } catch (error) {
      console.error('Error deleting folder:', error.message);
    }
  };

  const handleViewFile = (selectedFolder, fileName) => {
    // Redirect to another page with data
    navigate('/view',{state: { 'selectedFolder':selectedFolder, 'fileName':fileName }},
    );
  };

  const handleInput = () => {
    if (isVisible === false)
      setIsVisible(true);
    else
      setIsVisible(false);
  }

  const handleDelFol = () => {
    if (showDelFol === true)
        setShowDelFol(false)
    else
      setShowDelFol(true)
  }

  return (
    <>
      <div className="left">
        hey
      </div>
      <div className="right">
        <div className="topbar"> ZenRekods</div>
        <div className="container">
            <div>
              <div className='create'>
                <div className="lCr">
                  Create Folder
                </div>
                <div className="rCr">
                  <input
                    type="text"
                    value={folderName}
                    onChange={(e) => setFolderName(e.target.value)}
                    placeholder="Folder Name"
                  />
                  <button onClick={handleCreateFolder}>+</button>
                </div>
              </div>

              <div className='myFolder'>
                <div className="lMy">My Folders</div>
                <div className="listMy">
                  <ul>
                    {folders.map((folder) => (
                      <li key={folder.folderName} onClick={() => fetchFolderContents(folder.folderName)} className='listMy-li'>
                        {folder.folderName} ({folder.fileCount} files)
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <hr className="rr" />
              {selectedFolder && (
                <div className='foldCont'>
                  <div className="lMy">Contents of {selectedFolder}</div>
                  <div className="newFile">
                    <div>
                      <div className="addFil">Add File <span className='showInput' onClick={handleInput}>{isVisible ? '-' : '+'}</span>
                      </div>
                      {
                        isVisible && (
                          <div className='addFil-inp'>
                            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
                            <button onClick={handleUploadFile} className='filInp'>+</button>
                          </div>
                        )
                      }
                    </div>
                    <div className='btnDelFol'>
                      <div className="arrows" onClick={handleDelFol}>
                      {showDelFol ? (
                          <span dangerouslySetInnerHTML={{ __html: '&larr;' }} />
                        ) : (
                          <span dangerouslySetInnerHTML={{ __html: '&rarr;' }} />
                        )
                      }
                      </div>
                      {
                        showDelFol && (
                          <button onClick={handleDeleteFolder} className='delFol'>Delete this Folder</button>
                        )
                      }
                    </div>
                  </div>
                  <div className="files">
                    <ul className='files-ul'>
                    {folderContents.map((filePath) => {
                        const fileName = filePath.split('/').pop(); // Extract file name from the path
                        return (
                          <li key={filePath} className='files-li'>
                            <div className="filename">{fileName}</div>
                            <div className='btns'>
                            <button onClick={() => handleViewFile(selectedFolder, fileName)}>View</button>
                            <button onClick={() => handleDeleteFile(filePath)}>Delete</button>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </>
  );
}

export default FileManager;
