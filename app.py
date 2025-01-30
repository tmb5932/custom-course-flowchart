from flask import Flask, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///flowchart.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)

class Semester(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    type = db.Column(db.String(50), nullable=False)
    is_locked = db.Column(db.Boolean, default=False)

class Course(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    semester_id = db.Column(db.Integer, db.ForeignKey("semester.id"), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    restriction = db.Column(db.String(50))
    color = db.Column(db.String(20))
@app.route("/")
def index():
    return render_template("index.html")

@app.route("/save_flowchart", methods=["POST"])
def save_flowchart():
    data = request.json
    username = data.get("username")
    semesters_data = data.get("semesters", [])

    if not username:
        return jsonify({"message": "Username is required."}), 400

    user = User.query.filter_by(username=username).first()
    if not user:
        user = User(username=username)
        db.session.add(user)
        db.session.commit()

    # Clear previous flowchart data for the user
    existing_semesters = Semester.query.filter_by(user_id=user.id).all()
    for semester in existing_semesters:
        Course.query.filter_by(semester_id=semester.id).delete()

    Semester.query.filter_by(user_id=user.id).delete()
    db.session.commit()

    for sem in semesters_data:
        new_semester = Semester(user_id=user.id, name=sem["name"], type=sem["type"], is_locked=sem["isLocked"])
        db.session.add(new_semester)
        db.session.commit()

        for course in sem["courses"]:
            new_course = Course(
                semester_id=new_semester.id,
                name=course["name"],
                restriction=course["restriction"],
                color=course["color"]
            )
            db.session.add(new_course)

    db.session.commit()
    return jsonify({"message": "Flowchart saved successfully!"}), 200

@app.route("/get_flowchart/<username>", methods=["GET"])
def get_flowchart(username):
    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({"message": "User not found."}), 404

    semesters = Semester.query.filter_by(user_id=user.id).all()
    flowchart_data = []

    for semester in semesters:
        courses = Course.query.filter_by(semester_id=semester.id).all()
        flowchart_data.append({
            "name": semester.name,
            "type": semester.type,
            "isLocked": semester.is_locked,
            "courses": [{"name": c.name, "restriction": c.restriction, "color": c.color} for c in courses]
        })

    return jsonify({"username": username, "semesters": flowchart_data})

with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True)