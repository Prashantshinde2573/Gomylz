// Homepage FAQ. Answers in [SQUARE BRACKETS] are facts only mylz can supply:
// they show on the page as highlighted placeholders and are left out of the
// FAQ search schema until they are filled in.

export type Faq = { q: string; a: string };

export const FAQS: Faq[] = [
  {
    q: "Is this a real booking?",
    a: "Yes. mylz is an IATA-accredited travel agent (TIDS 96192412). Your flight or stay is booked in the airline's or hotel's own inventory, and you receive their confirmation.",
  },
  {
    q: "Who takes my money?",
    a: "The fare or room rate is paid to the airline or hotel. mylz takes only its own stated fee, shown before you pay.",
  },
  {
    q: "What is the mylz fee?",
    a: "[STATE THE FEE: flat amount or percentage]",
  },
  {
    q: "What if my flight is cancelled or I need to change it?",
    a: "The airline's rules decide what can be changed or refunded, and they are shown on every fare before you book. A real person at mylz replies within 2 hours and deals with the airline for you.",
  },
  {
    q: "Do I need an account?",
    a: "No. You can search and compare as a guest. We only ask you to log in when you save a trip or book.",
  },
  {
    q: "What happens to my data?",
    a: "[ADD PRIVACY SUMMARY once tracking on the site matches the cookie policy]",
  },
  {
    q: "Which countries and currencies do you support?",
    a: "[LIST SUPPORTED COUNTRIES AND CURRENCIES]",
  },
];

export const isPlaceholder = (text: string) => text.startsWith("[");
