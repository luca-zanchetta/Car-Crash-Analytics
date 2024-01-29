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