import pandas as pd

data = pd.read_csv('./va-project/public/dataset_original.csv')

# Remove columns
data.pop('Accident_Index')
data.pop('Local_Authority_(District)')
data.pop('Carriageway_Hazards')
data.pop('Police_Force')

data.head(2900).to_csv('./va-project/public/dataset.csv', index=False, sep=',')