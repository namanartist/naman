"""
Root runner for Naman Lahariya Portfolio
Delegates to backend/app.py while ensuring frontend assets are served correctly.
"""

import os
import sys

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from backend.app import app

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"🚀 Naman Lahariya Portfolio running on http://127.0.0.1:{port}")
    print(f"📁 Frontend directory: {os.path.join(BASE_DIR, 'frontend')}")
    print(f"⚙️ Backend directory:  {os.path.join(BASE_DIR, 'backend')}")
    app.run(host='0.0.0.0', port=port, debug=True)
