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
var displayFile = function(f) {
    $('#name').html(f.name);
    //Convert to kbyte-mbyte later.
    $('#fileSize').html(f.size);
    $('#mimeType').html(f.mimeType);

    imgRegex = new RegExp('image');
    // txtRegex = new RegExp ...

    if (imgRegex.test(f.mimeType)){
        $('#imagePreview').attr('src', '../uploads/' + f.fileName);
    }

    // if (txt)....


}

var loadFile = function() {
    var uuid = $('.hidden').html();
    $.ajax({
        url: '/upload/' + uuid,
        type: 'GET'
    })
    .done(function(res) {
        var file = res;
        displayFile(file);
    })
    .fail(function() {
        console.log("error");
    });
    
}