Application to watch multiple youtube videos at the same time.

Installation / Deploy:

``` docker run -p 5555:80 guillemarcel04/multivideo ```

Usage: Call the mail endpoint with the next params:
 * videos: coma separated list of youtube videos ids

``` <<base_url>>/?videos=vidId1,vidId2,vidId3 ```

Example 

```http://localhost:5555/?videos=4e8Iw3Frf1A,cb12KmMMDJA,QGpHLgRnrx4```


Shortcuts:
* 1, 2, 3... : Hear the n videos, silence everything else
* m: Mute all
* Ctrl + 1: Load the video you have in the clipboard in the first position