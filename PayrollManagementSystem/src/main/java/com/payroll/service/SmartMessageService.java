package com.payroll.service;

import com.payroll.model.LeaveRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Month;
import java.time.temporal.ChronoUnit;
import java.util.Random;

@Service
public class SmartMessageService {
    
    public String generateLeaveStatusMessage(LeaveRequest leave) {
        String seasonalMessage = getSeasonalMessage(leave.getStartDate());
        String durationMessage = getDurationMessage(leave);
        String typeMessage = getLeaveTypeMessage(leave.getLeaveType());
        String statusMessage = getStatusMessage(leave.getStatus());
        
        return "🤖 AI Insight: " + seasonalMessage + " " + durationMessage + " " + typeMessage + " " + statusMessage;
    }
    
    private String getSeasonalMessage(LocalDate startDate) {
        Month month = startDate.getMonth();
        
        switch (month) {
            case DECEMBER, JANUARY:
                return "Perfect winter break timing!";
            case MARCH, APRIL:
                return "Spring is ideal for rejuvenation!";
            case MAY, JUNE:
                return "Summer planning shows great foresight!";
            case JULY, AUGUST:
                return "Mid-year break - smart decision!";
            case SEPTEMBER, OCTOBER:
                return "Autumn leaves, perfect for personal time!";
            case NOVEMBER:
                return "End-of-year timing is excellent!";
            case FEBRUARY:
                return "February break will boost your energy!";
            default:
                return "Great timing for your leave!";
        }
    }
    
    private String getDurationMessage(LeaveRequest leave) {
        long days = ChronoUnit.DAYS.between(leave.getStartDate(), leave.getEndDate()) + 1;
        
        if (days == 1) {
            return "A single day off can work wonders.";
        } else if (days <= 3) {
            return "Short breaks are proven to increase productivity.";
        } else if (days <= 7) {
            return "A week-long break will recharge your batteries perfectly.";
        } else {
            return "Extended leave shows excellent self-care planning.";
        }
    }
    
    private String getLeaveTypeMessage(LeaveRequest.LeaveType leaveType) {
        switch (leaveType) {
            case SICK:
                return "Taking care of your health is the top priority.";
            case CASUAL:
                return "Casual leave maintains great work-life balance.";
            case PAID:
                return "Paid leave investment in your wellbeing pays off.";
            case UNPAID:
                return "Your dedication shows even in unpaid leave planning.";
            default:
                return "Smart leave planning detected.";
        }
    }
    
    private String getStatusMessage(LeaveRequest.LeaveStatus status) {
        String[] approvedMessages = {
            "Enjoy your well-deserved break!",
            "Time to relax and return refreshed!",
            "Your team supports your time off!",
            "Make the most of your approved leave!"
        };
        
        String[] pendingMessages = {
            "Your request shows excellent planning!",
            "Proactive leave planning detected!",
            "Your manager will appreciate the advance notice!",
            "Good timing for this request!"
        };
        
        String[] rejectedMessages = {
            "Consider alternative dates for better approval chances.",
            "Your understanding shows great teamwork!",
            "Perhaps a different timing would work better.",
            "Your flexibility will be appreciated!"
        };
        
        String[] messages;
        switch (status) {
            case APPROVED:
                messages = approvedMessages;
                break;
            case REJECTED:
                messages = rejectedMessages;
                break;
            default:
                messages = pendingMessages;
        }
        
        return messages[new Random().nextInt(messages.length)];
    }
}