$(function(){
    $('#search-form').submit(function(e){
        e.preventDefault();
    });
});


function search(){

        //Clear all results
        $('#results').html('');
        $('#buttons').html('');

        // Get query results
        q = $('#query').val();

        // Run GET JQuery on API

        $.get(
            'https://www.googleapis.com/youtube/v3/search', {
                part: 'snippet, id',
                q: q,
                type: 'video',
                key: 'AIzaSyDvaYLputH_nNrNJQRtAeXUAOwhYHDGqkU'
            }, function(data){
                var nextPagetoken = data.nextPageToken;
                var prevPagetoken = data.prevPageToken;

                $.each(data.items, function(i, item){

                        // Initialize output 
                        var output = getOutput(item);
                        
                        // Display results 
                       $('#results').append(output);
                  });
                        // Add Buttons
                    var buttons = getButtons(prevPagetoken, nextPagetoken);
                    $('#buttons').append(buttons);

            });
}

// make getOutput function 

    function getOutput(item){
        var videoId = item.id.videoId;
        var title = item.snippet.title;
        var description = item.snippet.description;
        var thumb = item.snippet.thumbnails.high.url;
        var channel = item.snippet.channelTitle;

        var output = `<li class='list-group-item'>
                        <div class="container">
                        <div class="media py-3">
                        <img height="150" width="150" src="${thumb}" class="d-flex mr-3">
                            <div class="media-body">
                                <h5 class='text-dark mb-1'>
                                <a href="https://www.youtube.com/embed/${videoId}" data-toggle="lightbox" class="video">${title}</a></h5>
                                <a class="text-muted mb-2" href="https://www.youtube.com/user/${channel}" target="_blank">${channel}</a>
                                <p class="text-muted">${description}</p>
                            </div>
                        </div>
                        </div>
                        </li>`;

        return output;
    }

    // video lightbox 
    
    $(document).on('click', '[data-toggle="lightbox"]', function(event) {
        event.preventDefault();
        $(this).ekkoLightbox();
    });


    // NextPage function 

    function nextPage(){

        var token = $('#next-button').data('token');
        var q = $('#next-button').data('query');

          //Clear all results
          $('#results').html('');
          $('#buttons').html('');
  
          // Get query results
  
          q = $('#query').val();
  
          // Run GET JQuery on API
  
          return new GoogleApi(q, token);
    }



    function prevPage(){

        var token = $('#prev-button').data('token');
        var q = $('#prev-button').data('query');

         //Clear all results
          $('#results').html('');
          $('#buttons').html('');
  
          // Get query results
  
          q = $('#query').val();
  
          // Run GET JQuery on API

          return new GoogleApi(q, token);
  
    }

// Building the buttons

    function getButtons(prevPageToken, nextPageToken)
    {
        if(!prevPageToken)
            {
                var btnOut = `
                <button class="btn btn-outline-danger" id="next-button" data-token="${nextPageToken}" 
                data-query="${q}" onclick="nextPage()">Next</button>
                `;
            }
            else {
                var btnOut = `
                <button class="btn btn-outline-dark m-1" id="prev-button" data-token="${prevPageToken}"
                data-query="${q}" onclick="prevPage()">Prev</button><br>
                <button class="btn btn-outline-danger m-1" id="next-button" data-token="${nextPageToken}" 
                data-query="${q}" onclick="nextPage()">Next</button>
                `;
            }
            return btnOut;
    }

    class GoogleApi
    {
         constructor(q, token){
            $.get(
                'https://www.googleapis.com/youtube/v3/search', {
                    part: 'snippet, id',
                    q: q,
                    pageToken: token,
                    type: 'video',
                    key: 'AIzaSyDvaYLputH_nNrNJQRtAeXUAOwhYHDGqkU'
                }, function(data){
                    var nextPagetoken = data.nextPageToken;
                    var prevPagetoken = data.prevPageToken;
    
                    $.each(data.items, function(i, item){
    
                            // Initialize output 
                            var output = getOutput(item);
                            
                            // Display results 
                           $('#results').append(output);
                      });
    
                        var buttons = getButtons(prevPagetoken, nextPagetoken);
                        $('#buttons').append(buttons);
    
                });
        }
    }