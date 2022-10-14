type ResultsProps = {
  suitMatchesCount: number;
  valueMatchesCount: number;
};

const Results = ({ suitMatchesCount, valueMatchesCount }: ResultsProps) => {
  return (
    <div className="flex flex-col">
      <span className="text-3xl m-2" id="value-matches">
        Value matches: {valueMatchesCount ?? 0}
      </span>
      <span className="text-3xl m-2" id="suit-matches">
        Suit matches: {suitMatchesCount ?? 0}
      </span>
    </div>
  );
};

export default Results;
