from flask import Flask, jsonify, request
import pickle
import ast
from collections import Counter
 

app = Flask(__name__)

# http://192.168.8.104:5000/detectAccident?input=[[1,1,1,1,1,1],[2,2,2,2,2,2],[3,3,3,3,3,3]]
@app.route('/detectAccident')
def detectAccident():
    input = request.args.get("input")
    result = "No input"
    if input is not None:
        model = pickle.load(open('model.sav', 'rb'))
        input = ast.literal_eval(input)
        resultList = model.predict(input)
        occurence_count = Counter(resultList)
        result = occurence_count.most_common(1)[0][0]
    return jsonify({'Output': result}) 

# Run the application
if __name__ == '__main__':
    app.run(host="0.0.0.0")