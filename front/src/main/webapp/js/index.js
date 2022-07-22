$(function () {
  let url = "http://localhost:8888/back/loginstatus";

  $.ajax({
    url: url,
    method: "post",
    success: function (jsonObj) {
      console.log(jsonObj);
      let $navObj = $(".loginnav");
      $navObjHtml = "";
      if (jsonObj.status == 0) {
        // 로그인안된경우
        $navObjHtml += '<a href="login.html">로그인</a>';
      } else {
        // 로그인 된 경우
        $navObjHtml += '<a href="/back/logout">로그아웃</a>';
      }
      $navObj.html($navObjHtml);
    },
    error: function (jqXHR) {
      alrert("오류" + jqXHR.status);
    },
  });

  // $(".loginnav").on("click", "a", function () {
  //   let $newObj = $(".new");
  //   let url = $(this).attr("href");
  //   let title = $(this).html();
  //   $newObj.load(url, function () {
  //     if (url == "/back/logout") {
  //       location.href = "";
  //     }
  //   });
  //   return false;
  // });
});
