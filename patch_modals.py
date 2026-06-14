import os
import re

files = [
    r'd:\VDart\SIMS\SIMS\frontend\src\pages\task-dashboard\views\TaskList.jsx',
    r'd:\VDart\SIMS\SIMS\frontend\src\pages\payroll-dashboard\views\PayrollRecords.jsx',
    r'd:\VDart\SIMS\SIMS\frontend\src\pages\payroll\PayrollDashboard.jsx',
    r'd:\VDart\SIMS\SIMS\frontend\src\pages\intern-dashboard\views\InternUsers.jsx',
    r'd:\VDart\SIMS\SIMS\frontend\src\pages\intern-dashboard\views\InternDocuments.jsx',
    r'd:\VDart\SIMS\SIMS\frontend\src\pages\documents\DocumentView.jsx',
    r'd:\VDart\SIMS\SIMS\frontend\src\pages\asset-dashboard\views\AssetList.jsx',
    r'd:\VDart\SIMS\SIMS\frontend\src\pages\admin\PerformanceFeedbackPage.jsx',
    r'd:\VDart\SIMS\SIMS\frontend\src\pages\admin\EntityManagement.jsx',
    r'd:\VDart\SIMS\SIMS\frontend\src\pages\admin\Payments.jsx',
]

for filepath in files:
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        if 'ConfirmModal' in content:
            continue
            
        parts = filepath.replace('\\', '/').split('/pages/')[1].split('/')
        depth = len(parts)
        rel_path = '../' * depth + 'components/modals/ConfirmModal'
        
        # 1. Add import
        if "import Modal from" in content:
            content = content.replace("import Modal from", f"import ConfirmModal from '{rel_path}'\nimport Modal from")
        else:
            content = re.sub(r"(import .*? from 'react'.*?\n)", r"\1" + f"import ConfirmModal from '{rel_path}'\n", content, count=1)
            
        # 2. Add state
        if "setDeletingId" not in content:
            content = re.sub(r"(const \[.*?\] = useState.*?)\n", r"\1\n  const [deletingId, setDeletingId] = useState(null)\n", content, count=1)
            
        # 3. Change onDelete to executeDelete
        content = re.sub(r"const onDelete = (async \([^)]*\) => {)\s*if \(!confirm\([^)]+\)\) return", r"const executeDelete = \1", content)
        
        # 4. Change buttons calling onDelete to setDeletingId
        content = re.sub(r"onClick={\(\) => onDelete\(([^)]+)\)}", r"onClick={() => setDeletingId(\1)}", content)
        
        # 5. Insert ConfirmModal
        modal_jsx = """
      <ConfirmModal 
        open={!!deletingId} 
        onClose={() => setDeletingId(null)} 
        onConfirm={() => executeDelete(deletingId)}
        title="Confirm Deletion"
        message="Are you sure you want to delete this record? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />"""
        
        if "<Modal " in content:
            content = content.replace("<Modal ", modal_jsx + "\n      <Modal ")
        else:
            # Put it right before the last closing div
            content = re.sub(r"(</(div|React\.Fragment)>)\s*$", modal_jsx + r"\n    \1\n", content)
            
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Patched: {os.path.basename(filepath)}")
    except Exception as e:
        print(f"Error in {filepath}: {e}")
