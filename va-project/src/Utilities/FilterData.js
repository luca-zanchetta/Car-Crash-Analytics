export function FilterData(data,filters) {
    var newData = []
    if(filters.length == 0) return data
    data.map((d) => {
        var check = false
        filters.map(f => {
            console.log(d[f[0]])
            if(d[f[0]] == f[1])
                check = true
        })

        if(check) newData.push(d)
    })
    console.log(newData)
    return newData
}