export function ExtractFeatures(Data, Features) {
    var newData = [];
    Data.map( entry => {
        var newEntry = []
        Features.map(feature => {
            newEntry.push(entry[feature])
        })
        newData.push(newEntry)
    })

   
    return newData;
}

export function CreateTooltipStringFromData(Data, Features) {
    var newData = ExtractFeatures(Data, Features)
    var stringsList = []

    for(const elem of newData) {
        var string =
        "Number of Causalities: "+elem[0]+"\n"+
        "Number of Vehicles: "+elem[1]+"\n"+
        "Speed limit: "+elem[2]+"\n"+
        "Latitude: "+elem[3]+"\n"+
        "Longitude: "+elem[4]
        stringsList.push(string)
    }

    return stringsList
}