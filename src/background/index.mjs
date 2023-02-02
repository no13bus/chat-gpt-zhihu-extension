import ExpiryMap from "expiry-map";
import { v4 as uuidv4 } from "uuid";
import Browser from "webextension-polyfill";
import { fetchSSE } from "./fetch-sse.mjs";

const KEY_ACCESS_TOKEN = "accessToken";

const cache = new ExpiryMap(10 * 1000);

async function getAccessToken() {
  if (cache.get(KEY_ACCESS_TOKEN)) {
    return cache.get(KEY_ACCESS_TOKEN);
  }
  const data = await fetch("https://chat.openai.com/api/auth/session")
    .then((r) => r.json())
    .catch(() => ({}));
  if (!data.accessToken) {
    throw new Error("UNAUTHORIZED");
  }
  cache.set(KEY_ACCESS_TOKEN, data.accessToken);
  return data.accessToken;
}

async function getAnswer(port, question) {
  const accessToken = await getAccessToken();

  const controller = new AbortController();
  port.onDisconnect.addListener(() => {
    controller.abort();
  });
  console.log("question", question);

  await fetchSSE("https://chat.openai.com/backend-api/conversation", {
    method: "POST",
    signal: controller.signal,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      action: "next",
      messages: [
        {
          id: uuidv4(),
          role: "user",
          content: {
            content_type: "text",
            parts: [question],
          },
        },
      ],
      model: "text-davinci-002-render",
      // model: "text-davinci-002-render-next",
      parent_message_id: uuidv4(),
    }),
    onMessage(message) {
      console.info("sse message", message);
      if (message === "[DONE]") {
        // port.postMessage({ event: "DONE" });
        // deleteConversation();
        return;
      }
      const data = JSON.parse(message);
      const text = data.message?.content?.parts?.[0];
      // conversationId = data.conversation_id;
      if (text) {
        port.postMessage({
          answer: text,
          // messageId: data.message.id,
          // conversationId: data.conversation_id,
        });
      }
    },
  });
}

Browser.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener(async (msg) => {
    console.debug("received msg", msg);
    console.log("received msg", msg);
    try {
      await getAnswer(port, msg.question);
    } catch (err) {
      console.error(err);
      port.postMessage({ error: err.message });
      cache.delete(KEY_ACCESS_TOKEN);
    }
  });
});
