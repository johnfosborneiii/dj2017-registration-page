var options = {

  allowedFormats: [ 'jpg', 'jpeg', 'png', 'gif' ],
  maxWidth: 200,
  maxHeight: 200,
  maxFileSizeKb: 2048

};

$( document ).ready(function() {

  var $imageupload = this;
  var $browseFileButton = $("#filebutton");

  // Unbind all previous bound event handlers.
  $browseFileButton.off();

  $browseFileButton.on('change', function() {
      $(this).blur();
      submitImageFile();
  });

});

function getAlertHtml(message) {
    var html = [];
    html.push('<div class="alert alert-danger alert-dismissible">');
    html.push('<button type="button" class="close" data-dismiss="alert">');
    html.push('<span>&times;</span>');
    html.push('</button>' + message);
    html.push('</div>');
    return html.join('');
}

function getImageThumbnailHtml(src) {
    return '<img src="' + src + '" alt="Image preview" class="thumbnail" style="max-width: ' + options.maxWidth + 'px; max-height: ' + options.maxHeight + 'px">';
}

function getFileExtension(path) {
    return path.substr(path.lastIndexOf('.') + 1).toLowerCase();
}

function isValidImageFile(file, callback) {
    // Check file size.
    if (file.size / 1024 > options.maxFileSizeKb)
    {
        callback(false, 'File is too large (max ' + options.maxFileSizeKb + 'kB).');
        return;
    }

    // Check image format by file extension.
    var fileExtension = getFileExtension(file.name);
    if ($.inArray(fileExtension, options.allowedFormats) > -1) {
        callback(true, 'Image file is valid.');
    }
    else {
        callback(false, 'File type is not allowed.');
    }
}

function submitImageFile() {

    var $browseFileButton = $("#filebutton");
    var $fileInput = $("#avatar");

    // Check if file was uploaded.
    if (!($fileInput[0].files && $fileInput[0].files[0])) {
        return;
    }

    var file = $fileInput[0].files[0];

    isValidImageFile(file, function(isValid, message) {
        if (isValid) {
            var fileReader = new FileReader();

            fileReader.onload = function(e) {
                // Show thumbnail and remove button.
                $browseFileButton.text('Change');
                $browseFileButton.attr('class', 'btn btn-danger pull-left');
                $("#thumbnail").text('');
                $("#thumbnail").append(getImageThumbnailHtml(e.target.result));
            };

            fileReader.onerror = function() {
                $thumbnail.prepend(getAlertHtml('Error loading image file.'));
                $thumbnail.val('');
            };

            fileReader.readAsDataURL(file);
        }
        else {
            $thumbnail.prepend(getAlertHtml(message));
            $browseFileButton.text('Browse');
            $thumbnail.val('');
        }
    });
}
