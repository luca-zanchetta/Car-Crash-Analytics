export function ExtractFeatures(Data, Features) {
    var newData = [];
    Data.map( entry => {
        var newEntry = []
        Features.map(feature => {
            newEntry.push(entry[feature])
        })
        newData.push(newEntry)
    })

    console.log(newData)
    return newData;
}