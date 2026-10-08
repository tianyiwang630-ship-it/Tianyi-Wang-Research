import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
from sklearn.linear_model import LinearRegression
import matplotlib.pyplot as plt

class stkSeries():
    '''
    date format:%Y-%m-%d and end date is not reached;interval default :1h
    '''
    def __init__(self,code,start,end,interval='1h'):
        self.stk = code
        self.start = start
        self.end = end
        self.interval = interval
        self.data = self.get_series()

    def get_series(self):
        ticker = yf.Ticker(self.stk)
        stk = ticker.history(start=self.start,end=self.end,
        interval = self.interval,auto_adjust = True)[['Open','High','Low','Close','Volume']]
        return stk
    def r2_market(self,year=1,window=30):
        '''
        year: history range
        window: R2 calculate window
        '''
        #for history date 
        end_date = datetime.strptime(self.end,'%Y-%m-%d')
        start_date = end_date -relativedelta(years=year)
        start = start_date.strftime('%Y-%m-%d')##

        #get time series data
        stk = self.data['Close']#stock
        dji = stkSeries('^DJI',start = self.start,end=self.end).data['Close']#don johns
        sp500 = stkSeries('^GSPC',start = self.start,end=self.end).data['Close']#sp500
        nasdaq = stkSeries('^IXIC',start = self.start,end=self.end).data['Close']#nasdaq
        qqq = stkSeries('QQQ',start = self.start,end=self.end).data['Close']#qqq

        #history time series
        stk_h = stkSeries(self.stk,start = start, end = self.end).data['Close']
        dji_h = stkSeries('^DJI',start = start, end = self.end).data['Close']
        sp500_h = stkSeries('^GSPC',start = start, end = self.end).data['Close']
        nasdaq_h = stkSeries('^IXIC',start = start, end = self.end).data['Close']
        qqq_h = stkSeries('QQQ',start = start, end = self.end).data['Close']

        #calculate r2 function
        def lr_r2(respond, features):
            '''
            respond: series for stk 
            features: list of series of market
            '''
            df = pd.concat([respond] + features, axis=1).dropna()
            df = df.pct_change().dropna()
            y = df.iloc[:,0].to_numpy()
            X = df.iloc[:,1:].to_numpy()
            model = LinearRegression()
            model.fit(X, y)
            return model.score(X, y)
        
        def lr_r2_h(respond,features):
            '''
            respond: series for stk 
            features: list of series of market
            '''
            df = pd.concat([respond] + features, axis=1, join='inner').dropna()
            df.columns = ['y'] + [f'x{i+1}' for i in range(len(features))]

            df = df.pct_change().dropna()
            y = df['y'].to_numpy()
            X = df.drop(columns=['y']).to_numpy()
            n = len(y)
            r2_list = []
            model = LinearRegression()
            for i in range(window, n + 1):
                y_window = y[i - window:i]
                X_window = X[i - window:i]
                model.fit(X_window, y_window)
                r2 = model.score(X_window, y_window)
                r2_list.append(r2)

            return r2_list
        #current r2
        r2_dji = lr_r2(stk,[dji])
        r2_sp500 = lr_r2(stk,[sp500])
        r2_nasdaq = lr_r2(stk,[nasdaq])
        r2_qqq = lr_r2(stk,[qqq])
        r2_total = lr_r2(stk,[qqq,nasdaq,sp500])

        #history r2
        r2_dji_h = lr_r2_h(stk_h,[dji_h])
        r2_sp500_h = lr_r2_h(stk_h,[sp500_h])
        r2_nasdaq_h = lr_r2_h(stk_h,[nasdaq_h])
        r2_qqq_h = lr_r2_h(stk_h,[qqq_h])
        r2_total_h = lr_r2_h(stk_h,[qqq_h,nasdaq_h,sp500_h])

        #show
        df = pd.DataFrame({
        'dji': [
            r2_dji,
            np.mean(r2_dji_h),
            np.std(r2_dji_h)
        ],
        'sp500': [
            r2_sp500,
            np.mean(r2_sp500_h),
            np.std(r2_sp500_h)
        ],
        'nasdaq': [
            r2_nasdaq,
            np.mean(r2_nasdaq_h),
            np.std(r2_nasdaq_h)
        ],
        'qqq': [
            r2_qqq,
            np.mean(r2_qqq_h),
            np.std(r2_qqq_h)
        ],
        'total':[
            r2_total,
            np.mean(r2_total_h),
            np.std(r2_total_h)
        ],

        }, index=['current_r2', 'mean_r2_h', 'std_r2_h'])
        df.loc['percentile_h'] = [
            np.mean(np.array(r2_dji_h) <= r2_dji) * 100,
            np.mean(np.array(r2_sp500_h) <= r2_sp500) * 100,
            np.mean(np.array(r2_nasdaq_h) <= r2_nasdaq) * 100,
            np.mean(np.array(r2_qqq_h) <= r2_qqq) * 100,
            np.mean(np.array(r2_total_h) <= r2_total) * 100

        ]
        return df
    def residual_plot(self,features):
        '''
        features to explain the stock; use LR to get the residuals
        '''
        stk = self.data['Close'].pct_change().dropna()
        n = len(features)
        predictors = []###features return time series


        for i in features:
            series = stkSeries(i,start = self.start,end = self.end, interval = self.interval).data['Close']
            series = series.pct_change().dropna()
            predictors.append(series)
            
        X = pd.concat(predictors, axis=1, join='inner')
        X = X.dropna()
        stk = stk.loc[X.index] 

        y = stk.to_numpy()
        X = X.to_numpy()
        print(stk.shape[0],X.shape[0],y.shape[0])
        
        model = LinearRegression(n_jobs=-1)
        model.fit(X,y)

    
        ypred = model.predict(X)
        residual = y-ypred
        res = pd.Series(residual,index = stk.index)
        plt.figure(figsize=(10,5))
        plt.plot(res.index, residual, label='Residuals')
        plt.scatter(res.index, residual, s=6, color='blue', alpha=0.6)  # s 越小点越小，如 4~10
        plt.axhline(0, color='r', linestyle='--', linewidth=1)
        plt.title('Residual Plot (using original return index)')
        plt.xlabel('Date')
        plt.ylabel('Residual')
        plt.legend()
        plt.show()
    def diff_plot(self,b):
        stk = self.data['Close'].pct_change().dropna()
        b = stkSeries(b,start = self.start,end = self.end, interval = self.interval).data['Close'].pct_change().dropna()
        diff = stk-b
        plt.figure(figsize=(10,5))
        plt.plot(diff.index, diff.to_numpy(), label='diff')
        plt.scatter(diff.index, diff.to_numpy(), s=6, color='blue', alpha=0.6)  # s 越小点越小，如 4~10
        plt.axhline(0, color='r', linestyle='--', linewidth=1)
        plt.title('diff Plot (using original return index)')
        plt.xlabel('Date')
        plt.ylabel('diff')
        plt.legend()
        plt.show()


            
