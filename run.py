import os
import sys
import subprocess
import webbrowser
import time

def main():
    print("=" * 60)
    print("  🛡️  NGO VERIFY & CONNECT - FULL-STACK RUNNER")
    print("=" * 60)

    base_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(base_dir)

    # 1. Verify seed data
    print("\n📦 Checking seed database...")
    subprocess.run(["node", "backend/src/import-seed.js"], check=True)

    # 2. Open browser after short delay
    def open_browser():
        time.sleep(1.2)
        webbrowser.open("http://localhost:5000")

    import threading
    threading.Thread(target=open_browser, daemon=True).start()

    # 3. Launch server
    print("\n🚀 Starting server at http://localhost:5000 (Press Ctrl+C to stop)...")
    try:
        subprocess.run(["node", "backend/src/server.js"], check=True)
    except KeyboardInterrupt:
        print("\n👋 Server stopped.")

if __name__ == "__main__":
    main()
