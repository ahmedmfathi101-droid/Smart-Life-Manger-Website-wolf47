// Gemini AI configuration.
// اترك enabled=false ليعمل النظام بتحليل محلي ذكي بدون إرسال البيانات لأي خدمة خارجية.
// عند إضافة API Key من Google AI Studio، غيّر enabled إلى true.

window.lifeOSAI = {
  enabled: false,
  provider: "gemini",
  model: "gemini-2.5-flash",
  apiKey: "",
  endpoint: "https://generativelanguage.googleapis.com/v1beta"
};
