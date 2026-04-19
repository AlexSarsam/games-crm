from flask import Flask, request, jsonify
import base64
import tempfile
import os
from deepface import DeepFace

app = Flask(__name__)


def decode_image(b64_string, suffix=".jpg"):
    """Decode a base64 image string to a temp file and return the path."""
    data = base64.b64decode(b64_string)
    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=suffix)
    tmp.write(data)
    tmp.close()
    return tmp.name


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


@app.route("/compare", methods=["POST"])
def compare():
    """
    Expects JSON body:
    {
        "reference": "<base64-encoded image>",
        "current":   "<base64-encoded image>"
    }
    Returns:
    {
        "verified": true|false,
        "distance": float,
        "threshold": float
    }
    """
    body = request.get_json(silent=True)
    if not body or "reference" not in body or "current" not in body:
        return jsonify({"error": "Missing reference or current image"}), 400

    ref_path = None
    cur_path = None
    try:
        ref_path = decode_image(body["reference"])
        cur_path = decode_image(body["current"])

        result = DeepFace.verify(
            img1_path=ref_path,
            img2_path=cur_path,
            model_name="VGG-Face",
            enforce_detection=False,
        )

        return jsonify({
            "verified": result["verified"],
            "distance": result["distance"],
            "threshold": result["threshold"],
        })

    except Exception as e:
        return jsonify({"error": str(e), "verified": False}), 500

    finally:
        for path in [ref_path, cur_path]:
            if path and os.path.exists(path):
                os.unlink(path)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
