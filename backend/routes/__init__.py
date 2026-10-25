from .auth import auth_bp
from .predictions import predictions_bp
from .dashboard import dashboard_bp
from .diseases import diseases_bp
from .profile import profile_bp

def register_blueprints(app):
    app.register_blueprint(auth_bp)
    app.register_blueprint(predictions_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(diseases_bp)
    app.register_blueprint(profile_bp)
