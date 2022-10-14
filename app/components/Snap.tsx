import { motion } from 'framer-motion';

type SnapProps = {
  suitMatches: boolean;
  valueMatches: boolean;
};

const variants = {
  visible: {
    color: ['#2013b3', '#ff0000', '#2013b3', '#00cc00', '#2013b3'],
    transition: { duration: 0.5, repeat: Infinity },
  },
};

const Snap = ({ suitMatches, valueMatches }: SnapProps) => {
  return (
    <div className="flex py-4 items-center justify-center w-full h-10 my-10">
      {suitMatches && (
        <motion.h1
          variants={variants}
          animate="visible"
          className="text-3xl m-2"
        >
          SNAP SUIT!
        </motion.h1>
      )}
      {valueMatches && (
        <motion.h1
          variants={variants}
          animate="visible"
          className="text-3xl m-2"
        >
          SNAP VALUE!
        </motion.h1>
      )}
    </div>
  );
};

export default Snap;
