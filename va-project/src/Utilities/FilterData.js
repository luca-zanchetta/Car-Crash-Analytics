import { filter } from "d3"

export function FilterData(data,_filters) {
    var filters = SortFilters(_filters)
    var newData = []
    if(filters.length == 0) return data

    data.map((d) => {
        var totalCheck = true;
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
    })
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