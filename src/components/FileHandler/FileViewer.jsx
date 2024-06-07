import './FileViewer.css'
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { useLocation } from 'react-router-dom';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

function FileViewer () {
    const defaultLayoutPluginInstance = defaultLayoutPlugin();
    const location = useLocation();
    const { selectedFolder, fileName } = location.state;
    const fileUrl = `http://localhost:3001/view/${selectedFolder}/${fileName}`

    return (
        <div className="fileview">
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.js">
                <div style={{ height: '750px' }}>
                    <Viewer
                        //fileUrl={`${process.env.PUBLIC_URL}/files/return_form.pdf`}
                        fileUrl={fileUrl}
                        plugins={[
                            defaultLayoutPluginInstance,
                        ]}
                    />
                </div>
            </Worker>
        </div>
    );
}

export default FileViewer;