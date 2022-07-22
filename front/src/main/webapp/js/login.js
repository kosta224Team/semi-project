$(() => {
  //일반 로그인
  let $form = $("form.general_login");
  let url = "/back/login";
  $form.submit(() => {
    let $clidntId = $("input[name=client_id]").val();
    let $clidntPwd = $("input[name=client_pwd]").val();
    let data = "client_id=" + $clidntId + "&client_pwd=" + $clidntPwd;

    $.ajax({
      url: url,
      method: "post",
      data: data,
      success: (jsonObj) => {
        console.log(jsonObj);
        if (jsonObj.status == 1) {
          location.href = "/front/html/index.html";
        } else {
          alert(jsonObj.message);
        }
      },
      error: (jqXHR, textStatus, errorThrown) => {
        errorThrown = "로그인에 실패하였습니다.";
        alert(errorThrown + " 사유 : " + jqXHR.status);
      },
    });
    return false;
  });

  //카카오 로그인
  $kakaoLoginButton = $("a.kakao_login_botton");
  Kakao.init("d3920eee159898958abaa00fc8f0ca01"); //발급받은 javascript키를 사용
  console.log("sdk초기화여부판단 - " + Kakao.isInitialized()); // sdk초기화여부판단
  isGottenKakaoIdFromAPI = false;
  $kakaoLoginButton.click(() => {
    Kakao.Auth.login({
      success: (response) => {
        Kakao.API.request({
          url: "/v2/user/me",
          success: (response) => {
            kakaoId = response.id;
            isGottenKakaoIdFromAPI = true;
            console.log(kakaoId);
          },
          fail: (response) => {
            console.log(error);
          },
        });
      },
      fail: (response) => {
        console.log(error);
      },
    });

    if (isGottenKakaoIdFromAPI == true) {
      console.log(kakaoId + " in Ajax");
      let url = "/back/kakaologin";
      let data = "client_id=" + kakaoId;
      $.ajax({
        url: url,
        method: "post",
        data: data,
        success: (jsonObj) => {
          if (jsonObj.status == 1) {
            location.href = "/front/html/index.html";
          } else {
            alert(jsonObj.message);
          }
        },
        error: (jqXHR, textStatus, errorThrown) => {
          errorThrown = "로그인에 실패하였습니다.";
          alert(errorThrown + " 사유 : " + jqXHR.status);
        },
      });
      return false;
    }
  });
});
