from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import json
from werkzeug.utils import secure_filename
from query_data import query_rag,create_question,analyse


app = Flask(__name__)
CORS(app)  # Allow cross-origin requests (to interact with React frontend)

# Configuration settings
app.config['UPLOAD_FOLDER'] = 'uploads'  # Folder where uploaded files will be stored
app.config['ALLOWED_EXTENSIONS'] = {'pdf'}  # Allowed file extensions
app.config['JSON_FILE'] = 'pdfs.json'  # JSON file to store uploaded PDF paths and names

# Ensure the uploads folder exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Allowed file extension check
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

@app.route('/upload', methods=['POST'])
def upload_file():
    # Check if a file is part of the request
    if 'pdf' not in request.files or 'pdfName' not in request.form:
        return jsonify({'error': 'No file or name part'}), 400

    file = request.files['pdf']
    pdf_name = request.form['pdfName']

    # If no file is selected
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    # Check if the file is allowed
    if file and allowed_file(file.filename):
        # Ensure the file is saved as 'pdfName.pdf'
        filename = secure_filename(pdf_name) + '.pdf'  # Append .pdf extension to the given name
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)  # Save the file to the server

        # Read existing PDFs from the JSON file or create an empty list if the file doesn't exist
        if os.path.exists(app.config['JSON_FILE']):
            with open(app.config['JSON_FILE'], 'r') as f:
                pdfs = json.load(f)
        else:
            pdfs = []

        # Add the new file's name and path to the list
        pdfs.append({'name': pdf_name, 'path': f'/uploads/{filename}'})

        # Save the updated list of PDFs to the JSON file
        with open(app.config['JSON_FILE'], 'w') as f:
            json.dump(pdfs, f, indent=4)

        # Respond with the file path
        return jsonify({'message': 'File uploaded successfully', 'pdfPath': f'/uploads/{filename}', 'pdfName': pdf_name}), 200
    else:
        return jsonify({'error': 'Invalid file type'}), 400

@app.route('/pdfs', methods=['GET'])
def get_pdfs():
    # Read the PDFs from the JSON file
    if os.path.exists(app.config['JSON_FILE']):
        with open(app.config['JSON_FILE'], 'r') as f:
            pdfs = json.load(f)
        return jsonify(pdfs), 200
    else:
        return jsonify([]), 200

# Serve the uploaded files (PDFs) publicly from the 'uploads' folder
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    try:
        # Serve the file from the uploads directory
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename+".pdf")
    except FileNotFoundError:
        return jsonify({'error': 'File not found'}), 404




#////////////////////RAG///////////////////

@app.route('/process', methods=['POST'])
def process_input():
    data = request.json
    text = data.get('text', '')
    pdf_name = data.get('pdfName', 'nil')

    
    # Example: Process the text and pdf_name
    # if pdf_name == "nil":
    #     reply = f"Received message: '{text}'. No PDF is currently opened."
    # else:
    #     reply = f"Received message: '{text}' while PDF '{pdf_name}' is opened."

    # Return the response
    if(pdf_name=="nil"):
        return jsonify({"reply": "please open a pdf"}), 200
    
    return jsonify({"reply": query_rag(text,pdf_name)}), 200






@app.route('/ask_question', methods=['POST'])
def ask_question():
    pdf_name = request.json.get('pdfName')
    
    return jsonify({"reply": create_question(pdf_name)}), 200

@app.route('/submit_answer', methods=['POST'])
def submit_answer():
    data = request.json
    answer = data.get('text')
    pdf_name = data.get('pdfName')

   
    return jsonify({"reply": analyse(answer)}), 200
    




if __name__ == '__main__':
    app.run(debug=True, port=5000)
