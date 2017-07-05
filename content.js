$( function() {
    setInterval(function() {

        // Send the download request/song information to the background manager
        chrome.runtime.sendMessage({
            title:  getTitle(),
            artist: getArtist(),
            album:  getAlbum()
        }, function( response ) {} );
    }, 5000);

    function getTitle() {
      return document.getElementsByClassName('nowPlayingTopInfo__current__trackName')[0].text;
    }

    function getArtist() {
      return document.getElementsByClassName('nowPlayingTopInfo__current__artistName')[0].text;
    }

    function getAlbum() {
      return document.getElementsByClassName('nowPlayingTopInfo__current__albumName')[0].text;
    }
})
