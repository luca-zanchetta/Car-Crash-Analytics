import pandas as pd
import matplotlib.pyplot as plt
from sklearn.manifold import TSNE
from sklearn import preprocessing


df = pd.read_csv('./va-project/public/dataset.csv')
selected_columns = ['Number_of_Casualties', 'Number_of_Vehicles', 'Speed_limit', 'Latitude', 'Longitude', 'Accident_Severity']
filtered_df = df[selected_columns]

data = filtered_df.values
std_scale = preprocessing.StandardScaler().fit(data)
data = std_scale.transform(data)

data_tsne = TSNE().fit_transform(data)
x, y =  data_tsne[:, 0], data_tsne[:, 1]
plt.scatter(x, y)
plt.show()