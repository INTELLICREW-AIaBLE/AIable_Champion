import zipfile
import xml.etree.ElementTree as ET
import sys

def get_docx_text(path):
    try:
        doc = zipfile.ZipFile(path)
        xml_content = doc.read('word/document.xml')
        root = ET.fromstring(xml_content)
        
        # Namespace
        ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
        
        text = []
        for paragraph in root.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p'):
            p_text = []
            for run in paragraph.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t'):
                if run.text:
                    p_text.append(run.text)
            if p_text:
                text.append("".join(p_text))
            else:
                # Add empty line for spacing if paragraph has no text but is a break
                text.append("")
        return "\n".join(text)
    except Exception as e:
        return f"Error: {str(e)}"

if __name__ == "__main__":
    path = r"d:\CodingInspiration2026\Coding Inspiration 2026 - INTELLICREW - Proposal.docx"
    content = get_docx_text(path)
    # Output to a text file for easy reading or print first 10000 chars
    with open(r"d:\CodingInspiration2026\proposal_text.txt", "w", encoding="utf-8") as f:
        f.write(content)
    print("Extracted", len(content), "characters to proposal_text.txt")
