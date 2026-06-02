from flask import Flask, jsonify, request
from db import get_db, close_db
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# register teardown (auto close DB after request)
app.teardown_appcontext(close_db)

@app.route("/")
def home():
    return """
    Hello Flask,
    call <a href="http://127.0.0.1:4000/notes">127.0.0.1:4000/notes</a> to get the notes
    """


@app.route("/notes")
def get_notes():
    # page = request.args.get("page", 1, type=int)
    # limit = request.args.get("limit", 10, type=int)
    # offset = (page - 1) * limit

    db = get_db()

    # 1. get paginated data
    notes = db.execute(
        """
        SELECT *
        FROM notes

        """,
    ).fetchall()

    # 2. get total count
 

    return jsonify(notes)

# CREATE note
@app.route("/notes", methods=["POST"])
def create_note():
    data = request.json
    db = get_db()

    db.execute(
        """
        INSERT INTO notes (title, content)
        VALUES (?, ?)
        """,
        (data["title"], data["content"])
    )

    db.commit()

    return {"message": "Note created"}


if __name__ == "__main__":
    app.run(debug=True, port=4000)