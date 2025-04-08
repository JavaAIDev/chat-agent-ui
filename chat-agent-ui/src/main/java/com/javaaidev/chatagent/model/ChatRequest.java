package com.javaaidev.chatagent.model;

import java.util.List;

public record ChatRequest(List<ThreadMessage> messages) {

}
