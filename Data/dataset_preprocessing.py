import pandas as pd

data = pd.read_csv('dataset_original.csv')

# Remove columns
data.pop('Accident_Index')
data.pop('Local_Authority_(District)')
data.pop('Carriageway_Hazards')
data.pop('Police_Force')

data.head(2900).to_csv('dataset.csv', index=False, sep=',')