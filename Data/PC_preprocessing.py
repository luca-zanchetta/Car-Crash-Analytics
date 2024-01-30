import pandas as pd

def encode(orignial_set):
    encoding_dict = {value:code for code, value in enumerate(orignial_set)}
    return encoding_dict

"""
Attributes (initial):
Junction_Control
Junction_Detail
Light_Conditions
Road_Surface_Conditions
Road_Type
Urban_or_Rural_Area
Weather_Conditions
Vehicle_Type
"""

data = pd.read_csv('./va-project/public/dataset.csv')
ids = []

for index, row in data.iterrows():
    ids.append(index)

data['Id'] = ids

junction_control = set()
junction_detail = set()
light_conditions = set()
road_surface_conditions = set()
road_type = set()
weather_conditions = set()
vehicle_type = set()

vehicles = []

for index, row in data.iterrows():
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

data['Vehicle_Type'] = vehicles

# Create sets of unique values
for index, row in data.iterrows():
    junction_control.add(row['Junction_Control'])                   # 5 ok
    junction_detail.add(row['Junction_Detail'])                     # 9 ok
    light_conditions.add(row['Light_Conditions'])                   # 5 ok
    road_surface_conditions.add(row['Road_Surface_Conditions'])     # 4 ok
    road_type.add(row['Road_Type'])                                 # 5 ok
    weather_conditions.add(row['Weather_Conditions'])               # 7 ok

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

for index, row in data.iterrows():
    jc.append(junction_control_enc[row['Junction_Control']])
    jd.append(junction_detail_enc[row['Junction_Detail']])
    lc.append(light_conditions_enc[row['Light_Conditions']])
    rsc.append(road_surface_conditions_enc[row['Road_Surface_Conditions']])
    rt.append(road_type_enc[row['Road_Type']])
    wc.append(weather_conditions_enc[row['Weather_Conditions']])
    vt.append(vehicle_type_enc[row['Vehicle_Type']])

data['Junction_Control'] = jc
data['Junction_Detail'] = jd
data['Light_Conditions'] = lc
data['Road_Surface_Conditions'] = rsc
data['Road_Type'] = rt
data['Weather_Conditions'] = wc
data['Vehicle_Type'] = vt

data.to_csv('./va-project/public/dataset.csv', index=False, sep=',')