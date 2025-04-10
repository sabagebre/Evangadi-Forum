import React, { useEffect } from "react";

const Chatbot = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.chatbase.co/embed.min.js";
    script.id = "ATyPv_1ZlunmN7lkaV6N4";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div>
      <div id="chatbase-container"></div>{" "}
      {/* Ensure a div is available for the bot */}
    </div>
  );
};

export default Chatbot;
