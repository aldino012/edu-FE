import React from "react";
import AngkaCard from "./AngkaCard";

const AngkaGrid = ({ items, flippedCard, onFlip }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 lg:gap-8 justify-items-center max-w-5xl mx-auto w-full">
      {items.map((item) => (
        <AngkaCard
          key={item.id}
          item={item}
          isFlipped={flippedCard === item.id}
          onClick={onFlip}
        />
      ))}
    </div>
  );
};

export default AngkaGrid;
