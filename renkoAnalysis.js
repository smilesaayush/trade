module.exports = function (renkoTileSize = 2, clubTime = 1 * 60 * 1000) {
  var i;
  var priceDiff;
  var timeDiff;
  //var renkoTileSize = 2;
  //var clubTime = 5 * 60 * 1000; //in milliseconds
  var renkoPriceDiff = 0;
  var renkoTimeDiff = 0;
  var tilePoint;
  var renko = [];
  var renkoPriceChart = [];
  var renkoTimeChart = [];
  var renkoSum = 0;
  var lprice = null;
  var ltime = null;
  var ltrend;
  var trend = null;
  var checking = null;
  var result = [];
  var renkoResult = [];

  function analyze (price, time) {
    if(!lprice) {
      lprice = price;
      ltime = time;
      tilePoint = lprice;
      renkoSum = 0;
      return;
    }

    priceDiff = price - lprice;
    timeDiff = time - ltime;
    renkoPriceDiff = (price - tilePoint).toFixed(2);
    renkoTimeDiff = renkoTimeDiff + timeDiff;

    if(renkoPriceDiff >= renkoTileSize) {
      renko.push(1);
      renkoPriceChart.push(price);
      renkoTimeChart.push(time);
      tilePoint = tilePoint + renkoTileSize;
      renkoPriceDiff = 0;
      if(trend === 0) {
        if(checking === 1) {
          trend = 1;
          checking = null;
          //console.log("buy ", price, new Date(time));
          buy(price, time);
          result.push(1);
        }
        else {
          checking = 1;
          //console.log("checking");
        }
      }
      else {
        trend = 1;
        if(checking === 0) {
          checking = null;
        }
        else {
          //console.log("buy ", price, new Date(time));
          buy(price, time);
          result.push(1);
        }
      }
    }
    else if(renkoPriceDiff <= (-1 * renkoTileSize)) {
      renko.push(0);
      renkoPriceChart.push(price);
      renkoTimeChart.push(time);
      tilePoint = tilePoint - renkoTileSize;
      renkoPriceDiff = 0;
      if(trend === 1) {
        if(checking === 0) {
          trend = 0;
          checking = null;
          //console.log("sell ", price, new Date(time));
          sell(price, time);
          result.push(0);
        }
        else {
          checking = 0;
          //console.log("checking");
        }
      }
      else {
        trend = 0;
        if(checking === 1) {
          checking = null;
        }
        else {
          //console.log("sell ", price, new Date(time));
          sell(price, time);
          result.push(0);
        }
      }
    }

    if(renkoTimeDiff >= clubTime) {
      //renko.push("-");
      //console.log(price);
      renkoTimeDiff = 0;
    }

    lprice = price;
    ltime = time;
  }

  function buy(price, time) {
    renkoResult.push({
      type: "buy",
      price,
      time
    });
  }

  function sell(price, time) {
    renkoResult.push({
      type: "sell",
      price,
      time
    });
  }

  return {
    analyze,
    renkoResult
  }

}