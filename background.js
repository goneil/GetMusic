$( function() {
    var currentSongTitle  = undefined
    var currentSongArtist = undefined
    var currentSongAlbum  = undefined
    var currentSongUrl    = undefined

    // Setup the listener for pandora's outgoing requests
    chrome.webRequest.onBeforeRequest.addListener( function( details ) {

        // Test the url against a regex of the different locations the songs live!
        if ( urlMatch( details.url ) ) {

            // Save the url for later
            currentSongUrl = details.url

            // Set timeout of 10 seconds to let the page load.  This way we can get
            // song title, artist and album
            setTimeout(function() {
              downloadSong(currentSongUrl, currentSongTitle, currentSongArtist, currentSongAlbum)
            }, 10000)


        }
    },
    { urls: ['<all_urls>'] });

    // Logs message to console along with extra metadata
    function send_info( message ) {
        var d = new Date();
        console.log( d.toLocaleString() + ' - ' + message );
    }


    // Listen to the message from the content script to attempt to download a song!
    chrome.runtime.onMessage.addListener( function( request, sender, sendResponse ) {

        var song = '(' + request.title + ' - ' + request.artist + ')';

        // Set current song info
        currentSongTitle  = request.title
        currentSongArtist = request.artist
        currentSongAlbum  = request.album

        // The song url has been captured, lets download it!
        send_info( 'Captured info for ' + song )
    });


    function downloadSong(url, title, artist, album) {
        send_info("Downloading song from url: " + url)
        var song = '(' + title + ' - ' + artist + ')';
        // Send the url to a python server we're running to download the song!
        $.ajax({
            type: 'POST',
            url: 'http://127.0.0.1:5000/download',
            data: {
                url   : url,
                title : title,
                artist: artist,
                album : album
            },
            success: function( data ) {
                if ( data.status == 'fail' ) {
                    send_info( song + ' has already been downloaded!' )
                }
                if ( data.status == 'success' ) {
                    send_info( song + ' has been successfully downloaded!' )
                }
            },
            dataType: 'json',
            async: false
        })
        .fail(function(){
            send_info( 'The web server isn\'t running!' );
        });
    }

    function urlMatch( url ) {
        // TODO make match smarter
        return  url.match( /(http.*\.com\/access\/.*)/i )
    }
})
