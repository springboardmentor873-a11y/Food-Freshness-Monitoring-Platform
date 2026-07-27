import { motion } from "framer-motion";
import Card from "./Card";

function AnimatedCard({
  children,
  className = "",
}) {
  return (
    <motion.div
      whileHover={{
        y: -6,
        scale: 1.02,
      }}
      transition={{
        duration: 0.25,
      }}
    >
      <Card className={className}>
        {children}
      </Card>
    </motion.div>
  );
}

export default AnimatedCard;