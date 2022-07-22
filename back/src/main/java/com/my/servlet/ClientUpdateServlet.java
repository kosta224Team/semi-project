package com.my.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Map;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.my.dto.Client;
import com.my.exception.UpdateException;
import com.my.repository.ClientOracleRepository;
import com.my.repository.ClientRepository;

@WebServlet("/clientupdate")
public class ClientUpdateServlet extends HttpServlet {
  private static final long serialVersionUID = 1L;

  protected void doPost(HttpServletRequest request, HttpServletResponse response)
      throws ServletException, IOException {
    String envPath = getServletContext().getRealPath("project.properties");
    response.setContentType("application/json;charset=UTF-8");
    PrintWriter out = response.getWriter();
    ClientRepository clientRepository = new ClientOracleRepository(envPath);
    ObjectMapper mapper = new ObjectMapper();
    Map<String, Object> map = new HashMap<String, Object>();
    HttpSession session = request.getSession();

    String clientId = (String) session.getAttribute("login_info");
    String clientPwd = request.getParameter("client_pwd");
    String clientCellphoneNo = request.getParameter("client_cellphone_no");
    String clientNickname = request.getParameter("client_nickname");
    Client client = new Client();
    client.setClientId(clientId);
    client.setClientPwd(clientPwd);
    client.setClientCellphoneNo(clientCellphoneNo);
    client.setClientNickname(clientNickname);
    client.setClientStatusFlag(1);

    try {
      clientRepository.update(client);
      map.put("status", 1);
      map.put("message", "회원정보 수정 성공");
      map.put("client", client);
    } catch (UpdateException e) {
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
