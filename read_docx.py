import zipfile
import xml.etree.ElementTree as ET

def read_docx(file_path):
    namespaces = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
    text_content = []
    
    with zipfile.ZipFile(file_path) as docx:
        # Check if word/document.xml exists
        if 'word/document.xml' not in docx.namelist():
            return "Error: word/document.xml not found in docx"
            
        tree = ET.parse(docx.open('word/document.xml'))
        root = tree.getroot()
        
        # We want to iterate through paragraphs and tables to maintain some structure
        # w:p is a paragraph
        # w:r is a run
        # w:t is text
        for paragraph in root.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p'):
            p_text = []
            for text in paragraph.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t'):
                if text.text:
                    p_text.append(text.text)
            if p_text:
                text_content.append("".join(p_text))
                
    return "\n".join(text_content)

try:
    content = read_docx('Coding Inspiration 2026 - INTELLICREW - Proposal.docx')
    with open('proposal_text.txt', 'w', encoding='utf-8') as f:
        f.write(content)
    print("SUCCESS: Extracted proposal text successfully!")
except Exception as e:
    print(f"ERROR: {str(e)}")
