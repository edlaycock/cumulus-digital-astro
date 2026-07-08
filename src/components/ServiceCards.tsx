import { motion } from "framer-motion";

export interface ServiceCardItem {
  title: string;
  summary: string;
  iconPath: string;
  href: string;
  linkText: string;
}

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

export default function ServiceCards({ items }: { items: ServiceCardItem[] }) {
  return (
    <ul className="services-grid" role="list">
      {items.map((svc, i) => (
        <motion.li
          key={svc.title}
          className="service-card"
          custom={i}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={cardVariants}
        >
          <div className="service-card-tile" aria-hidden="true">
            <svg viewBox="0 0 48 48" fill="none">
              <path
                d={svc.iconPath}
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </div>
          <div className="service-card-body">
            <h3>{svc.title}</h3>
            <p>{svc.summary}</p>
            <a className="service-link" href={svc.href}>{svc.linkText}</a>
          </div>
        </motion.li>
      ))}
    </ul>
  );
}
