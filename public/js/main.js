$('button').on('click',function(event) {
    event.preventDefault();
    var formData = new FormData();
    formData.append('file', $('#file').get(0).files[0]);

    $.ajax({
        url: '/upload',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function(response) {
           console.log(response);
       },
       error: function(jqXHR, textStatus, errorMessage) {
           console.log(errorMessage); // Optional
       }
    });
});

