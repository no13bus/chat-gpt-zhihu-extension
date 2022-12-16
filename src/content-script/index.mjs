import Browser from "webextension-polyfill";

async function run(question) {
  const theme = document.documentElement.dataset.theme;
  let container = document.querySelector("div.chat-gpt-zhihu");
  if (container) {
    container.remove();
  }
  container = document.createElement("div");
  container.classList.add("chat-gpt-zhihu");
  if (theme === "dark") {
    container.classList.add("dark");
  }
  container.innerHTML =
    "<div class='chat-gpt-zhihu-header'>Waiting for ChatGPT response...</div>";

  const firstCard = document.querySelector(".Question-sideColumn .Card");
  if (!firstCard) {
    setTimeout(() => {
      run(question);
    }, 500);
    return;
  }
  firstCard.parentNode.insertBefore(container, firstCard);
  const port = Browser.runtime.connect();
  port.onMessage.addListener(function (msg) {
    if (msg.answer) {
      const svgIcon = `
      <div class="chat-gpt-zhihu-icon-container">
        <div class="chat-gpt-zhihu-tooltip">
          <svg class="chat-gpt-zhihu-header-icon copy" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z" />
          </svg>
          <svg class="chat-gpt-zhihu-header-icon ok" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          <span class="tooltiptext">Copy</span>
        </div>
        <div class="chat-gpt-zhihu-tryagain">
          <svg class="chat-gpt-zhihu-header-icon try" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
        </div>
      </div>
    `;

      container.innerHTML = `
          <div class="chat-gpt-zhihu-header">
            <div class="chat-gpt-zhihu-header-text ">ChatGPT: </div>
            ${svgIcon}
          </div>
          <pre class="chat-gpt-zhihu-answer"></pre>
          `;
      container.querySelector(".chat-gpt-zhihu-answer").textContent =
        msg.answer;
      container
        .querySelector(".chat-gpt-zhihu-header-icon.copy")
        .addEventListener("click", async (e) => {
          await navigator.clipboard.writeText(msg.answer);
          e.target.style.display = "none";
          container.querySelector(
            ".chat-gpt-zhihu-header-icon.ok"
          ).style.display = "inline-block";
        });

      container
        .querySelector(".chat-gpt-zhihu-header-icon.try")
        .addEventListener("click", async (e) => {
          run(question);
        });
    } else if (msg.error === "UNAUTHORIZED") {
      container.innerHTML = `<div class='chat-gpt-zhihu-header'>Please login at <a href="https://chat.openai.com" target="_blank">chat.openai.com</a> first</div>`;
    } else {
      container.innerHTML =
        "<div class='chat-gpt-zhihu-header'>Failed to load response from ChatGPT</div>";
    }
  });
  port.postMessage({ question });
}

// zhihu title
const title =
  document.querySelector(".QuestionHeader-title")?.textContent || "";
// zhihu sub-title
const subTitle = document.querySelector(".QuestionRichText")?.textContent || "";

window.onload = function () {
  run(`${title} ${subTitle}`);
};
