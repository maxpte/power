// src/main/java/com/payrollbackend/controller/HomeDashboardController.java
package com.payrollbackend.controller;

import com.payrollbackend.dto.US2_HomeDashboardDTO;
import com.payrollbackend.service.US2_HomeDashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
@CrossOrigin(origins = "http://localhost:3000")

@RestController
@RequestMapping("/api/dashboard")
public class US2_HomeDashboardController {
    @Autowired
    private US2_HomeDashboardService dashboardService;

    @GetMapping
    public US2_HomeDashboardDTO homeDashboard() {
        return dashboardService.getDashboard();
    }
}
