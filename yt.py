from googleapiclient.discovery import build
import re
import os
import datetime
from flask import Flask, request, Blueprint
from flask.json import jsonify

# https://trends.google.com/trends/explore?date=all&geo=US&q=youtuber&hl=en-GB
# 38% of max
# https://en.wikipedia.org/wiki/Dead_Internet_theory

API_KEY = os.environ["YOUTUBE_API_KEY"]
youtube = build("youtube", "v3", developerKey=API_KEY)

def get_video_attrs(video):
    title = video.get("snippet").get("title")
    id = video.get("id").get("videoId")
    return {"title": title, "id": id}

def search_videos(keyword, max_results=3):
    date_before = datetime.datetime(year=2016, month=1, day=1).isoformat() + 'Z'
    request = youtube.search().list(
        part="snippet,id",
        q=keyword,
        order="rating",
        type="video",
        videoEmbeddable="true",
        videoSyndicated="true",
        publishedBefore=date_before,
        maxResults=max_results
    )
    response = request.execute()
    videos = response.get("items", [])
    return [ get_video_attrs(video) for video in videos]

app = Flask(__name__)
bp = Blueprint('api', __name__)

@bp.route("/query", methods=['POST'])
def query():
    q = request.json.get('q')
    res = search_videos(q)
    if not res:
        return jsonify("No results for search"), 400
    return jsonify(res)

app.register_blueprint(bp, url_prefix='/api')

if __name__ == "__main__":
    app.run(host='127.0.0.1')
