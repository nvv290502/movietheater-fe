$(document).ready(function () {
  var accessToken = localStorage.getItem("accessToken");
  getInfo(accessToken, "http://127.0.0.1:8000/api/auth/profile");
  logout();
});

function getInfo(accessToken, url) {
  $.ajax({
    url: url,
    method: "GET",
    contentType: 'application/json',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    success: function (response) {
      renderInfo(response.data);
    },
    error: function () {
      console.log("Có lỗi khi tải dữ liệu!");
    },
  });
}
function renderInfo(user) {
  $("#admin-id").text(user.user_id);
  $("#avatar-admin").attr("src", user.avatar_url);
  $("#name-admin").text(user.full_name);
  $("#role-name-admin").text(user.roles.role_name);
}

function logout() {
  $(document).on("click", ".logout", function () {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("role");
    localStorage.removeItem("refreshToken");
    sessionStorage.removeItem("accessCheck");
    window.location.href = "/login";
  });
}

$(document).on("click", ".fa-angle-double-left", function () {
  $(".menu-bar").css("width", "50px");
  $(".menu-bar").css("overflow", "hidden");
  $(".menu-bar-top").css("display", "none");
  $(".fa-angle-double-right").css("display", "block");
  $(".logout").css("display", "none");
});

$(document).on("click", ".fa-angle-double-right", function () {
  $(".menu-bar").css("width", "20%");
  $(".menu-bar-top").css("display", "flex");
  $(".fa-angle-double-right").css("display", "none");
  $(".logout").css("display", "flex");
});

$(document).on("click", "#management-movie", function (e) {
  e.preventDefault();
  window.location.href = "/movie/manager";
});
$(document).on("click", "#home-page", function (e) {
  e.preventDefault();
  window.location.href = "/admin";
});

$(document).on("click", "#management-category", function (e) {
  e.preventDefault();
  window.location.href = "/movie/category-manager";
});

$(document).on("click", "#management-cinema", function (e) {
  e.preventDefault();
  window.location.href = "/cinemas-manager";
});

$(document).on("click", "#management-schedule", function (e) {
  e.preventDefault();
  window.location.href = "/schedule-manager";
});

$(document).on("click", "#management-bill", function (e) {
  e.preventDefault();
  window.location.href = "/bill-manager";
});

$(document).on("click", "#management-promotion", function (e) {
  e.preventDefault();
  window.location.href = "/promotion-manager";
});

$(document).on("click", "#management-account", function (e) {
  e.preventDefault();
  window.location.href = "/account-manager";
});

// $(document).on("click", "#management-staff", function (e) {
//   e.preventDefault();
//   window.location.href = "/staff-manager";
// });
