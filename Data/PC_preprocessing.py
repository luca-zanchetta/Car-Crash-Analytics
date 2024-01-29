import pandas as pd

def encode(orignial_set):
    encoding_dict = {value:code for code, value in enumerate(orignial_set)}
    encoded_set = {encoding_dict[value] for value in orignial_set}
    return encoded_set

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

data = pd.read_csv('./Data/dataset.csv')

junction_control = set()
junction_detail = set()
light_conditions = set()
road_surface_conditions = set()
road_type = set()
urban_rural = set()
weather_conditions = set()
vehicle_type = set()

# Create sets of unique values
for index, row in data.iterrows():
    junction_control.add(row['Junction_Control'])                   # 5 ok
    junction_detail.add(row['Junction_Detail'])                     # 9 ok?
    light_conditions.add(row['Light_Conditions'])                   # 5 ok
    road_surface_conditions.add(row['Road_Surface_Conditions'])     # 4 ok
    road_type.add(row['Road_Type'])                                 # 5 ok
    urban_rural.add(row['Urban_or_Rural_Area'])                     # 1 (forse abbiamo preso righe sbagliate)
    weather_conditions.add(row['Weather_Conditions'])               # 7 ok
    vehicle_type.add(row['Vehicle_Type'])                           # 13


# Encode the sets
junction_control_enc = encode(junction_control)
junction_detail_enc = encode(junction_detail)
light_conditions_enc = encode(light_conditions)
road_surface_conditions_enc = encode(road_surface_conditions)
road_type_enc = encode(road_type)
urban_rural_enc = encode(urban_rural)
weather_conditions_enc = encode(weather_conditions)
vehicle_type = encode(vehicle_type)