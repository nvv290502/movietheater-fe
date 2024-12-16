function isAdmin(accessToken) {
    var settings = {
        url: "http://127.0.0.1:8000/api/view/admin",
        method: "GET",
        contentType: "application/json",
        headers: {
            'Authorization': `Bearer ${accessToken}`
        },
        success: function (response) {
        },
        error: function (xhr) {
            var response = JSON.parse(xhr.responseText);

            if(response[0].status === 401){
                toastr.error('Ban chua dang nhap');
                window.location.href = '/login';
            }
            if(response[0].status === 403){
                toastr.error('Ban khong co quyen truy cap');
                window.location.href = '/login';
            }
        }
    }
    $.ajax(settings);
}
