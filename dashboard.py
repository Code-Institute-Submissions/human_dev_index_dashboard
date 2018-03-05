from flask import Flask
from flask import render_template
from pymongo import MongoClient
import json
import os

app = Flask(__name__)

MONGODB_URI = os.environ.get('MONGODB_URI')
MONGO_DB_NAME = os.environ.get('MONGO_DB_NAME')
MONGO_COLLECTION_NAME = os.environ.get('MONGO_COLLECTION_NAME')

FIELDS = {'hdi_rank': True, 'continent': True, 'country': True, 'Human_Development_Index': True,
          'life_expectancy_at_birth': True, 'expected_years_of_education': True, 'mean_years_of_education': True, 'gross_national_income_per_capita': True, 'GNI_per_capita_rank_minus_HDI_Rank': True, "_id": False}

@app.route("/")
def get_home_page():
    return render_template('index.html')

@app.route("/data")
def get_data():
    with MongoClient(MONGODB_URI) as conn:
        collection = conn[MONGO_DB_NAME][MONGO_COLLECTION_NAME]
        results = collection.find(projection=FIELDS)
        return json.dumps(list(results))


if __name__ == "__main__":
    app.run(host=os.getenv('IP', '0.0.0.0'),port=int(os.getenv('PORT', 8080)))