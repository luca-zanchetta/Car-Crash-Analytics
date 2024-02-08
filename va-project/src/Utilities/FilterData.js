import { filter } from "d3"

export function FilterData(data,filters) {
    console.log(filters)
    var newData = []
    if(filters.length == 0) return data
    data.map((d) => {
        var check = true
        filters.map(f => {
            if(d[f[0]] != f[1])
                check = false
        })
        if(check) newData.push(d)
    })
    return newData
}