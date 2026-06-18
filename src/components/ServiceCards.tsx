import { motion } from "framer-motion";

interface Service {
  img: string;
  imgAlt: string;
  iconPath: string;
  title: string;
  body: string;
  linkText: string;
  linkHref: string;
}

const services: Service[] = [
  {
    img: "https://images.unsplash.com/photo-1600508774634-4e11d34730e2?w=600&auto=format&fit=crop&q=75",
    imgAlt: "Branding and identity design",
    iconPath: "M11 27a7 7 0 0 1-.6-13.97A9 9 0 0 1 28.4 14.2 6.5 6.5 0 0 1 28 27H15l-4.2 5.2c-.5.6-1.5.2-1.4-.6L10 27Z",
    title: "Branding",
    body: "Full brand identity — logo, colour, type, tone — built to reflect who you are and win the customers you want.",
    linkText: "Learn more →",
    linkHref: "#contact",
  },
  {
    img: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&auto=format&fit=crop&q=75",
    imgAlt: "Web design and UX",
    iconPath: "M8 14h32v20H8zM16 34v4M32 34v4M12 38h24M15 22h18M15 27h12",
    title: "Web Design",
    body: "Distinctive, responsive websites designed from scratch — no templates, no compromise on quality.",
    linkText: "Learn more →",
    linkHref: "#contact",
  },
  {
    img: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&auto=format&fit=crop&q=75",
    imgAlt: "Web development code",
    iconPath: "M14 22L10 26L14 30M34 22L38 26L34 30M27 16L21 36",
    title: "Web Development",
    body: "Custom-built, fast, secure websites and web apps. Hand-coded for performance — not bolted together from plugins.",
    linkText: "Learn more →",
    linkHref: "#contact",
  },
  {
    img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=75",
    imgAlt: "Digital marketing analytics",
    iconPath: "M24 8a16 16 0 1 0 0 32 16 16 0 0 0 0-32zM24 8Q36 24 24 40M24 8Q12 24 24 40M8 24h32",
    title: "Digital Marketing",
    body: "SEO, PPC, and content strategies that put you in front of the right audience — and keep you there.",
    linkText: "Learn more →",
    linkHref: "#contact",
  },
  {
    img: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&auto=format&fit=crop&q=75",
    imgAlt: "Strategy and consulting meeting",
    iconPath: "M8 38L16 26L22 32L30 18L40 38",
    title: "Strategy & Consulting",
    body: "Digital advisory for CEOs and business owners navigating transformation — clear direction, practical steps.",
    linkText: "Learn more →",
    linkHref: "#contact",
  },
  {
    img: "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=600&auto=format&fit=crop&q=75",
    imgAlt: "Travel industry specialists",
    iconPath: "M10 32Q18 10 24 28Q30 46 40 20M20 14L24 8L28 14",
    title: "Travel Industry",
    body: "25+ years of deep travel-sector expertise. We understand operators, agents, and travellers like no generic agency can.",
    linkText: "Our story →",
    linkHref: "#about",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 48 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

export default function ServiceCards() {
  return (
    <ul className="services-grid" role="list">
      {services.map((svc, i) => (
        <motion.li
          key={svc.title}
          className="service-card"
          custom={i}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={cardVariants}
        >
          <img
            className="service-card-img"
            src={svc.img}
            alt={svc.imgAlt}
            loading="lazy"
          />
          <div className="service-card-body">
            <div className="service-icon" aria-hidden="true">
              <svg viewBox="0 0 48 48" fill="none">
                <path d={svc.iconPath} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
            </div>
            <h3>{svc.title}</h3>
            <p>{svc.body}</p>
            <a className="service-link" href={svc.linkHref}>{svc.linkText}</a>
          </div>
        </motion.li>
      ))}
    </ul>
  );
}
