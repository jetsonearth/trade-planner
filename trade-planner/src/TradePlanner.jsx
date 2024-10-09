import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";

const TradePlanner = () => {
  const [portfolioValue, setPortfolioValue] = useState('');
  const [entryPrice, setEntryPrice] = useState('');
  const [atrPercentage, setAtrPercentage] = useState('');
  const [lowOfDay, setLowOfDay] = useState('');
  const [profitRatio, setProfitRatio] = useState('');

  const calculateStopLoss = () => {
    const price = parseFloat(entryPrice);
    const atrStop = price - (price * parseFloat(atrPercentage) / 100);
    const lodStop = parseFloat(lowOfDay);
    const maxStopLoss = price * 0.93; // 7% max stop loss

    let stopLoss = Math.max(atrStop, lodStop);
    stopLoss = Math.max(stopLoss, maxStopLoss);

    let logic = '';
    if (stopLoss === atrStop) {
      logic = 'ATR-based';
    } else if (stopLoss === lodStop) {
      logic = 'Low of Day';
    } else {
      logic = '7% Max Loss';
    }

    return { price: stopLoss.toFixed(2), logic };
  };

  const calculatePositionDetails = (percentage) => {
    const positionSize = parseFloat(portfolioValue) * (percentage / 100);
    const shares = positionSize / parseFloat(entryPrice);
    const { price: stopLossPrice } = calculateStopLoss();
    const riskPerShare = parseFloat(entryPrice) - parseFloat(stopLossPrice);
    const riskAmount = riskPerShare * shares;
    const riskPercentage = (riskAmount / parseFloat(portfolioValue)) * 100;

    return {
      shares: shares.toFixed(2),
      riskAmount: riskAmount.toFixed(2),
      riskPercentage: riskPercentage.toFixed(2)
    };
  };

  const calculateProfitTarget = () => {
    const { price: stopLossPrice } = calculateStopLoss();
    const entry = parseFloat(entryPrice);
    const risk = entry - parseFloat(stopLossPrice);
    return (entry + (risk * parseFloat(profitRatio))).toFixed(2);
  };

  const { price: stopLossPrice, logic: stopLossLogic } = calculateStopLoss();
  const positionSizes = [5, 10, 15, 20];

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 flex flex-col" style={{ fontFamily: "'Libre Baskerville', serif" }}>
      <div className="max-w-6xl mx-auto flex-grow w-full">
        <Card className="bg-gray-800 shadow-lg rounded-lg overflow-hidden border border-gray-700">
          <CardHeader className="bg-gray-800 p-6">
            <CardTitle className="text-4xl font-bold text-center text-orange-500">Trade Planner</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-2 gap-8 mb-8">
              {[
                { id: 'portfolioValue', label: 'Portfolio Value ($)', value: portfolioValue, setter: setPortfolioValue },
                { id: 'entryPrice', label: 'Entry Price ($)', value: entryPrice, setter: setEntryPrice },
                { id: 'atrPercentage', label: 'ATR Percentage (%)', value: atrPercentage, setter: setAtrPercentage },
                { id: 'lowOfDay', label: 'Low of Day ($)', value: lowOfDay, setter: setLowOfDay },
                { id: 'profitRatio', label: 'Profit/Risk Ratio', value: profitRatio, setter: setProfitRatio }
              ].map((field) => (
                <div key={field.id}>
                  <Label htmlFor={field.id} className="text-xl font-medium text-orange-400 mb-2">{field.label}</Label>
                  <Input
                    id={field.id}
                    type="number"
                    value={field.value}
                    onChange={(e) => field.setter(e.target.value)}
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                    className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-orange-500 focus:ring focus:ring-orange-500 focus:ring-opacity-50 text-xl p-4"
                  />
                </div>
              ))}
            </div>

            {portfolioValue && entryPrice && atrPercentage && lowOfDay && profitRatio && (
              <div className="space-y-8">
                <div className="grid grid-cols-2 gap-8">
                  <div className="text-2xl font-semibold text-orange-400 bg-gray-700 p-6 rounded-md h-full">
                    <span>Stop Loss: ${stopLossPrice}</span>
                    <span className="block text-xl text-orange-300 mt-2">({stopLossLogic})</span>
                  </div>
                  <div className="text-2xl font-semibold text-orange-400 bg-gray-700 p-6 rounded-md h-full">
                    <span>Profit Target: ${calculateProfitTarget()}</span>
                    <span className="block text-xl text-orange-300 mt-2">({profitRatio}:1 ratio)</span>
                  </div>
                </div>
                <div className="bg-gray-700 p-6 rounded-md">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-2xl font-semibold text-orange-400">Position Size</div>
                    <div className="text-2xl font-semibold text-orange-400">Risk</div>
                    {positionSizes.map((size) => {
                      const { shares, riskAmount, riskPercentage } = calculatePositionDetails(size);
                      return (
                        <React.Fragment key={size}>
                          <div className="text-xl">
                            <span className="text-orange-300">{size}%:</span>
                            <span className="font-medium text-orange-400 ml-2">{shares} shares</span>
                          </div>
                          <div className="text-xl">
                            <span className="text-orange-300">${riskAmount}</span>
                            <span className="text-orange-400 ml-2">({riskPercentage}%)</span>
                          </div>
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <footer className="mt-8 text-center text-orange-400 text-lg">
        Made by Jetson 🤝
      </footer>
    </div>
  );
};

export default TradePlanner;