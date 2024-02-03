import pandas as pd
import matplotlib.pyplot as plt
from sklearn.manifold import TSNE
from sklearn import preprocessing

"""
0: 0 - 2202
1: 2203 - 2568
2: 2569 - 2899
"""

df = pd.read_csv('./va-project/public/dataset.csv')
selected_columns = ['Number_of_Casualties', 'Number_of_Vehicles', 'Speed_limit', 'Latitude', 'Longitude', 'Accident_Severity']
filtered_df = df[selected_columns]

data = filtered_df.values
std_scale = preprocessing.StandardScaler().fit(data)
data = std_scale.transform(data)

data_tsne = TSNE().fit_transform(data)
x, y =  data_tsne[:, 0], data_tsne[:, 1]

s=30
plt.scatter(x[0:2202], y[0:2202], color='red',s=s, lw=0, label='t-SNE Cluster 1')
plt.scatter(x[2203:2568], y[2203:2568], color='green',s=s, lw=0, label='t-SNE Cluster 2')
plt.scatter(x[2569:2899], y[2569:2899], color='blue',s=s, lw=0, label='t-SNE Cluster 3')
plt.legend(scatterpoints=1, loc='best', shadow=False)

plt.show()