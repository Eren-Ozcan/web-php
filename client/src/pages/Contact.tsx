import { useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../api";

export default function Contact() {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await api.post("/api/contact", { name, email, message });
      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <section className="bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">
          {t("contact_form_heading")}
        </h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              {t("contact_name_label")}
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("contact_name_placeholder")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              {t("contact_email_label")}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("contact_email_placeholder")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              {t("contact_message_label")}
            </label>
            <textarea
              id="message"
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t("contact_message_placeholder")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {t("contact_submit")}
          </button>
          {status === "success" && (
            <p className="text-green-600 text-center">{t("contact_success")}</p>
          )}
          {status === "error" && (
            <p className="text-red-600 text-center">{t("contact_error")}</p>
          )}
        </form>
      </div>
    </section>
  );
}
