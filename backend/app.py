import os
from flask import Flask, jsonify, send_from_directory
from sqlalchemy import create_engine, text
from config import Config
from extensions import db, jwt, cors
from routes import register_blueprints
from models import seed_initial_diseases

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Ensure upload folder exists
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    samples_dir = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'samples')
    os.makedirs(samples_dir, exist_ok=True)

    # Database connectivity test with graceful SQLite fallback
    db_uri = app.config['SQLALCHEMY_DATABASE_URI']
    if db_uri.startswith('mysql'):
        try:
            test_engine = create_engine(db_uri, connect_args={'connect_timeout': 3})
            with test_engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            print("[Database] Successfully connected to MySQL database.")
        except Exception as e:
            print(f"[Database] Notice: MySQL not reachable ({str(e)}). Falling back to SQLite for seamless execution.")
            app.config['SQLALCHEMY_DATABASE_URI'] = Config.SQLITE_FALLBACK_URI
    
    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    
    # Configure CORS for frontend access
    cors.init_app(app, resources={
        r"/api/*": {"origins": "*"},
        r"/uploads/*": {"origins": "*"},
        r"/samples/*": {"origins": "*"}
    })

    # Register all API routes
    register_blueprints(app)

    # Static file routes for uploaded images and sample gallery
    @app.route('/uploads/<path:filename>')
    def serve_upload(filename):
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

    @app.route('/samples/<path:filename>')
    def serve_sample(filename):
        return send_from_directory(samples_dir, filename)

    # Health check endpoint
    @app.route('/api/health', methods=['GET'])
    def health_check():
        db_type = "MySQL" if "mysql" in app.config['SQLALCHEMY_DATABASE_URI'] else "SQLite"
        return jsonify({
            'status': 'healthy',
            'system': 'SkinCare AI Backend',
            'version': '1.0.0',
            'database': db_type,
            'api_status': 'active'
        }), 200

    # JWT Error handlers
    @jwt.unauthorized_loader
    def unauthorized_callback(callback):
        return jsonify({'error': 'Authentication token is missing. Please log in.'}), 401

    @jwt.invalid_token_loader
    def invalid_token_callback(callback):
        return jsonify({'error': 'Invalid authentication token. Please log in again.'}), 401

    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return jsonify({'error': 'Your session has expired. Please log in again.'}), 401

    # HTTP Error handlers
    @app.errorhandler(413)
    def request_entity_too_large(error):
        return jsonify({'error': 'Image file size exceeds the 5 MB limit.'}), 413

    @app.errorhandler(404)
    def not_found_handler(error):
        return jsonify({'error': 'The requested resource was not found.'}), 404

    @app.errorhandler(500)
    def internal_server_error(error):
        return jsonify({'error': 'An internal server error occurred.'}), 500

    # Create tables and seed data inside application context
    with app.app_context():
        try:
            db.create_all()
            seed_initial_diseases()
        except Exception as e:
            print(f"[Database Initialization Warning] {e}")

    return app

app = create_app()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"Starting SkinCare AI Backend on http://127.0.0.1:{port}")
    app.run(host='0.0.0.0', port=port, debug=False)
