package com.payroll.service;

import com.payroll.model.User;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.Random;

@Service
public class WelcomeAIService {
    
    public String generateSmartWelcome(User user) {
        String timeGreeting = getTimeBasedGreeting();
        String personalizedMessage = getPersonalizedMessage(user);
        String motivationalQuote = getMotivationalQuote();
        
        return timeGreeting + " " + user.getUsername() + "! " + personalizedMessage + " " + motivationalQuote;
    }
    
    private String getTimeBasedGreeting() {
        LocalTime now = LocalTime.now();
        if (now.isBefore(LocalTime.of(12, 0))) {
            return "Good morning";
        } else if (now.isBefore(LocalTime.of(17, 0))) {
            return "Good afternoon";
        } else {
            return "Good evening";
        }
    }
    
    private String getPersonalizedMessage(User user) {
        String[] adminMessages = {
            "Your team is ready for another productive day!",
            "New insights await in your dashboard.",
            "Time to lead and inspire your team!",
            "Ready to make strategic decisions today?"
        };
        
        String[] employeeMessages = {
            "Ready to make today amazing?",
            "Your hard work continues to shine!",
            "Time to tackle new challenges!",
            "Another day to grow and succeed!"
        };
        
        String[] messages = user.getRole() == User.Role.ADMIN ? adminMessages : employeeMessages;
        return messages[new Random().nextInt(messages.length)];
    }
    
    private String getMotivationalQuote() {
        String[] quotes = {
            "Success is the result of preparation meeting opportunity.",
            "Excellence is not a skill, it's an attitude.",
            "Great things never come from comfort zones.",
            "Every accomplishment starts with the decision to try.",
            "Your potential is endless."
        };
        
        return quotes[new Random().nextInt(quotes.length)];
    }
}