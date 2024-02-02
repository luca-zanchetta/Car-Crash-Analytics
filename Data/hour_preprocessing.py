import pandas as pd

# fasce orarie: 0-3, 3-6, 6-9, 9-12, 12-15, 15-18, 18-21, 21-24

data = pd.read_csv('./va-project/public/dataset.csv')
hourly_intervals = []

time = data['Time']
for elem in time:
    value = int(elem[:-3])
    if 0 <= value < 3:
        hourly_intervals.append("0-3")
    elif 3 <= value < 6:
        hourly_intervals.append("3-6")
    elif 6 <= value < 9:
        hourly_intervals.append("6-9")
    elif 9 <= value < 12:
        hourly_intervals.append("9-12")
    elif 12 <= value < 15:
        hourly_intervals.append("12-15")
    elif 15 <= value < 18:
        hourly_intervals.append("15-18")
    elif 18 <= value < 21:
        hourly_intervals.append("18-21")
    elif 21 <= value < 24:
        hourly_intervals.append("21-24")
data['Time_interval'] = hourly_intervals

data.to_csv('./va-project/public/dataset.csv', index=False, sep=',')