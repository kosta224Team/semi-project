package com.my.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.my.dto.Client;
import com.my.dto.Diary;
import com.my.dto.Route;
import com.my.exception.InsertException;
import com.my.repository.DiaryOracleRepository;
import com.my.repository.DiaryRepository;
import com.my.repository.RouteOracleRepository;
import com.my.repository.RouteRepository;

@WebServlet("/diarywriting")
public class DiaryWritingServlet extends HttpServlet {
  private static final long serialVersionUID = 1L;

  public DiaryWritingServlet() {}

  protected void doPost(HttpServletRequest request, HttpServletResponse response)
      throws ServletException, IOException {
    response.setContentType("application/json;charset=UTF-8");
    PrintWriter out = response.getWriter();
    ObjectMapper mapper = new ObjectMapper();
    Map<String, Object> map = new HashMap<String, Object>();
    String sample =
        "{\"diaryTitle\" : \"title1\" , \"diaryStartDate\" : \"2021-07-01\",\"diaryEndDate\": \"2021-07-03\" , \"diaryDisclosureFlag\" : 1,\n"
            + "\"routes\" : [ {\"routeContent\" : \"김민성씨 페이징처리 좀 잘해주세요\" , \"kakaoMapId\" : \"151\"},{\"routeContent\" : \"강의장\" , \"kakaoMapId\" : \"290\"}]}";
    Diary diary = mapper.readValue(sample, Diary.class);
    List<Route> routes = diary.getRoutes();

    HttpSession session = request.getSession();
    String clientId = (String) session.getAttribute("login_info");
    String envPath = getServletContext().getRealPath("project.properties");
    DiaryRepository diaryRepository = new DiaryOracleRepository(envPath);
    RouteRepository routeRepository = new RouteOracleRepository(envPath);

    try {
      Client client = new Client();
      client.setClientId("a@ad.sdasd");
      diary.setClient(client);
      diaryRepository.insert(diary);
      int diaryNo = diary.getDiaryNo();
      // 실험용 코드 start (시험 끝나고 지워도 됨)
      System.out.println("diaryNo = " + diaryNo);
      // 실험용 코드 end (시험 끝나고 지워도 됨)
      int routesRowSize = routes.size();
      for (int i = 0; i < routesRowSize; i++) {
        routes.get(i).setDiaryNo(diaryNo);
      }
      routeRepository.insert(routes);
      map.put("status", 1);
      map.put("message", "DiaryOracleRepository/RouteOracleRepository.insert() 성공");

    } catch (InsertException e) {
      map.put("status", 0);
      map.put("message", e.getMessage());
      e.printStackTrace();
    } catch (Exception e) {
      map.put("status", 0);
      map.put("message", e.getMessage());
      e.printStackTrace();
    }
    String result = mapper.writeValueAsString(map);
    out.print(result);
  }
}
