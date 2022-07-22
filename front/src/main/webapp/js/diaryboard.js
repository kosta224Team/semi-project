$(function () {
  let url = "http://localhost:8888/back/diaryboard";
  let currenturl = window.location.search;
  $(".btn-primary").on("click", function () {
    //버튼 클릭시 호출되는 함수
    $(this).addClass("active"); //클릭된 버튼에 속성(class 추가)
    // console.log($(this).val()); //클릭된 버튼의 value 값  alert 띄우기
    viewStatus = $(this).val(); //클릭된 버튼의 value 값  alert 띄우기
    if (viewStatus == 1) {
      alert("최신이다");
    } else if (viewStatus == 2) {
      alert("조회수순이다");
    } else {
      alert("좋아요순이다");
    }
    viewDiaryBoard(viewStatus);
  });
  $(".grid-container").on("click", function () {});
  function dateTimeStrartFormat(dateTimeValue) {
    //시작날짜형식 바꿔주기
    var dt = new Date(dateTimeValue);
    var dateTimeStrartFormat =
      dt.getFullYear() +
      "년" +
      (dt.getMonth() + 1) +
      "월" +
      dt.getDate() +
      "일";
    return dateTimeStrartFormat;
  }
  function dateTimeEndFormat(dateTimeValue) {
    //끝날짜형식 바꿔주기
    var dt = new Date(dateTimeValue);
    var dateTimeEndFormat = dt.getDate() + "일";
    return dateTimeEndFormat;
  }
  function viewDiaryBoard(viewStatus) {
    // 변수선언
    let currentPage = currenturl.split("=")[1];
    let keyword = "";
    let totalRows;
    let startPageNo;
    let endPageNo;
    let totalPage;
    let viewPage = 3;
    let startPageListMath;
    let $oneDiary = $("div.one_diary");
    let $diaryBoard = $("div.diary_board");
    // 변수선언끝
    $.ajax({
      url: url,
      method: "get",
      data: {
        view_status: viewStatus,
        current_page: currentPage,
        keyword: keyword,
      },
      success: (jsonObj) => {
        console.log(jsonObj);
        // 페이징 시작
        totalRows = jsonObj.totalRows;
        // console.log("totalRows = " + totalRows);
        totalPage = Math.floor(totalRows / 10);
        if (totalRows % 10 > 0) {
          totalPage++;
        }
        // console.log("totalPage = " + totalPage);
        currentPage = jsonObj.currentPage;
        // console.log("currentPage = " + currentPage);
        let startPageListMath = Math.floor(currentPage / (viewPage + 0.1)) + 1;
        // console.log("startPageListMath = " + startPageListMath);
        startPageNo = (startPageListMath - 1) * viewPage + 1;
        // console.log("startPageNo = " + startPageNo);
        let endPageNo = startPageNo + viewPage - 1;
        // console.log("endPage = " + endPageNo);
        let totalPageListMath = Math.floor(totalPage / (viewPage + 0.1)) + 1;
        // console.log("totalPageMath = " + totalPageListMath);

        let $paging = $(".paging");
        $paging.empty();

        if (currentPage != 1) {
          let a = "";
          a +=
            "<a href=" + "diaryboard.html" + " >" + "<<(맨처음으로)" + "</a> ";
          $paging.append(a);
        }

        if (startPageListMath != 1) {
          let a = "";
          a +=
            "<a href=" +
            "?current_page=" +
            (startPageNo - 1) +
            " >" +
            "<(이전리스트로)" +
            "</a> ";
          $paging.append(a);
        }
        if (endPageNo < totalPage) {
          for (let i = startPageNo; i <= endPageNo; i++) {
            let a = "";
            a += "<a href=" + "?current_page=" + i + ">" + i + "</a> ";
            $paging.append(a);
          }
        } else {
          for (let i = startPageNo; i <= totalPage; i++) {
            let a = "";
            a += "<a href=" + "?current_page=" + i + ">" + i + "</a> ";
            $paging.append(a);
          }
        }

        if (startPageListMath < totalPageListMath) {
          let a = "";
          a +=
            "<a href=" +
            "?current_page=" +
            (startPageNo + viewPage) +
            " >" +
            ">(다음리스트로)" +
            "</a> ";
          $paging.append(a);
        }
        if (currentPage < totalPage) {
          let a = "";
          a +=
            "<a href=" +
            "?current_page=" +
            totalPage +
            " >" +
            ">>(맨마지막으로)" +
            "</a> ";
          $paging.append(a);
        }

        // 페이징 끝
        //다이어리 불러오기
        $diaryBoard.empty();
        $.each(jsonObj.diaries, (key, value) => {
          console.log(value.diaryNo);
          result = '<div class="one_diary">';
          // onclick = "location.href='목적지 링크주소(URL)';";
          result += "<a href=viewdiary.html?diary_no=" + value.diaryNo + ">";
          result += '<div class="grid-container">';
          result +=
            '<div class="image">' +
            "<img src=" +
            "../images/" +
            value.diaryNo +
            "/1_1.png" +
            " " +
            "width=300px" +
            " " +
            "height=300px>" +
            "</div>";
          result +=
            '<div class="view_cnt">' +
            "조회수 :" +
            value.diaryViewCnt +
            "</div>";
          result +=
            '<div class="nickname">' +
            "닉네임 :" +
            value.client.clientNickname +
            "</div>";
          result +=
            '<div class="diary_title">' +
            "다이어리 제목 :" +
            value.diaryTitle +
            "</div>";
          result +=
            '<div class= "travel_date">' +
            "여행기간 :" +
            dateTimeStrartFormat(value.diaryStartDate) +
            "~" +
            dateTimeEndFormat(value.diaryEndDate) +
            "</div>";
          result +=
            '<div class="like_cnt">' +
            "좋아요 :" +
            value.diaryLikeCnt +
            "개" +
            "</div>";
          // result += "</a>";
          result += "</div>";
          result += "</a>";
          result += "</div>";
          $diaryBoard.append(result);
        });
      },
      error: (jqXHR) => {
        alert("에러 : " + jqXHR.status);
      },
    });

    //다이어리 불러오기끝
  }
  viewDiaryBoard(1);
  // $oneDiary.
  // let $a = $("div.image");
  // let b = $a.find("img").attr("src");
  // let arr = b.split("/");
  // console.log("arr", arr);
  // console.log(b);
  // console.log(jsonObj);
  // $oneDiary.on("click", "div.image", function () {
  //   let src = $(this).find("img").attr("src");
  //   console.log("src", src);
  //   let arr = src.split("/");
  //   let prod_no = arr[arr.length - 1].split(".")[0];
  //   console.log(prod_no);
  // });
});
