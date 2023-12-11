Application to watch multiple youtube videos at the same time.

## Installation / Deploy:

``` docker run -p 5555:80 guillemarcel04/multivideo ```

## Usage
Call the mail endpoint with the next params:
 * videos: coma separated list of youtube videos ids

``` <<base_url>>/?videos=vidId1,vidId2,vidId3 ```

Example 

```http://localhost:5555/?videos=4e8Iw3Frf1A,cb12KmMMDJA,QGpHLgRnrx4```

## Use Online:

You can use, for now, use the version I have deployed here:

https://multivideo.francelsoft.com/?videos=....

ex.
https://multivideo.francelsoft.com/?videos=4e8Iw3Frf1A,cb12KmMMDJA


## Shortcuts
* 1, 2, 3... : Hear the n videos, silence everything else
* m: Mute all
* Ctrl + 1: Load the video you have in the clipboard in the first position

![alt text](https://github.com/GuillermoMarcel/multivideo/blob/master/extras/screenshot.png?raw=true)

## BUILD 
``` docker build -t guillemarcel04/multivideo:0.7 -t guillemarcel04/multivideo:latest . ```