require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

app.get("/", (req, res) => {
  res.send("Al-Ihsan Foundation Bot is Running!");
});

// আইস ব্রেকার্স (Ice Breakers) সেটআপ (নতুন প্রফেশনাল লেখা)
// app.get("/setup-profile", (req, res) => {
//   let request_body = {
//     ice_breakers: [
//       {
//         call_to_actions: [
//           {
//             question: "🏢 আপনাদের ফাউন্ডেশন সম্পর্কে জানতে চাই",
//             payload: "ABOUT_US",
//           },
//           {
//             question: "🤲 আমি অনুদান/সাহায্য দিতে চাই",
//             payload: "DONATE",
//           },
//           {
//             question: "📞 আপনাদের সাথে যোগাযোগ করতে চাই",
//             payload: "CONTACT",
//           },
//         ],
//         locale: "default",
//       },
//     ],
//   };

//   axios
//     .post(
//       `https://graph.facebook.com/v18.0/me/messenger_profile?access_token=${PAGE_ACCESS_TOKEN}`,
//       request_body,
//     )
//     .then(() => {
//       res.send("✅ নতুন প্রফেশনাল Ice Breakers সফলভাবে সেটআপ হয়েছে!");
//     })
//     .catch((error) => {
//       res.send("❌ সমস্যা হয়েছে: " + error.response.data.error.message);
//     });
// });

// Facebook Webhook Verification
app.get("/webhook", (req, res) => {
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

// মেসেজ রিসিভ করার জন্য Webhook POST
app.post("/webhook", (req, res) => {
  let body = req.body;

  if (body.object === "page") {
    body.entry.forEach(function (entry) {
      let webhook_event = entry.messaging[0];
      let sender_psid = webhook_event.sender.id;

      if (webhook_event.message) {
        handleMessage(sender_psid, webhook_event.message);
      }
    });
    res.status(200).send("EVENT_RECEIVED");
  } else {
    res.sendStatus(404);
  }
});

// মেসেজ লজিক হ্যান্ডেল করা
function handleMessage(sender_psid, received_message) {
  let response;
  let text = received_message.text ? received_message.text.trim() : "";
  let lowerText = text.toLowerCase();

  // ১. আমাদের সম্পর্কে (Ice Breaker & Quick Reply Match)
  if (
    text === "🏢 আপনাদের ফাউন্ডেশন সম্পর্কে জানতে চাই" ||
    text === "🏢 আমাদের সম্পর্কে"
  ) {
    response = {
      text: "আল-ইহসান ফাউন্ডেশন একটি অলাভজনক সেবামূলক প্রতিষ্ঠান। 🌿\n\nআমরা সমাজের অসহায়, দরিদ্র ও সুবিধাবঞ্চিত মানুষের কল্যাণে কাজ করে যাচ্ছি। আমাদের প্রধান লক্ষ্য হলো সবার মুখে হাসি ফোটানো এবং একটি সুন্দর সমাজ গড়ে তোলা। আপনার যেকোনো পরামর্শ বা সহযোগিতা আমাদের একান্ত কাম্য।",
    };
  }
  // ২. অনুদান বা সাহায্য (Ice Breaker & Quick Reply Match)
  else if (
    text === "🤲 আমি অনুদান/সাহায্য দিতে চাই" ||
    text === "🤲 অনুদান দিন"
  ) {
    response = {
      text: "জাযাকাল্লাহ খায়ের! আপনার মহতী উদ্যোগের জন্য অসংখ্য ধন্যবাদ। 🌸\n\nআপনার যাকাত, সাদাকাহ বা সাধারণ অনুদান পাঠাতে পারেন নিচের নম্বরে:\n📱 বিকাশ/নগদ: 01326098250 (পার্সোনাল)\n\nঅনুদান পাঠানোর পর দয়া করে এখানে একটি মেসেজ দিয়ে কনফার্ম করবেন, ইনশাআল্লাহ।",
    };
  }
  // ৩. যোগাযোগ (Ice Breaker & Quick Reply Match)
  else if (
    text === "📞 আপনাদের সাথে যোগাযোগ করতে চাই" ||
    text === "📞 যোগাযোগ"
  ) {
    response = {
      text: "আমাদের সাথে যোগাযোগ করার বিস্তারিত তথ্য নিচে দেওয়া হলো: 👇\n\n📞 মোবাইল: 01326098250\n📧 ইমেইল: nayemsadiq2013@gmail.com\n\nযেকোনো প্রয়োজনে আমাদের সরাসরি কল করতে পারেন।",
    };
  }
  // ৪. স্বাগতম মেসেজ (hi, hello, salam)
  else if (
    lowerText === "hi" ||
    lowerText === "hello" ||
    lowerText.includes("আসসালামু আলাইকুম") ||
    lowerText.includes("salam")
  ) {
    response = {
      text: "ওয়া আলাইকুমুস সালাম ওয়া রাহমাতুল্লাহ! 🌸\n\nআল-ইহসান ফাউন্ডেশনের অফিসিয়াল পেজে আপনাকে স্বাগতম। দয়া করে নিচের মেনু থেকে আপনার প্রয়োজনীয় অপশনটি বেছে নিন:",
      quick_replies: [
        {
          content_type: "text",
          title: "🏢 আমাদের সম্পর্কে",
          payload: "ABOUT_US",
        },
        {
          content_type: "text",
          title: "🤲 অনুদান দিন",
          payload: "DONATE",
        },
        {
          content_type: "text",
          title: "📞 যোগাযোগ",
          payload: "CONTACT",
        },
      ],
    };
  }
  // ৫. অন্য কোনো সাধারণ মেসেজ লিখলে (অপেক্ষা করার মেসেজ)
  else {
    response = {
      text: "জাযাকাল্লাহ খায়ের! আমরা আপনার মেসেজটি পেয়েছি। 📩\n\nদয়া করে কিছুক্ষণ অপেক্ষা করুন, আমাদের একজন প্রতিনিধি খুব শিগগিরই আপনার মেসেজটি পড়ে রিপ্লাই দেবেন ইনশাআল্লাহ।",
    };
  }

  // মেসেজ সেন্ড করা
  callSendAPI(sender_psid, response);
}

// Facebook Messenger API তে মেসেজ পাঠানোর ফাংশন
function callSendAPI(sender_psid, response) {
  let request_body = {
    recipient: {
      id: sender_psid,
    },
    message: response,
  };

  axios
    .post(
      `https://graph.facebook.com/v18.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`,
      request_body,
    )
    .then(() => {
      console.log("Message sent!");
    })
    .catch((error) => {
      console.error("Unable to send message:", error.response.data);
    });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Vercel এর জন্য এক্সপোর্ট
module.exports = app;
