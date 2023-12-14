function getVideosFromChannels(chIds) {
    console.log(`searching for channels: ${chIds}`)
    var vIds = []


    chIds.forEach(chId => {
        var url = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&eventType=live&maxResults=1&q=${chId}&type=video&key=${api_key}`
        fetch(url)
            .then(response => response.json())
            .then(response => {
                if (response == null) {
                    console.log("empty response", chId)
                    return
                }
                response.items.forEach(resultItem => {
                    var id = resultItem.id.videoId
                    console.log("video found", chId, resultItem.snippet.channelTitle, id, resultItem.snippet.title)
                    addNewVideo(id)
                })
            })
            .catch(ex => {
                console.error("error getting channel info", ex)
            })
    })
    console.log(vIds)
    return vIds
}