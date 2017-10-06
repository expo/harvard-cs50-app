# Integration

## Course Data

The app reads the data from a JSON object that is located in `data/`. The current data was generated from the XML files provided by Harvard in the `xml` dir. `utils/data-loader.js` transforms the XML into the data in `data/Data.js`. Currently, we have data for the 2016 edition and the 2017 edition of the class.

`weekNumber` determines the current week that the class is in i.e. the week tile that is displayed when the app is started. This is set in `data/currentWeek.js`.

If you modify the data in `data/`, and publish the app to Expo, all users with native installs will pick it up the next time they start their app.

## Video

Harvard provided us with a set of mp4 URLs hosted on their CDN. The JSON associated with each video looks something like:

```
"240p": "http://cdn.cs50.net/2016/fall/lectures/0/week0-240p.mp4",
"360p": "http://cdn.cs50.net/2016/fall/lectures/0/week0-360p.mp4",
"720p": "http://cdn.cs50.net/2016/fall/lectures/0/week0-720p.mp4",
"1080p": "http://cdn.cs50.net/2016/fall/lectures/0/week0-1080p.mp4",
"4k": "http://cdn.cs50.net/2016/fall/lectures/0/week0-4k.mp4",
```

## HLS Streaming

HLS Streaming would be the preferred approach to stream videos as it allows for streaming . It's really straightforward to use ffmpeg to convert a list of mp4 into HLS content. You can also use the AWS elastic transcoder.

## Offline videos

When we download a video, we will use the 360p version of the video (file size, on the order of 300MB-500MB). Or we could use 240p versions of the video (100-200MB). Explore other compressions options to get high quality but small files. In the file `utils/DownloadManager.js`, `_startDownloadForId` is where the selection of the stream to download is made.