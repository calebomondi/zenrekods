import React, { useState, useEffect } from 'react';
import { createFolder, uploadFile, deleteFile, getFolders, getFolderContents, deleteFolder } from '../../api';
import './Filemanager.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

function FileManager() {
  const [folderName, setFolderName] = useState('');
  const [file, setFile] = useState(null);
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [folderContents, setFolderContents] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isVisibleFol, setIsVisibleFol] = useState(false);
  const [showDelFol, setShowDelFol] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [alertType, setAlertType] = useState('success'); // success or error
  // const [searchTerm, setSearchTerm] = useState('');
  const [folderSearchQuery, setFolderSearchQuery] = useState('');
  const [fileSearchQuery, setFileSearchQuery] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    try {
      const response = await fetch('http://localhost:3001/folders');
      if (!response.ok) {
        throw new Error('Failed to fetch folders');
      }
      const data = await response.json();
      setFolders(data);
    } catch (error) {
      console.error('Error fetching folders:', error);
    }
  };

  const fetchFolderContents = async (folderName) => {
    try {
      const response = await fetch(`http://localhost:3001/folders/${folderName}`);
      if (!response.ok) {
        throw new Error('Failed to fetch folder contents');
      }
      const data = await response.json();
      setFolderContents(data);
      setSelectedFolder(folderName);
    } catch (error) {
      console.error('Error fetching folder contents:', error);
    }
  };

  const handleCreateFolder = async () => {
    try {
      const response = await fetch('http://localhost:3001/create-folder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ folderName }),
      });
      if (!response.ok) {
        throw new Error('Failed to create folder');
      }
      fetchFolders();
      setFolderName('');
      showModalMessage('Folder created successfully.', 'success');
    } catch (error) {
      console.error('Error creating folder:', error);
      showModalMessage('Failed to create folder. Please try again later.', 'error');
    }
  };

  const handleUploadFile = async () => {
    if (!selectedFolder || !file) {
      console.error('Folder or file not selected');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folderName', selectedFolder);
      formData.append('uploadDate', new Date().toISOString());

      const response = await fetch('http://localhost:3001/upload-file', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Failed to upload file');
      }
      fetchFolderContents(selectedFolder);
      setFile(null);
      showModalMessage('File uploaded successfully.', 'success');
    } catch (error) {
      console.error('Error uploading file:', error);
      showModalMessage('Failed to upload file. Please try again later.', 'error');
    }
  };

  const handleDeleteFile = async (fileName) => {
    if (!selectedFolder) {
      console.error('Folder not selected');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/delete-file', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ folderName: selectedFolder, fileName }),
      });
      if (!response.ok) {
        throw new Error('Failed to delete file');
      }
      fetchFolderContents(selectedFolder);
      showModalMessage('File deleted successfully.', 'success');
    } catch (error) {
      console.error('Error deleting file:', error);
      showModalMessage('Failed to delete file. Please try again later.', 'error');
    }
  };

  const handleDeleteFolder = async () => {
    if (!selectedFolder) {
      console.error('Folder not selected');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/delete-folder', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ folderName: selectedFolder }),
      });
      if (!response.ok) {
        throw new Error('Failed to delete folder');
      }
      fetchFolders();
      setSelectedFolder(null);
      showModalMessage('Folder deleted successfully.', 'success');
    } catch (error) {
      console.error('Error deleting folder:', error.message);
      showModalMessage('Failed to delete folder. Please try again later.', 'error');
    }
  };

  const handleViewFile = (selectedFolder, fileName) => {
    navigate('/view', { state: { selectedFolder, fileName } });
  };

  const handleInput = () => {
    setIsVisible(!isVisible);
  };

  const handleInputFold = () => {
    setIsVisibleFol(!isVisibleFol);
  };

  const handleDelFol = () => {
    setShowDelFol(!showDelFol);
  };

  const handleFolderSearch = (event) => {
    setFolderSearchQuery(event.target.value);
  };

  const handleFileSearch = (event) => {
    setFileSearchQuery(event.target.value);
  };

  const showModalMessage = (message, type = 'success') => {
    setModalContent(message);
    setAlertType(type);
    setShowModal(true);

    // Close modal automatically after 3 seconds
    setTimeout(() => {
      setShowModal(false);
      setModalContent('');
    }, 3000);
  };

  // Filter folders based on folderSearchQuery
  const filteredFolders = folders.filter((folder) =>
    folder.folderName.toLowerCase().includes(folderSearchQuery.toLowerCase())
  );

  // Filter files based on fileSearchQuery
  const filteredFolderContents = folderContents.filter((filePath) => {
    const fileName = filePath.split('/').pop();
    return fileName.toLowerCase().includes(fileSearchQuery.toLowerCase());
  });

  return (
    <div className="right">
      <div className="topbar">ZenRekods</div>
      <div className="container">
        <div className="background-linear"></div>
        <div className="myFolder">
          <div className="lMy">My Folders</div>
          <div className="create">
            <div className="lCr">
              Create Folder <span className="showInput" onClick={handleInputFold}>{isVisibleFol ? '-' : '+'}</span>
            </div>
            {isVisibleFol && (
              <div className="rCr">
                <input
                  type="text"
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  placeholder="Folder Name"
                />
                <button className="showInput" onClick={handleCreateFolder}>+Add</button>
              </div>
            )}
          </div>
          <div className="listMy">
            {/* Folder Search Input */}
            <input
              type="text"
              value={folderSearchQuery}
              onChange={handleFolderSearch}
              placeholder="Search folders..."
            />

            <ul>
              {/* Render filtered folders */}
              {filteredFolders.map((folder) => (
                <li
                  key={folder.folderName}
                  onClick={() => fetchFolderContents(folder.folderName)}
                  className="listMy-li"
                >
                  {/* Render folder icon */}
                  <i className="fa-regular fa-folder-closed"></i>
                  {/* Display folder name and file count */}
                  <span>{folder.folderName} ({folder.fileCount})</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {selectedFolder && (
          <div className="foldCont">
            <div className="lMy">Contents Of {selectedFolder}</div>
            <div className="newFile">
              <div className="create">
                <div className="addFil">Add File <span className="showInput" onClick={handleInput}>{isVisible ? '-' : '+'}</span>
                </div>
                {isVisible && (
                  <div className="addFil-inp">
                    <input type="file" onChange={(e) => setFile(e.target.files[0])} />
                    <button onClick={handleUploadFile} className="filInp">+Add</button>
                  </div>
                )}
              </div>
              <div className="btnDelFol">
                <div className="arrows" onClick={handleDelFol}>
                  {showDelFol ? (
                    <span className="seeDel"><i className="fa-solid fa-arrow-right"></i></span>
                  ) : (
                    <span className="seeDel"><i className="fa-solid fa-arrow-left"></i></span>
                  )}
                </div>
                {showDelFol && (
                  <button onClick={handleDeleteFolder} className="delFol">Delete this Folder</button>
                )}
              </div>
            </div>
            <div className="files">
              <input
                type="text"
                value={fileSearchQuery}
                onChange={handleFileSearch}
                placeholder="Search files..."
              />
              <ul className="files-ul">
                {filteredFolderContents.map((filePath) => {
                  const fileName = filePath.split('/').pop();
                  return (
                    <li key={filePath} className="files-li">
                      <div className="filename"><i className="fa-solid fa-file-pdf"></i> {fileName}</div>
                      <div className="file-actions">
                        <button onClick={() => handleViewFile(selectedFolder, fileName)} className="viewFile">View</button>
                        <button onClick={() => handleDeleteFile(fileName)} className="delFile">Delete</button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Modal for showing alerts */}
      {showModal && (
        <div className={`modal ${alertType}`}>
          {modalContent}
        </div>
      )}
    </div>
  );
}

export default FileManager;
