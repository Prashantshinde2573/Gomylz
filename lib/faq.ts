type Faq = { q: string; a: string; href?: string; linkLabel?: string };

export const FAQS: Faq[] = [
  {
    q: "What can I search for?",
    a: "Use Mylz for flights and stays. Experiences, trains, buses, and ferries are shown as coming soon on the live homepage.",
  },
  {
    q: "Do I have to use the chat?",
    a: "You can start with the Flights or Stays form. It collects the trip details and brings them into the same workspace as a typed or spoken request.",
  },
  {
    q: "Can I refine a search?",
    a: "Yes. Keep typing while a search runs or send a follow-up when the options appear. Try asking for direct flights, a different departure time, or options under your budget in the demo.",
  },
  {
    q: "When do I sign in?",
    a: "Live Mylz prompts you to sign in when you enter the trip workspace. In this preview, you can continue as a guest and explore sample results.",
  },
  {
    q: "What will I pay, and who handles changes?",
    a: "Review the price, any applicable Mylz service fee, and the supplier’s terms before booking. Contact Mylz for assistance with a disruption or change.",
    href: "https://gomylz.com/terms-and-conditions",
    linkLabel: "Read the booking terms",
  },
  {
    q: "How does Mylz handle my data?",
    a: "The live site’s privacy policy explains what Mylz collects and how it handles information used to provide its services.",
    href: "https://gomylz.com/privacy",
    linkLabel: "Read the privacy policy",
  },
];
