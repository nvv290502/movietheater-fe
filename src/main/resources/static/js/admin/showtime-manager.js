var total = 0;
var sizeElementSchedule = localStorage.getItem('sizeElementSchedule') || 5;
var numberPageSchedule = 1;

$(document).ready(function () {
    // Gọi API để lấy danh sách lịch
    callApiGetListSchedule(numberPageSchedule, sizeElementSchedule);
    $('.number-element-of-page-schedule').val(sizeElementSchedule);

    // Sự kiện thay đổi số lượng phần tử mỗi trang
    $(document).off('change', '.number-element-of-page-schedule').on('change', '.number-element-of-page-schedule', function () {
        sizeElementSchedule = $(this).val();
        localStorage.setItem('sizeElementSchedule', sizeElementSchedule);
        callApiGetListSchedule(numberPageSchedule, sizeElementSchedule);
    });

    // Sự kiện phân trang
    $(document).off('click', '.paging-item-schedule').on('click', '.paging-item-schedule', function (e) {
        e.preventDefault();
        numberPageSchedule = $(this).data("value");
        callApiGetListSchedule(numberPageSchedule, sizeElementSchedule);
    });

    // Sự kiện sắp xếp lịch
    $(document).off('click', '.schedule-sort').on('click', '.schedule-sort', function () {
        columnSort = $(this).data("value");
        sortType = $(this).data("id");
        callApiGetListSchedule(numberPageSchedule, sizeElementSchedule);
    });

    // Sự kiện cho nút tiếp theo
    $(document).off('click', '.next').on('click', '.next', function (e) {
        e.preventDefault();
        callApiGetListSchedule(total, sizeElementSchedule);
    });

    // Sự kiện cho nút trước đó
    $(document).off('click', '.previous').on('click', '.previous', function (e) {
        e.preventDefault();
        callApiGetListSchedule(1, sizeElementSchedule);
    });

    // Sự kiện cho nút lưu
    $(document).off('click', '.btn-save').on('click', '.btn-save', function (e) {
        e.preventDefault();
        const price = parseFloat($(this).siblings('input[type="number"]').val());
        const scheduleId = $(this).data('schedule-id');

        if (isNaN(price) || price < 0 || !Number.isInteger(price)) {
            toastr.error("Giá không hợp lệ!.");
            return;
        }

        callApiUpdatePriceTicket(scheduleId, price);
    });

    // Sự kiện cho nút hủy
    $(document).off('click', '.btn-cancel').on('click', '.btn-cancel', function (e) {
        e.preventDefault();
        const scheduleId = $(this).data('schedule-room-id');
        const roomId = $(this).data('room-id');

        Swal.fire({
            title: 'Bạn có chắc chắn muốn hủy lịch chiếu này?',
            text: "Hành động này sẽ không thể khôi phục lại!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Tiếp tục!',
            cancelButtonText: 'Hủy!'
        }).then((result) => {
            if (result.isConfirmed) {
                // Nếu người dùng xác nhận, gọi hàm hủy
                callApiDeleteShowtime(scheduleId, roomId);
            }
        });
    });
});

function callApiGetListSchedule(page, size) {
    $.ajax({
        url: "http://127.0.0.1:8000/api/schedule?size=" + size + "&page=" + page,
        method: 'GET',
        success: function (response) {
            $('.paging-number-schedule').empty();
            $('.list-schedule tbody').empty();
            total = response.data.last_page;
            renderPagingNumberSchedule(total, page);
            for (var sch of response.data.data) {
                renderSchedule(sch);
            }
        },
        error: function (xhr) {
            var response = JSON.parse(xhr.responseText);
            console.log(response.message);
        }
    });
}

function renderPagingNumberSchedule(totalPages, currentPage) {
    var pagingSchedule = $('.paging-number-schedule');
    pagingSchedule.empty();

    const maxPagesToShow = 3; // Số trang tối đa để hiển thị
    const pageRange = Math.floor(maxPagesToShow / 2); // Số trang trước và sau trang hiện tại
    let startPage, endPage;

    if (totalPages <= maxPagesToShow) {
        // Nếu số trang nhỏ hơn số trang tối đa để hiển thị, hiển thị tất cả
        startPage = 1;
        endPage = totalPages;
    } else {
        // Nếu không, chỉ hiển thị một số trang quanh trang hiện tại
        if (currentPage <= pageRange) {
            startPage = 1;
            endPage = maxPagesToShow;
        } else if (currentPage + pageRange >= totalPages) {
            startPage = totalPages - maxPagesToShow;
            endPage = totalPages;
        } else {
            startPage = currentPage - pageRange;
            endPage = currentPage + pageRange;
        }
    }

    if (startPage > 1) {
        pagingSchedule.append('<a href="#" class="paging-item paging-item-schedule" data-value="0">1</a>');
        if (startPage > 1) {
            pagingSchedule.append('<span class="hidden-paging">...</span>');
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        const isActive = i === currentPage ? 'active' : '';
        pagingSchedule.append(`<a href="#" class="paging-item paging-item-schedule ${isActive}" data-value="${i}">${i}</a>`);
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            pagingSchedule.append('<span class="hidden-paging">...</span>');
        }
        pagingSchedule.append(`<a href="#" class="paging-item paging-item-schedule" data-value="${totalPages}">${totalPages}</a>`);
    }
}

function renderSchedule(schedule) {
    const timeStart = new Date(`${schedule.schedule_date}T${schedule.schedule_time}`);
    const duration = schedule.duration;
    const timeEnd = new Date(timeStart.getTime() + duration * 60000);
    const timeEndFormatted = timeEnd.toTimeString().split(' ')[0];

    const currentTime = new Date();
    const isPast = timeStart < currentTime;

    const schTr = `<tr class="${isPast ? 'disabled-row' : ''}">
                <td>${schedule.schedule_room_id}</td>
                <td>${schedule.movie_name}</td>
                <td>${schedule.room_name}</td>
                <td>${schedule.cinema_name}</td>
                <td>${schedule.schedule_date}</td>
                <td>${schedule.schedule_time}</td>
                <td>${timeEndFormatted}</td>
                <td class="price-ticket">
                    <div class="input-group">
                        <input type="number" class="form-control" value="${schedule.price}" />
                        <button data-schedule-id="${schedule.schedule_room_id}" class="btn btn-primary btn-save" type="button">Lưu</button>
                    </div>
                </td>
                <td><button class="btn btn-danger btn-cancel" data-schedule-id="${schedule.schedule_id}"
                  data-room-id="${schedule.room_id}" data-movie-id="${schedule.movie_id} 
                  data-date="${schedule.schedule_date}" data-time="${schedule.schedule_time}">Hủy lịch</button></td>
            </tr>`;
    $('.list-schedule tbody').append(schTr);
}

function callApiUpdatePriceTicket(scheduleId, price) {
    $.ajax({
        url: "http://127.0.0.1:8000/api/showtime/update-price?showtimeId=" + scheduleId + "&price=" + price,
        method: 'POST',
        contentType: 'application/json',
        success: function (response) {
            toastr.success(response.message);
        },
        error: function (xhr) {
            var response = JSON.parse(xhr.responseText);
            console.log(response.message);
        }
    });
}

function callApiDeleteShowtime(showtimeId, roomId) {
    $.ajax({
        url: "http://127.0.0.1:8000/api/showtime/update-price?showtimeId=" + showtimeId + "&roomId=" + roomId,
        method: 'DELETE',
        contentType: 'application/json',
        success: function (response) {
            toastr.success(response.message);
            callApiGetListSchedule(numberPageSchedule, sizeElementSchedule);
        },
        error: function (xhr) {
            var response = JSON.parse(xhr.responseText);
            toastr.error(response.message);
        }
    });
}