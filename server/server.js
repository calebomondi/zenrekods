const express = require('express');
const multer = require('multer');
const fs = require('fs-extra');
const path = require('path');
const cors = require('cors');

const app = express();
const upload = multer({ dest: 'uploads/' });
const port = 3001;

app.use(express.json());
app.use(cors());

// Serve files from the "file" directory
app.use('/view', express.static(path.join(__dirname, 'files')));

// Ensure the 'uploads' and 'files' directories exist
const ensureDirectoriesExist = async () => {
  const uploadsDir = path.join(__dirname, 'uploads');
  const filesDir = path.join(__dirname, 'files');

  try {
    await fs.ensureDir(uploadsDir);
    await fs.ensureDir(filesDir);
    console.log('Directories ensured');
  } catch (err) {
    console.error('Error ensuring directories:', err);
  }
};

// Call the function to ensure directories exist
ensureDirectoriesExist();

// Create a folder
app.post('/create-folder', (req, res) => {
  const folderPath = path.join(__dirname, 'files', req.body.folderName);
  fs.ensureDir(folderPath, err => {
    if (err) return res.status(500).send('Error creating folder');
    console.log('Folder created');
    res.send('Folder created');
  });
});

// Add a file to a folder
app.post('/upload-file', upload.single('file'), (req, res) => {
  const folderPath = path.join(__dirname, 'files', req.body.folderName);
  const filePath = path.join(folderPath, req.file.originalname);

  // Move the file from the temporary uploads directory to the target folder
  fs.move(req.file.path, filePath, err => {
    if (err) return res.status(500).send('Error moving file');
    console.log('File uploaded');
    res.send('File uploaded');
  });
});

// Delete a file
app.delete('/delete-file', (req, res) => {
  console.log('Request to delete file:', req.body);
  const filePath = path.join(__dirname, 'files', req.body.folderName, req.body.fileName);
  console.log('Deleting file at path:', filePath);

  fs.remove(filePath, err => {
    console.error('Error deleting file:', err);
    if (err) return res.status(500).send('Error deleting file');
    console.log('File deleted');
    res.send('File deleted');
  });
});

// Delete a folder
app.delete('/delete-folder', (req, res) => {
  console.log('Request to delete folder:', req.body);
  const folderPath = path.join(__dirname, 'files', req.body.folderName);
  console.log('Deleting Folder at path:', folderPath);

  fs.remove(folderPath, err => {
    if (err) {
      console.error('Error deleting folder:', err);
      return res.status(500).send('Error deleting folder');
    }
    console.log('Folder deleted');
    res.send('Folder deleted');
  });
});


// New endpoint to list folders and their file counts
app.get('/folders', async (req, res) => {
  const filesDir = path.join(__dirname, 'files');

  try {
    const folders = await fs.readdir(filesDir);
    const folderData = await Promise.all(folders.map(async (folder) => {
      const folderPath = path.join(filesDir, folder);
      const files = await fs.readdir(folderPath);
      return { folderName: folder, fileCount: files.length };
    }));
    console.log('FolderData: ', folderData)
    res.send(folderData);
  } catch (err) {
    console.error('Error listing folders:', err);
    res.status(500).send('Error listing folders');
  }
});

// New endpoint to list files in a specific folder
app.get('/folders/:folderName', async (req, res) => {
  const folderPath = path.join(__dirname, 'files', req.params.folderName);

  try {
    const files = await fs.readdir(folderPath);
    console.log('Files: ', files);
    res.send(files);
  } catch (err) {
    console.error('Error listing files:', err);
    res.status(500).send('Error listing files');
  }
});

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});

