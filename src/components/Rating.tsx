interface RatingProps {
  rate: number;
}

export default function Rating({ rate }: RatingProps) {
  let rates = [];

  for (let i = 1; i <= rate; i++) {
    rates.push(
      <img key={i}
        src="/assets/images/icons/Star 1.svg"
        className="w-5 h-5"
        alt="star"
      />
    );
  }

  for (let i = 1; i <= Math.ceil(5 - rate); i++) {
    rates.push(
      <img key={i+5}
        src="/assets/images/icons/Star 5.svg"
        className="w-5 h-5"
        alt="star"
      />
    );
  }

  return <>{rates}</>;
}
