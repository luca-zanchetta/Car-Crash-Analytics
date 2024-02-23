import { filter, max } from "d3"
import { columns } from "../App"

export function FilterData(data,_filters,mapFilters, scatterplotFilter) {
    var filters = SortFilters(_filters)
    var newData = []
    if(filters.length == 0) return data

    
    console.log("filter data")
    console.log(scatterplotFilter)
    data.map((d) => {
        var totalCheck = true;
        
        if(CheckMapFilters({"lat":d[columns.Latitude],"lng":d[columns.Longitude]}, mapFilters) && CheckScatter(d[columns.Id],scatterplotFilter)){    

                Object.keys(filters).forEach(function(key) {
                    const filter = filters[key];
                    // checking for a single category
                    var check = false
                    filter.map(f => {
                        if(d[key] == f)
                            check = true
                    })
                    if(!check){
                        totalCheck = false;
                    }
                    
                });
                if(totalCheck) newData.push(d)
           
        }
    })
    console.log(newData.length)
    return newData
}


function SortFilters(filters) {
    var SortedFilters = {}
    filters.map(f => {
        //check if the filter class has been added
        if(!(f[0] in SortedFilters))
            SortedFilters[f[0]] = [f[1]]
        else
            SortedFilters[f[0]].push(f[1])
    })
    
    return SortedFilters;
}

export function CheckMapFilters(point,mapFilters) {
    if(mapFilters.length === 0) return true

    var firstPoint = mapFilters[0]
    var secondPoint = mapFilters[1]
    return point.lat <= Math.max(firstPoint[0], secondPoint[0]) && point.lat >= Math.min(firstPoint[0], secondPoint[0]) && point.lng <= Math.max(firstPoint[1], secondPoint[1]) && point.lng >= Math.min(firstPoint[1], secondPoint[1])
}

function CheckScatter(id, scatterFilters) {
    if(scatterFilters.length === 0) return true

    return scatterFilters.includes(Number(id))
}

