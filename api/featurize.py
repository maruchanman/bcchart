# coding: utf-8

import datetime
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

columns = [
    "diff", "Open", "High", "Low", "Close",
    "ma12", "ma25", "bb1_top", "bb1_bottom", "bb2_top", "bb2_bottom",
    "macd", "signal", "pDI", "mDI", "diffDI", "dx", "adx", "separation",
    "tenkan", "kijun", "senkou1", "senkou2", "chikou", "pK", "pD"]

def ema(ts, length=12):
    data = []
    alpha = 2 / (length + 1)
    for date, val in ts.items():
        if date == ts.index[0]:
            old_ema = val
            data.append(np.nan)
            continue
        new_ema = old_ema + alpha * (val - old_ema)
        data.append(new_ema)
        old_ema = new_ema
    return data

def __dmi_append(pDM, mDM, TR, obj):
    obj["pDM"].append(pDM)
    obj["mDM"].append(mDM)
    obj["TR"].append(TR)
    return obj

def pre_dmi(df, length=14):
    obj = {"pDM": [], "mDM": [], "TR": []}
    for ix, data in df.iterrows():
        if ix == df.index[0]:
            _data = data
            obj = __dmi_append(np.nan, np.nan, np.nan, obj)
            continue
        pDM = data["High"] - _data["High"]
        mDM = _data["Low"] - data["Low"]
        if pDM < 0 and mDM < 0:
            pDM, mDM = 0, 0
        elif pDM > mDM:
            mDM = 0
        elif pDM < mDM:
            pDM = 0
        elif pDM == mDM:
            pDM, mDM = 0, 0
        TR = max([
            data["High"] - data["Low"],
            data["High"] - _data["Close"],
            _data["Close"] - data["Low"]])
        obj = __dmi_append(pDM, mDM, TR, obj)
        _data = data
    dmi_df = pd.DataFrame(
        [obj["pDM"], obj["mDM"], obj["TR"]]).T
    dmi_df.columns=["pDM", "mDM", "TR"]
    rolling_df = dmi_df.rolling(window=length).sum()
    pDI = rolling_df["pDM"] / rolling_df["TR"]
    mDI = rolling_df["mDM"] / rolling_df["TR"]
    return pDI, mDI

def dx(df, length=14):
    dx = abs(df["pDI"] - df["mDI"]) \
                / (df["pDI"] + df["mDI"])
    adx = dx.rolling(window=14).mean()
    return dx, adx

def itimoku(df):
    _df = df[["High", "Low"]].rolling(window=9).max()
    df["tenkan"] = (_df["High"] + _df["Low"]) / 2
    _df = df[["High", "Low"]].rolling(window=26).max()
    df["kijun"] = (_df["High"] + _df["Low"]) / 2
    _df = df[["High", "Low"]].rolling(window=52).max()
    df["mean52"] = (_df["High"] + _df["Low"]) / 2
    df["chikou"] = df["Close"].shift(-26)
    for date_str, obj in df.copy().iterrows():
        date = datetime.date(*[int(x) for x in date_str.split("-")])
        after26 = (date + datetime.timedelta(days=26)).strftime("%Y-%m-%d")
        df.loc[after26, "senkou1"] = (obj["tenkan"] + obj["kijun"]) / 2
        df.loc[after26, "senkou2"] = obj["mean52"]
    return df

if __name__ == '__main__':
    df = pd.read_csv("./data/bitcoin.csv", index_col=0)
    df["diff"] = (df - df.shift(1))["Close"]
    df["ema12"] = ema(df["Close"], length=12)
    df["ema26"] = ema(df["Close"], length=26)
    df["macd"] = df["ema12"] - df["ema26"]
    df["signal"] = df["macd"].rolling(window=9).mean()
    df["ma12"] = df["Close"].rolling(window=12).mean()
    df["ma25"] = df["Close"].rolling(window=25).mean()
    std = df["Close"].rolling(window=25).std()
    df["bb1_top"] = df["ma25"] + std
    df["bb1_bottom"] = df["ma25"] - std
    df["bb2_top"] = df["ma25"] + 2 * std
    df["bb2_bottom"] = df["ma25"] - 2 * std
    pDI, mDI = pre_dmi(df)
    df["pDI"], df["mDI"] = list(pDI), list(mDI)
    df["diffDI"] = list(df["pDI"] - df["mDI"])
    df["dx"], df["adx"] = dx(df)
    df["separation"] = (df["Close"] - df["ma25"]) / df["ma25"]
    ln, hn = df["Low"].rolling(window=9).max(), df["High"].rolling(window=9).max()
    df["pK"] = (df["Close"] - ln) / (hn - ln)
    df["pD"] = (df["Close"] - ln).rolling(window=3).sum() / (hn - ln).rolling(window=3).sum()
    df = itimoku(df)
    df[columns].to_csv("./data/feature.csv")
