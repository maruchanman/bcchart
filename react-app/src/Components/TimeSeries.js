import React from 'react';
import {
  XYPlot, XAxis, YAxis, HorizontalGridLines, Crosshair,
  LineSeries, AreaSeries} from 'react-vis';
import Spinner from 'react-spinkit';

import Constants from '../Constants.js'
import CandlestickSeries from '../Items/CandleStickSeries.js';

import '../Styles/TimeSeries.css';
import '../Styles/react-vis.css';

function formatDate(date) {
  var y = date.split("-")[0];
  var m = date.split("-")[1];
  var d = date.split("-")[2];
  return Number(m) + "/" + Number(d);
}

const MainSeries = props => (
  <XYPlot
    margin={{left: 20}}
    width={window.innerWidth}
    height={window.innerWidth < window.innerHeight ? window.innerWidth : window.innerHeight / 1.5}>
    <HorizontalGridLines />
    <AreaSeries
      color={Constants.colors.bb2}
      opacity={0.3}
      data={props.showing.filter(obj => obj["Close"]).map(
        obj => Object({x: obj["x"], y: obj["BB2_TOP"], y0: obj["BB2_BOTTOM"]}))}/>
    <AreaSeries
      color={Constants.colors.bb1}
      opacity={0.5}
      data={props.showing.filter(obj => obj["Close"]).map(
        obj => Object({x: obj["x"], y: obj["BB1_TOP"], y0: obj["BB1_BOTTOM"]}))}/>
    <LineSeries
      color={Constants.colors.ma_long}
      data={props.showing.filter(obj => obj["Close"]).map(obj => Object({x: obj["x"], y: obj["MA25"]}))}/>
    <LineSeries
      color={Constants.colors.ma_short}
      data={props.showing.filter(obj => obj["Close"]).map(obj => Object({x: obj["x"], y: obj["MA12"]}))}/>
    <CandlestickSeries
      upColor={Constants.colors.up}
      downColor={Constants.colors.down}
      onNearestX={(value, evt) => props.updateCrosshair(props.showing[evt.index])}
      data={props.showing.filter(obj => obj["Close"]).map(obj => Object({
          x: obj["x"], y: obj["Close"], yOpen: obj["Open"], yClose: obj["Close"],
          yHigh: obj["High"], yLow: obj["Low"], diff: obj["diff"]}))}/>
    <XAxis hideTick tickLabelAngle={-90} tickFormat={val => formatDate(props.timeSeries[val].ax)}/>
    <YAxis tickPadding={-30} hideLine/>
    <Crosshair values={[props.crosshairValues]}>
      <div className="crossHair">
        <h4>{props.crosshairValues.ax}</h4>
        <p>始値: {props.crosshairValues.Open}</p>
        <p>終値: {props.crosshairValues.Close}</p>
        <p>高値: {props.crosshairValues.High}</p>
        <p>低値: {props.crosshairValues.Low}</p>
      </div>
    </Crosshair>
  </XYPlot>
);

const ItimokuSeries = props => (
  <XYPlot
    margin={{left: 20}}
    width={window.innerWidth}
    height={window.innerWidth < window.innerHeight ? window.innerWidth : window.innerHeight / 2}>
    <HorizontalGridLines />
    <AreaSeries
      opacity={0.5}
      data={props.showing.map(
        obj => Object({x: obj["x"], y: obj["SENKOU1"], y0: obj["SENKOU2"]}))}/>
    <LineSeries
      color="red"
      data={props.showing.filter(obj => obj["Close"]).map(obj => Object({x: obj["x"], y: obj["KIJUN"]}))}/>
    <LineSeries
      color="blue"
      data={props.showing.filter(obj => obj["Close"]).map(obj => Object({x: obj["x"], y: obj["TENKAN"]}))}/>
    <LineSeries
      color="green"
      data={props.showing.filter(obj => obj["CHIKOU"]).map(obj => Object({x: obj["x"], y: obj["CHIKOU"]}))}/>
    <CandlestickSeries
      upColor={Constants.colors.up}
      downColor={Constants.colors.down}
      onNearestX={(value, evt) => props.updateCrosshair(props.showing[evt.index])}
      data={props.showing.filter(obj => obj["Close"]).map(obj => Object({
          x: obj["x"], y: obj["Close"], yOpen: obj["Open"], yClose: obj["Close"],
          yHigh: obj["High"], yLow: obj["Low"], diff: obj["diff"]}))}/>
    <XAxis hideTick tickLabelAngle={-90} tickFormat={val => formatDate(props.timeSeries[val].ax)}/>
    <YAxis tickPadding={-30} hideLine/>
    <Crosshair values={[props.crosshairValues]}>
      <div className="crossHair">
        <h4>{props.crosshairValues.ax}</h4>
        <p>基準線: {props.crosshairValues.KIJUN}</p>
        <p>転換線: {props.crosshairValues.TENKAN}</p>
        <p>遅行線: {props.crosshairValues.CHIKOU}</p>
        <p>先行スパン１: {props.crosshairValues.SENKOU1}</p>
        <p>先行スパン２: {props.crosshairValues.SENKOU2}</p>
      </div>
    </Crosshair>
  </XYPlot>
);

const MACDSeries = props => (
  <XYPlot
    margin={{left: 20}}
    width={window.innerWidth}
    height={window.innerWidth < window.innerHeight ? window.innerWidth : window.innerHeight / 2}>
    <HorizontalGridLines />
    <LineSeries
      onNearestX={(value, evt) => props.updateCrosshair(props.showing[evt.index])}
      data={props.showing.filter(obj => obj["Close"]).map(obj => Object({x: obj["x"], y: obj["MACD"]}))}/>
    <LineSeries
      data={props.showing.filter(obj => obj["Close"]).map(obj => Object({x: obj["x"], y: obj["SIGNAL"]}))}/>
    <XAxis hideTick tickLabelAngle={-90} tickFormat={val => formatDate(props.timeSeries[val].ax)}/>
    <YAxis tickPadding={-30} hideLine/>
    <Crosshair values={[props.crosshairValues]}>
      <div className="crossHair">
        <h4>{props.crosshairValues.ax}</h4>
        <p>MACD: {props.crosshairValues.MACD}</p>
        <p>SIGNAL: {props.crosshairValues.SIGNAL}</p>
      </div>
    </Crosshair>
  </XYPlot>
);

const DMISeries = props => (
  <XYPlot
    margin={{left: 20}}
    width={window.innerWidth}
    height={window.innerWidth < window.innerHeight ? window.innerWidth : window.innerHeight / 2}>
    <HorizontalGridLines />
    <LineSeries
      onNearestX={(value, evt) => props.updateCrosshair(props.showing[evt.index])}
      data={props.showing.filter(obj => obj["Close"]).map(obj => Object({x: obj["x"], y: obj["PDI"]}))}/>
    <LineSeries
      data={props.showing.filter(obj => obj["Close"]).map(obj => Object({x: obj["x"], y: obj["MDI"]}))}/>
    <LineSeries
      data={props.showing.filter(obj => obj["Close"]).map(obj => Object({x: obj["x"], y: obj["ADX"]}))}/>
    <XAxis hideTick tickLabelAngle={-90} tickFormat={val => formatDate(props.timeSeries[val].ax)}/>
    <YAxis tickPadding={-30} hideLine/>
    <Crosshair values={[props.crosshairValues]}>
      <div className="crossHair">
        <h4>{props.crosshairValues.ax}</h4>
        <p>+DI: {props.crosshairValues.PDI}</p>
        <p>-DI: {props.crosshairValues.MDI}</p>
        <p>ADX: {props.crosshairValues.ADX}</p>
      </div>
    </Crosshair>
  </XYPlot>
);

const StocasSeries = props => (
  <XYPlot
    margin={{left: 20}}
    width={window.innerWidth}
    height={window.innerWidth < window.innerHeight ? window.innerWidth : window.innerHeight / 2}>
    <HorizontalGridLines />
    <LineSeries
      onNearestX={(value, evt) => props.updateCrosshair(props.showing[evt.index])}
      data={props.showing.filter(obj => obj["Close"]).map(obj => Object({x: obj["x"], y: obj["PK"]}))}/>
    <LineSeries
      data={props.showing.filter(obj => obj["Close"]).map(obj => Object({x: obj["x"], y: obj["PD"]}))}/>
    <XAxis hideTick tickLabelAngle={-90} tickFormat={val => formatDate(props.timeSeries[val].ax)}/>
    <YAxis tickPadding={-30} hideLine/>
    <Crosshair values={[props.crosshairValues]}>
      <div className="crossHair">
        <h4>{props.crosshairValues.ax}</h4>
        <p>%K: {props.crosshairValues.PK}</p>
        <p>%D: {props.crosshairValues.PD}</p>
      </div>
    </Crosshair>
  </XYPlot>
);

export default class TimeSeries extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      timeSeries: [],
      timeSeriesLength: 60 + 26,
      showing: [],
      crosshairValues: []
    }
  }

  componentDidMount() {
    fetch("http://13.114.87.249/data")
      .then(res => res.json())
      .then(jsonData => this.setState({timeSeries: jsonData, showing: jsonData.slice(-this.state.timeSeriesLength)}))
  }

  updateCrosshair(newObj) {
    this.setState({crosshairValues: newObj});
  }

  render() {
    return this.state.timeSeries.length > 0 ? (
      <div id="cambus">
        <MainSeries {...this.state} updateCrosshair={this.updateCrosshair.bind(this)}/>
        <MACDSeries {...this.state} updateCrosshair={this.updateCrosshair.bind(this)}/>
        <DMISeries {...this.state} updateCrosshair={this.updateCrosshair.bind(this)}/>
        <ItimokuSeries {...this.state} updateCrosshair={this.updateCrosshair.bind(this)}/>
      </div>
    ) : (
      <div id="loading">
        <Spinner name="ball-grid-beat"/>
      </div>
    )
  }
}
