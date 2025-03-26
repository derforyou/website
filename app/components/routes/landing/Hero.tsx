import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

export default function Hero() {
  return (
    <div className="flex justify-center items-center min-h-svh">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="py-0"
      >
        <h1 className="text-4xl text-center font-header">React Router & Cloudflare Pages Template</h1>
        <div className="pt-8 text-center">
          <strong className="text-2xl sub-text-1 font-header">With Vite, Drizzle & Kysely</strong>
        </div>
        <div className="flex justify-center pt-16">
          <img src="/logo_light.png" alt="" className="h-[8rem]" />
        </div>
      </motion.div>
    </div>

  );
}
