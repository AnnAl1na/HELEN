
import { useParams } from 'react-router-dom';
const PdfViewer = () => {
    const { pdfPath } = useParams<{ pdfPath: string }>();
  
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Viewing PDF</h2>
        <iframe
          src={`http://localhost:5000/uploads/${pdfPath}`}
          width="100%"
          height="800px"
          title="PDF Viewer"
        />
      </div>
    );
  };
  
export default PdfViewer;
