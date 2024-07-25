// public/admin.js
document.getElementById('upload-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const formData = new FormData(this);
    fetch('/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(text => {
        document.getElementById('feedback').innerHTML = text;
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('feedback').innerHTML = 'An error occurred while uploading the file.';
    });
});
