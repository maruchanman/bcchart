# coding: utf-8

import json
import pandas as pd
from numpy import nan
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def convert_to_json(df):
    data = []
    cnt = 0
    for date, _val in df.ix[df.index[-120]:].iterrows():
        val = {k: v if v == v else None for k, v in _val.items()}
        data.append({
            "x": cnt, "ax": date, "diff": val["diff"],
            "Open": val["Open"], "Close": val["Close"],
            "High": val["High"], "Low": val["Low"],
            "MA12": val["ma12"], "MA25": val["ma25"],
            "BB1_TOP": val["bb1_top"], "BB1_BOTTOM": val["bb1_bottom"],
            "BB2_TOP": val["bb2_top"], "BB2_BOTTOM": val["bb2_bottom"],
            "MACD": val["macd"], "SIGNAL": val["signal"],
            "PDI": val["pDI"], "MDI": val["mDI"],
            "DX": val["dx"], "ADX": val["adx"],
            "PK": val["pK"], "PD": val["pD"],
            "TENKAN": val["tenkan"], "KIJUN": val["kijun"],
            "SENKOU1": val["senkou1"], "SENKOU2": val["senkou2"], "CHIKOU": val["chikou"]
        })
        cnt += 1
    return data

@app.route("/", methods=["GET"])
def main():
    df = pd.read_csv("./data/feature.csv", index_col=0)
    df = round(df, 3)
    data = convert_to_json(df)
    return jsonify(data)

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
