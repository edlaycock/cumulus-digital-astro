import { motion, useReducedMotion } from "framer-motion";

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

// The icon draws itself as its card arrives — the stroke starts empty and
// runs the path, landing just after the card settles so the two read as one
// gesture rather than two competing animations.
const iconVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      delay: i * 0.1 + 0.25,
      pathLength: { delay: i * 0.1 + 0.25, duration: 1.1, ease: "easeInOut" as const },
      opacity: { delay: i * 0.1 + 0.25, duration: 0.3 },
    },
  }),
};

export default function ServiceCards({ items }: { items: ServiceCardItem[] }) {
  const reduce = useReducedMotion();

  return (
    <ul className="services-grid" role="list">
      {items.map((svc, i) => (
        <motion.li
          key={svc.title}
          className="service-card"
          custom={i}
          initial={reduce ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={cardVariants}
        >
          <div className="service-card-tile" aria-hidden="true">
            <svg viewBox="0 0 48 48" fill="none">
              {reduce ? (
                <path
                  d={svc.iconPath}
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              ) : (
                <motion.path
                  d={svc.iconPath}
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  custom={i}
                  variants={iconVariants}
                />
              )}
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
