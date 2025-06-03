package com.email_assistant.email_assistant;

import lombok.Data;

@Data
public class EmailRequest {
    private String emailContent; // The email user received and we'll use it to generate the reply
    private String tone;
}
