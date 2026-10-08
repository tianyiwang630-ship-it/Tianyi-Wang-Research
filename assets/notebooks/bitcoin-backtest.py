import ccxt
import numpy as np
import pandas as pd
import talib
import matplotlib.pyplot as plt
from datetime import datetime, timedelta
import time
import matplotlib as mpl


plt.rcParams['font.sans-serif'] = ['SimHei']  
plt.rcParams['axes.unicode_minus'] = False   

class BitcoinQuantBacktest:
    def __init__(self, exchange_id='binance', symbol='BTC/USDT', timeframe='1h', 
                 initial_balance=10000, trend_ratio=0.7, mean_reversion_ratio=0.3, 
                 trend_stop_loss_pct=0.01, mr_stop_loss_pct=0.02):
        """
        初始化回测系统
        
        参数:
        exchange_id: 交易所ID
        symbol: 交易对
        timeframe: 时间周期
        initial_balance: 初始资金
        trend_ratio: 趋势跟随仓占比
        mean_reversion_ratio: 高抛低吸仓占比
        trend_stop_loss_pct: 趋势策略止损百分比 (默认1%=0.01)
        mr_stop_loss_pct: 高抛低吸策略止损百分比 (默认2%=0.02)
        """
        self.exchange_id = exchange_id
        self.symbol = symbol
        self.timeframe = timeframe
        self.initial_balance = initial_balance
        self.trend_ratio = trend_ratio
        self.mean_reversion_ratio = mean_reversion_ratio
        self.trend_stop_loss_pct = trend_stop_loss_pct
        self.mr_stop_loss_pct = mr_stop_loss_pct
        
            
        # 初始化交易所
        self.exchange = getattr(ccxt, exchange_id)({
            'enableRateLimit': True,
        })
        
        # 初始化状态变量
        self.reset()
    
    def reset(self):
        """重置回测状态"""
        self.balance = self.initial_balance
        self.trend_balance = self.initial_balance * self.trend_ratio
        self.mean_reversion_balance = self.initial_balance * self.mean_reversion_ratio
        self.trend_position = 0
        self.mean_reversion_position = 0
        self.equity_curve = []
        self.trend_equity_curve = []
        self.mean_reversion_equity_curve = []
        self.trades = []
        self.trend_position_history = []
        self.mean_reversion_position_history = []
        self.trend_entry_price = 0  # 趋势仓买入均价
        self.mr_entry_price = 0  # 高抛低吸仓买入均价
    
    def fetch_data_by_date(self, start_date, end_date):
        """
        根据日期范围获取数据
        
        参数:
        start_date: 起始日期，格式为 'YYYY-MM-DD'
        end_date: 结束日期，格式为 'YYYY-MM-DD'
        """
        print(f"正在获取 {self.symbol} 的历史数据，来源: {self.exchange_id}...")
        print(f"时间范围: {start_date} 到 {end_date}")
        
        # 将日期字符串转换为时间戳
        start_dt = datetime.strptime(start_date, '%Y-%m-%d')
        end_dt = datetime.strptime(end_date, '%Y-%m-%d')
        since = int(start_dt.timestamp() * 1000)
        end_ts = int(end_dt.timestamp() * 1000)
        
        # 获取所有数据
        all_ohlcv = []
        current_since = since
        
        timeframe_ms = {
            '1m': 60 * 1000,
            '5m': 5 * 60 * 1000,
            '15m': 15 * 60 * 1000,
            '30m': 30 * 60 * 1000,
            '1h': 60 * 60 * 1000,
            '2h': 2 * 60 * 60 * 1000,
            '4h': 4 * 60 * 60 * 1000,
            '6h': 6 * 60 * 60 * 1000,
            '12h': 12 * 60 * 60 * 1000,
            '1d': 24 * 60 * 60 * 1000,
            '1w': 7 * 24 * 60 * 60 * 1000,
        }
        
        if self.timeframe not in timeframe_ms:
            raise ValueError(f"Unsupported timeframe: {self.timeframe}")
        
        limit = 1000
        
        while current_since < end_ts:
            try:
                ohlcv = self.exchange.fetch_ohlcv(
                    self.symbol, 
                    self.timeframe, 
                    since=current_since, 
                    limit=limit
                )
                
                if not ohlcv:
                    break
                
                if ohlcv[-1][0] > end_ts:
                    ohlcv = [c for c in ohlcv if c[0] <= end_ts]
                    all_ohlcv.extend(ohlcv)
                    break
                
                all_ohlcv.extend(ohlcv)
                
                current_since = ohlcv[-1][0] + timeframe_ms[self.timeframe]
                
                current_dt = datetime.fromtimestamp(ohlcv[-1][0] / 1000)
                print(f"数据获取进度: {current_dt.strftime('%Y-%m-%d')}")
                
                time.sleep(0.1)
                
            except Exception as e:
                print(f"数据获取错误: {e}")
                break
        
        if not all_ohlcv:
            raise ValueError("未获取到数据，请检查日期范围和交易对")
        
        # 转换为DataFrame
        df = pd.DataFrame(all_ohlcv, columns=['timestamp', 'open', 'high', 'low', 'close', 'volume'])
        df['timestamp'] = pd.to_datetime(df['timestamp'], unit='ms')
        df.set_index('timestamp', inplace=True)
        
        # 计算技术指标
        df['ema12'] = talib.EMA(df['close'], timeperiod=12)
        df['ema20'] = talib.EMA(df['close'], timeperiod=20)
        
        # 计算布林带
        df['upper_band'], df['middle_band'], df['lower_band'] = talib.BBANDS(
            df['close'], timeperiod=20, nbdevup=2, nbdevdn=2, matype=0)
        
        # 计算ADX
        df['adx'] = talib.ADX(df['high'], df['low'], df['close'], timeperiod=14)
        
        # 移除NaN值
        df = df.dropna()
        
        print(f"共获取 {len(df)} 根K线数据")
        return df
    
    def calculate_max_drawdown(self, equity_curve):
        """计算最大回撤"""
        if not equity_curve:
            return 0, 0, 0, 0
        
        equity_array = np.array(equity_curve)
        
        peak = np.maximum.accumulate(equity_array)
        
        drawdown = (peak - equity_array) / peak
        
        max_drawdown = np.max(drawdown)
        max_drawdown_idx = np.argmax(drawdown)
        
        peak_idx = np.argmax(equity_array[:max_drawdown_idx])
        
        return max_drawdown, peak_idx, max_drawdown_idx, drawdown
    
    def run_backtest(self, data):
        """运行回测"""
        print("开始运行回测...")
        
        for i in range(1, len(data)):
            current_data = data.iloc[i]
            prev_data = data.iloc[i-1]
            current_price = current_data['close']
            current_time = data.index[i]
            
            # 趋势跟随仓策略
            self.trend_strategy(current_data, prev_data, current_price, current_time)
            
            # 高抛低吸仓策略
            self.mean_reversion_strategy(current_data, current_price, current_time)
            
            # 记录权益曲线
            total_equity = self.trend_balance + self.trend_position * current_price + \
                          self.mean_reversion_balance + self.mean_reversion_position * current_price
            self.equity_curve.append(total_equity)
            self.trend_equity_curve.append(self.trend_balance + self.trend_position * current_price)
            self.mean_reversion_equity_curve.append(
                self.mean_reversion_balance + self.mean_reversion_position * current_price)
            
            self.trend_position_history.append(self.trend_position)
            self.mean_reversion_position_history.append(self.mean_reversion_position)
        
        final_equity = self.equity_curve[-1] if self.equity_curve else self.initial_balance
        total_return = (final_equity - self.initial_balance) / self.initial_balance * 100

        max_drawdown, peak_idx, drawdown_idx, drawdown_curve = self.calculate_max_drawdown(self.equity_curve)
        
        print(f"回测完成！")
        print(f"初始资金: ${self.initial_balance:,.2f}")
        print(f"最终资产: ${final_equity:,.2f}")
        print(f"总收益率: {total_return:.2f}%")
        print(f"最大回撤: {max_drawdown*100:.2f}%")
        
        return {
            'initial_balance': self.initial_balance,
            'final_equity': final_equity,
            'total_return': total_return,
            'max_drawdown': max_drawdown,
            'drawdown_peak_idx': peak_idx,
            'drawdown_trough_idx': drawdown_idx,
            'drawdown_curve': drawdown_curve,
            'equity_curve': self.equity_curve,
            'trend_equity_curve': self.trend_equity_curve,
            'mean_reversion_equity_curve': self.mean_reversion_equity_curve,
            'trades': self.trades
        }
    
    def trend_strategy(self, current_data, prev_data, current_price, current_time):
        """趋势跟随仓策略"""
        ema12_current = current_data['ema12']
        ema20_current = current_data['ema20']
        ema12_prev = prev_data['ema12']
        ema20_prev = prev_data['ema20']
        adx = current_data['adx']
        
        golden_cross = ema12_prev <= ema20_prev and ema12_current > ema20_current
        
        death_cross = ema12_prev >= ema20_prev and ema12_current < ema20_current
        
        stop_loss_triggered = False
        if self.trend_position > 0 and self.trend_entry_price > 0 and adx < 30 and adx > 15:
            loss_pct = (self.trend_entry_price - current_price) / self.trend_entry_price
            if loss_pct >= self.trend_stop_loss_pct:
                stop_loss_triggered = True

        if golden_cross and self.trend_position == 0 :
            self.trend_position = self.trend_balance / current_price
            self.trend_entry_price = current_price
            self.trend_balance = 0
            self.trades.append({
                'time': current_time,
                'type': 'Trend Buy',
                'price': current_price,
                'amount': self.trend_position,
                'value': self.trend_position * current_price
            })
        
        elif (death_cross or stop_loss_triggered) and self.trend_position > 0:
            self.trend_balance = self.trend_position * current_price
            trade_type = 'Trend Stop Loss' if stop_loss_triggered else 'Trend Sell'
            self.trades.append({
                'time': current_time,
                'type': trade_type,
                'price': current_price,
                'amount': self.trend_position,
                'value': self.trend_balance
            })
            self.trend_position = 0
            self.trend_entry_price = 0 
    
    def mean_reversion_strategy(self, current_data, current_price, current_time):
        """高抛低吸仓策略"""
        adx = current_data['adx']
        upper_band = current_data['upper_band']
        lower_band = current_data['lower_band']
        
        mr_stop_loss_triggered = False
        if self.mean_reversion_position > 0 and self.mr_entry_price > 0:
            loss_pct = (self.mr_entry_price - current_price) / self.mr_entry_price
            if loss_pct >= self.mr_stop_loss_pct:
                mr_stop_loss_triggered = True

        if self.mean_reversion_position > 0:
            should_sell = False
            sell_reason = ""
            
            if current_price > upper_band:
                should_sell = True
                sell_reason = "Mean Reversion Sell"  # 正常卖出
            elif mr_stop_loss_triggered:
                should_sell = True
                sell_reason = "Mean Reversion Stop Loss"  # 止损卖出
            
            if should_sell:
                self.mean_reversion_balance = self.mean_reversion_position * current_price
                self.trades.append({
                    'time': current_time,
                    'type': sell_reason,
                    'price': current_price,
                    'amount': self.mean_reversion_position,
                    'value': self.mean_reversion_balance
                })
                self.mean_reversion_position = 0
                self.mr_entry_price = 0 

        if adx < 25:  
            if current_price < lower_band and self.mean_reversion_balance > 0:
                self.mean_reversion_position = self.mean_reversion_balance / current_price
                self.mr_entry_price = current_price  
                self.mean_reversion_balance = 0
                self.trades.append({
                    'time': current_time,
                    'type': 'Mean Reversion Buy',
                    'price': current_price,
                    'amount': self.mean_reversion_position,
                    'value': self.mean_reversion_position * current_price
                })
    
    def plot_results(self, data, results):
        """绘制回测结果"""
        plt.figure(figsize=(15, 16))
        
        plt.subplot(5, 1, 1)
        plt.plot(data.index, data['close'], label='Price', linewidth=1)
        plt.plot(data.index, data['ema12'], label='EMA12', alpha=0.7)
        plt.plot(data.index, data['ema20'], label='EMA20', alpha=0.7)
        plt.plot(data.index, data['upper_band'], label='Upper Band', alpha=0.7, linestyle='--')
        plt.plot(data.index, data['lower_band'], label='Lower Band', alpha=0.7, linestyle='--')
        
        trend_buys = [t for t in self.trades if t['type'] == 'Trend Buy']
        trend_sells = [t for t in self.trades if t['type'] == 'Trend Sell']
        trend_stop_losses = [t for t in self.trades if t['type'] == 'Trend Stop Loss']
        mr_buys = [t for t in self.trades if t['type'] == 'Mean Reversion Buy']
        mr_sells = [t for t in self.trades if t['type'] == 'Mean Reversion Sell']
        mr_stop_losses = [t for t in self.trades if t['type'] == 'Mean Reversion Stop Loss']
        
        if trend_buys:
            buy_times = [t['time'] for t in trend_buys]
            buy_prices = [t['price'] for t in trend_buys]
            plt.scatter(buy_times, buy_prices, color='green', marker='^', s=100, label='Trend Buy', zorder=5)
        
        if trend_sells:
            sell_times = [t['time'] for t in trend_sells]
            sell_prices = [t['price'] for t in trend_sells]
            plt.scatter(sell_times, sell_prices, color='red', marker='v', s=100, label='Trend Sell', zorder=5)
        
        if trend_stop_losses:
            stop_times = [t['time'] for t in trend_stop_losses]
            stop_prices = [t['price'] for t in trend_stop_losses]
            plt.scatter(stop_times, stop_prices, color='darkred', marker='x', s=150, label='Trend Stop Loss', zorder=5)
        
        if mr_buys:
            buy_times = [t['time'] for t in mr_buys]
            buy_prices = [t['price'] for t in mr_buys]
            plt.scatter(buy_times, buy_prices, color='blue', marker='^', s=100, label='Mean Reversion Buy', zorder=5)
        
        if mr_sells:
            sell_times = [t['time'] for t in mr_sells]
            sell_prices = [t['price'] for t in mr_sells]
            plt.scatter(sell_times, sell_prices, color='orange', marker='v', s=100, label='Mean Reversion Sell', zorder=5)
        
        if mr_stop_losses:
            stop_times = [t['time'] for t in mr_stop_losses]
            stop_prices = [t['price'] for t in mr_stop_losses]
            plt.scatter(stop_times, stop_prices, color='purple', marker='x', s=150, label='Mean Reversion Stop Loss', zorder=5)
        
        plt.title(f'{self.symbol} Price and Indicators')
        plt.legend()
        plt.grid(True)
        
        plt.subplot(5, 1, 2)
        plt.plot(data.index, data['adx'], label='ADX', color='purple')
        plt.axhline(y=30, color='r', linestyle='--', label='ADX=30')
        plt.title('ADX Indicator')
        plt.legend()
        plt.grid(True)
        
        plt.subplot(5, 1, 3)
        equity_dates = data.index[1:1+len(results['equity_curve'])]
        plt.plot(equity_dates, results['equity_curve'], label='Total Equity', linewidth=2)
        plt.plot(equity_dates, results['trend_equity_curve'], label='Trend Strategy Equity', alpha=0.7)
        plt.plot(equity_dates, results['mean_reversion_equity_curve'], label='Mean Reversion Equity', alpha=0.7)
        plt.axhline(y=self.initial_balance, color='r', linestyle='--', label='Initial Balance')

        if results['max_drawdown'] > 0:
            peak_idx = results['drawdown_peak_idx']
            trough_idx = results['drawdown_trough_idx']
            if peak_idx < len(equity_dates) and trough_idx < len(equity_dates):
                peak_date = equity_dates[peak_idx]
                trough_date = equity_dates[trough_idx]
                peak_equity = results['equity_curve'][peak_idx]
                trough_equity = results['equity_curve'][trough_idx]
                
                plt.plot([peak_date, trough_date], [peak_equity, trough_equity], 
                         'r-', linewidth=2, label=f'Max Drawdown: {results["max_drawdown"]*100:.2f}%')
                plt.scatter([peak_date, trough_date], [peak_equity, trough_equity], 
                           color='red', s=100, zorder=5)
        
        plt.title('Equity Curve')
        plt.legend()
        plt.grid(True)
        
        plt.subplot(5, 1, 4)
        trend_position_value = []
        mr_position_value = []
        
        for i in range(len(self.trend_position_history)):
            current_price = data.iloc[i+1]['close'] 
            trend_pos = self.trend_position_history[i]
            mr_pos = self.mean_reversion_position_history[i]
            
            trend_position_value.append(trend_pos * current_price)
            mr_position_value.append(mr_pos * current_price)
        
        plt.plot(equity_dates, trend_position_value, label='Trend Position Value')
        plt.plot(equity_dates, mr_position_value, label='Mean Reversion Position Value')
        plt.title('Position Value Changes')
        plt.legend()
        plt.grid(True)
        
        plt.subplot(5, 1, 5)
        if results['drawdown_curve'] is not None and len(results['drawdown_curve']) > 0:
            plt.plot(equity_dates, results['drawdown_curve'] * 100, label='Drawdown', color='red')
            plt.fill_between(equity_dates, results['drawdown_curve'] * 100, 0, color='red', alpha=0.3)
            plt.axhline(y=results['max_drawdown'] * 100, color='darkred', linestyle='--', 
                       label=f'Max Drawdown: {results["max_drawdown"]*100:.2f}%')
            plt.title('Drawdown Curve')
            plt.ylabel('Drawdown (%)')
            plt.legend()
            plt.grid(True)
        
        plt.tight_layout()
        plt.show()
        
        # 打印交易记录
        # print("\n交易记录:")
        # for trade in self.trades:
        #     print(f"{trade['time']} {trade['type']} Price: {trade['price']:.2f} Amount: {trade['amount']:.6f} Value: ${trade['value']:.2f}")
        
        if results['max_drawdown'] > 0:
            peak_idx = results['drawdown_peak_idx']
            trough_idx = results['drawdown_trough_idx']
            if peak_idx < len(equity_dates) and trough_idx < len(equity_dates):
                peak_date = equity_dates[peak_idx]
                trough_date = equity_dates[trough_idx]
                peak_equity = results['equity_curve'][peak_idx]
                trough_equity = results['equity_curve'][trough_idx]
                
                print(f"\n最大回撤详情:")
                print(f"峰值日期: {peak_date}, 资产: ${peak_equity:,.2f}")
                print(f"谷底日期: {trough_date}, 资产: ${trough_equity:,.2f}")
                print(f"回撤金额: ${peak_equity - trough_equity:,.2f}")
                print(f"回撤百分比: {results['max_drawdown']*100:.2f}%")
                print(f"恢复周期: {(trough_date - peak_date).days} 天")
        
        total_trades = len(self.trades)
        trend_trades = len([t for t in self.trades if 'Trend' in t['type']])
        mr_trades = len([t for t in self.trades if 'Mean Reversion' in t['type']])
        trend_stop_loss_trades = len([t for t in self.trades if t['type'] == 'Trend Stop Loss'])
        mr_stop_loss_trades = len([t for t in self.trades if t['type'] == 'Mean Reversion Stop Loss'])
        
        print(f"\n 交易统计:")
        print(f" 总交易次数: {total_trades}")
        print(f" 趋势策略交易: {trend_trades} 次")
        print(f" - 趋势止损触发: {trend_stop_loss_trades} 次")
        print(f" 高抛低吸策略交易: {mr_trades} 次")
        print(f" - 高抛低吸止损触发: {mr_stop_loss_trades} 次")
        
        if trend_trades > 0:
            trend_stop_loss_rate = (trend_stop_loss_trades / trend_trades) * 100
            print(f"   - 趋势策略止损率: {trend_stop_loss_rate:.1f}%")
        
        if mr_trades > 0:
            mr_stop_loss_rate = (mr_stop_loss_trades / mr_trades) * 100
            print(f"   - 高抛低吸策略止损率: {mr_stop_loss_rate:.1f}%")


if __name__ == "__main__":
    backtester = BitcoinQuantBacktest(
        exchange_id='binance',
        symbol='BTC/USDT',
        timeframe='1h',
        initial_balance=100000,  # 初始资金
        trend_ratio=0.3,  # 趋势跟随仓占比
        mean_reversion_ratio=0.7,  # 高抛低吸仓占比
        trend_stop_loss_pct=0.015,  # 趋势策略止损
        mr_stop_loss_pct=0.02  # 高抛低吸策略止损
    )   
    
    print(" 比特币双策略量化回测系统（增强版）")
    print("=" * 50)
    print(f" 策略配置:")
    print(f"  - 趋势策略: {backtester.trend_ratio*100}% (止损: {backtester.trend_stop_loss_pct*100}%)")
    print(f"  - 高抛低吸策略: {backtester.mean_reversion_ratio*100}% (止损: {backtester.mr_stop_loss_pct*100}%)")
    print(f" 初始资金: ${backtester.initial_balance:,}")
    print("=" * 50)
    
    start_date = '2025-04-01'
    end_date = '2025-08-31'
    
    data = backtester.fetch_data_by_date(start_date, end_date)
    
    results = backtester.run_backtest(data)
    
    backtester.plot_results(data, results)