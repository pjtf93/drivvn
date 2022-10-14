import { motion } from 'framer-motion';

type CardProps = {
  image: string;
  oldCard?: boolean;
};

const Card = ({ image, oldCard }: CardProps) => {
  return (
    <>
      {image && (
        <motion.img
          key={image}
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 1 } }}
          exit={{ opacity: 0, y: 100, transition: { duration: 1 } }}
          src={image}
          alt={oldCard ? 'old card' : 'new card'}
          className="h-full w-full"
        />
      )}
    </>
  );
};

export default Card;
