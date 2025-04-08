package com.javaaidev.chatagent.springai;

import com.javaaidev.chatagent.model.ChatRequest;
import com.javaaidev.chatagent.model.TextContentPart;
import com.javaaidev.chatagent.model.ThreadAssistantContentPart;
import com.javaaidev.chatagent.model.ThreadAssistantMessage;
import com.javaaidev.chatagent.model.ThreadUserMessage;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;
import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.model.Generation;

public class ModelAdapter {

  private ModelAdapter() {
  }

  public static List<Message> fromRequest(ChatRequest request) {
    return request.messages().stream().flatMap(message -> {
      if (message instanceof ThreadUserMessage userMessage) {
        return userMessage.content().stream().map(part -> {
          if (part instanceof TextContentPart textContentPart) {
            return new UserMessage(textContentPart.text());
          }
          return null;
        });
      } else if (message instanceof ThreadAssistantMessage assistantMessage) {
        return assistantMessage.content().stream().map(part -> {
          if (part instanceof TextContentPart textContentPart) {
            return new AssistantMessage(textContentPart.text());
          }
          return null;
        });
      }
      return Stream.<Message>of();
    }).toList();
  }

  public com.javaaidev.chatagent.model.ChatResponse toResponse(ChatResponse chatResponse) {
    var content = new ArrayList<ThreadAssistantContentPart>();
    for (Generation generation : chatResponse.getResults()) {
      content.add(new TextContentPart(generation.getOutput().getText()));
    }
    return new com.javaaidev.chatagent.model.ChatResponse(content);
  }
}
