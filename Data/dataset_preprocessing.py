import pandas as pd
from sklearn.manifold import TSNE
from sklearn import preprocessing

# Function for encoding some attributes (see later)
def encode(orignial_set):
    encoding_dict = {value:code for code, value in enumerate(orignial_set)}
    return encoding_dict
severity_enc = {'Slight':0, 'Serious':1, 'Fatal':2}


df = pd.read_csv('./va-project/public/dataset_original.csv')

# Remove unnecessary columns
df.pop('Accident_Index')
df.pop('Local_Authority_(District)')
df.pop('Carriageway_Hazards')
df.pop('Police_Force')

# Take the first 2900 rows for simplicity
df = df.head(2900)


################################### Time interval preprocessing ##########################################
hourly_intervals = []
time = df['Time']

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

df['Time_interval'] = hourly_intervals


###################################### Add IDs to the data ###################################
ids = []

for index, row in df.iterrows():
    ids.append(index)

df['Id'] = ids


########################### Parallel coordinates encoding and preprocessing ############################
junction_control = set()
junction_detail = set()
light_conditions = set()
road_surface_conditions = set()
road_type = set()
weather_conditions = set()
vehicle_type = set()

vehicles = []

for index, row in df.iterrows():
    vehicle = row['Vehicle_Type']
    
    if vehicle == 'Car':
        vehicles.append('Car')
    elif vehicle == 'Motorcycle over 500cc':
        vehicles.append('Motorcycle')
    elif vehicle == 'Motorcycle 50cc and under':
        vehicles.append('Motorcycle')
    elif vehicle == 'Minibus (8 - 16 passenger seats)':
        vehicles.append('Minibus')
    elif vehicle == 'Motorcycle 125cc and under':
        vehicles.append('Motorcycle')
    elif vehicle == 'Goods over 3.5t. and under 7.5t':
        vehicles.append('Good')
    elif vehicle == 'Taxi/Private hire car':
        vehicles.append('Car')
    elif vehicle == 'Bus or coach (17 or more pass seats)':
        vehicles.append('Bus')
    elif vehicle == 'Motorcycle over 125cc and up to 500cc':
        vehicles.append('Motorcycle')
    elif vehicle == 'Agricultural vehicle':
        vehicles.append('Agricultural vehicle')
    elif vehicle == 'Goods 7.5 tonnes mgw and over':
        vehicles.append('Good')
    elif vehicle == 'Van / Goods 3.5 tonnes mgw or under':
        vehicles.append('Good')
    else:
        vehicles.append('Other vehicle')

df['Vehicle_Type'] = vehicles

# Create sets of unique values
for index, row in df.iterrows():
    junction_control.add(row['Junction_Control'])                  
    junction_detail.add(row['Junction_Detail'])                    
    light_conditions.add(row['Light_Conditions'])                  
    road_surface_conditions.add(row['Road_Surface_Conditions'])    
    road_type.add(row['Road_Type'])                                 
    weather_conditions.add(row['Weather_Conditions'])              

for v in vehicles:
    vehicle_type.add(v)

# Encode the sets
junction_control_enc = encode(junction_control)
junction_detail_enc = encode(junction_detail)
light_conditions_enc = encode(light_conditions)
road_surface_conditions_enc = encode(road_surface_conditions)
road_type_enc = encode(road_type)
weather_conditions_enc = encode(weather_conditions)
vehicle_type_enc = encode(vehicle_type)

jc = []
jd = []
lc = []
rsc = []
rt = []
wc = []
vt = []

for index, row in df.iterrows():
    jc.append(junction_control_enc[row['Junction_Control']])
    jd.append(junction_detail_enc[row['Junction_Detail']])
    lc.append(light_conditions_enc[row['Light_Conditions']])
    rsc.append(road_surface_conditions_enc[row['Road_Surface_Conditions']])
    rt.append(road_type_enc[row['Road_Type']])
    wc.append(weather_conditions_enc[row['Weather_Conditions']])
    vt.append(vehicle_type_enc[row['Vehicle_Type']])

df['Junction_Control'] = jc
df['Junction_Detail'] = jd
df['Light_Conditions'] = lc
df['Road_Surface_Conditions'] = rsc
df['Road_Type'] = rt
df['Weather_Conditions'] = wc
df['Vehicle_Type'] = vt


############################### Dimensionality reduction preprocessing ##################################
selected_columns = ['Number_of_Casualties', 'Number_of_Vehicles', 'Speed_limit', 'Latitude', 'Longitude', 'Accident_Severity']
filtered_df = df[selected_columns]

severity = []
for item in filtered_df['Accident_Severity']:
    if item == 'Slight':
        severity.append(severity_enc['Slight'])
    elif item == 'Serious':
        severity.append(severity_enc['Serious'])
    else:
        severity.append(severity_enc['Fatal'])
df['Accident_Severity'] = severity

df.sort_values(by='Accident_Severity')
filtered_df = df[selected_columns]


data = filtered_df.values
std_scale = preprocessing.StandardScaler().fit(data)
data = std_scale.transform(data)

data_tsne = TSNE().fit_transform(data)
x, y =  data_tsne[:, 0], data_tsne[:, 1]

df['tsne_x'] = x
df['tsne_y'] = y

df.to_csv('./va-project/public/dataset.csv', index=False, sep=',')