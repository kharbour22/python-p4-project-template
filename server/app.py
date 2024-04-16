#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, make_response
from flask_restful import Resource
from datetime import datetime

# Local imports
from config import app, db, api
# Add your model imports
from models import Run, Signup

# Views go here!
class AllRuns(Resource):

    def get(self):
        response_body = [run.to_dict(only = ('id', 'location', 'image', 'link')) for run in Run.query.all()]
        return make_response(response_body, 200)
    def post (self):
        try:
            new_run = Run(location = request.json.get('location'), image = request.json.get('image'), link = request.json.get('link'))
            db.session.add(new_run)
            db.session.commit()
            response_body = new_run.to_dict(only=('id', 'location', 'image', 'link'))
            return make_response(response_body, 201)
        except:
            response_body = {
                "error": "A run must have a location, image, and link"

            }
            return make_response(response_body, 400)

api.add_resource(AllRuns, '/runs')

class AllSignups(Resource):

    def get(self):
        response_body = [signup.to_dict(rules = ('-run.signups',)) for signup in Signup.query.all()]
        return make_response(response_body, 200)

    def post(self):
        try:
            new_signup = Signup(date = request.json.get('date'), flight_id=request.json.get('run_id'))
            db.session.add(new_signup)
            db.session.commit()
            response_body = new_signup.to_dict(rules = ('-run.signups',))
            return make_response(response_body, 201)
        except:
            response_body = {
                "error": "Signup must have a date and time and run id."
            }
            return make_response(response_body, 400)

api.add_resource(AllSignups, '/signups')

@app.route('/')
def index():
    return '<h1>Project Server</h1>'



if __name__ == '__main__':
    app.run(port=5555, debug=True)

