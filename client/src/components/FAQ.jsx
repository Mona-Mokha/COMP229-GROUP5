import React, { useState } from "react";

const faqs = [
  {
    question: "What is this platform about?",
    answer:
      "We connect donors who want to give away items with people who need them — completely free. Our goal is to reduce waste and support the community.",
  },
  {
    question: "Is it really free to donate or receive items?",
    answer:
      "Yes. There are no fees for donations or requests. All items shared on the platform are 100% free.",
  },
  {
    question: "How do I donate items?",
    answer:
      "Create an account, log in, take clear photos of the items you want to donate, and list them under 'Donate Item'. That's it!",
  },
  {
    question: "Can I request items if I don’t have anything to donate?",
    answer:
      "Absolutely. This platform is built to help anyone in need — no donation requirement.",
  },
  {
    question: "Is pickup or delivery included?",
    answer:
      "This depends on the donor. Some donors offer delivery, while others require pickup. Details are shown in the listing.",
  },
  {
    question: "Is there a limit to how many items I can donate?",
    answer:
      "There is no strict limit. You’re welcome to donate as many quality items as you like, as long as they are clean, usable, and accurately described.",
  },
  {
    question: "Are items inspected or guaranteed?",
    answer:
      "Items are not guaranteed or certified. We advise donors to post truthful pictures and recipients to inspect items when picking up.",
  },
  {
    question: "Can I donate clothes of any size or condition?",
    answer:
      "Yes! We accept clothing of all sizes and gently used condition. Please ensure items are clean and in wearable condition for the next user.",
  },
];

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <div className="ws-faq-page">
      <div className="ws-faq-header">
        <h1>Frequently Asked Questions</h1>
        <p>Find answers to the most common questions about using our platform.</p>
      </div>

      <div className="ws-faq-list">
        {faqs.map((faq, index) => (
          <div className="ws-faq-item" key={index}>
            <button
              className="ws-faq-question"
              onClick={() => toggleFAQ(index)}
            >
              <span>{faq.question}</span>
              <span>{activeIndex === index ? "−" : "+"}</span>
            </button>

            {activeIndex === index && (
              <div className="ws-faq-answer">
                <p>{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
