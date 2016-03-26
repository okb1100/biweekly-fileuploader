// ajax progress patch by englercj
// https://github.com/englercj/jquery-ajax-progress

(function($, window, undefined) {
    //is onprogress supported by browser?
    var hasOnProgress = ("onprogress" in $.ajaxSettings.xhr());

    //If not supported, do nothing
    if (!hasOnProgress) {
        return;
    }
    
    //patch ajax settings to call a progress callback
    var oldXHR = $.ajaxSettings.xhr;
    $.ajaxSettings.xhr = function() {
        var xhr = oldXHR();
        if(xhr instanceof window.XMLHttpRequest) {
            xhr.addEventListener('progress', this.progress, false);
        }
        
        if(xhr.upload) {
            xhr.upload.addEventListener('progress', this.progress, false);
        }
        
        return xhr;
    };
})(jQuery, window);



var upload = function() {
    var formData = new FormData();
    formData.append('file', $('#file').get(0).files[0]);

    $.ajax({
        url: '/upload',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        beforeSend: function() {
            $('#fakeFile').hide('slow', function() {
                $('.progress').show('slow');
            });
        },
        progress: function(e) {
           if(e.lengthComputable){
            var pct = Math.round((e.loaded / e.total) * 100);
            $('.progress-bar').attr('aria-valuenow', pct).css('width', pct + "%").html(pct + "%");
           }
        },
        success: function(response) {
            //success event
            $('.progress-bar').addClass('progress-bar-success').html("Success!");
            var url = '<a href="/files/' + response + '"> here </a>';
            $('#status').show().html("Your file is uploaded, you can reach it at " + url);
       },
       error: function(jqXHR, textStatus, errorMessage) {
           $('.progress-bar').addClass('progress-bar-danger').html("Error!");
       }
    });
};


$('#file').on('change',function(event) {
    event.preventDefault();
    upload();
});
$('#fakeFile').click(function(event) {
    $('#file').click();
});
