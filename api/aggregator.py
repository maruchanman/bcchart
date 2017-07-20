# coding: utf-8

import datetime
import requests
import pandas as pd
from io import StringIO


def fetch_data():
    url = "http://api.coindesk.com/charts/data?" + \
          "output=csv&data=ohlc&index=USD&startdate=2010-07-18&enddate={}" + \
          "&exchanges=bpi&dev=1".format(datetime.date.today().strftime("%Y-%m-%d"))
    res = requests.get(url)
    data = StringIO(res.content.decode("utf-8"))
    df = pd.read_csv(data, index_col=0).ix[:-2]
    df.index = [ix.split(" ")[0] for ix in df.index]
    df = df.ix[[ix for ix in df.index if ix < datetime.date.today().strftime("%Y-%m-%d")]]
    return df

if __name__ == '__main__':
    df = fetch_data()
    df.to_csv("./data/bitcoin.csv")
