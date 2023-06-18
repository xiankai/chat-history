import { DateBucketReference } from "datasources/base";
import { navigate } from "raviger";
import { ReactNode } from "react";
import { parseDateBucketIntoDateString } from "utils/date";

export const SearchResultWrapper = ({
  recipient,
  dateBucketReference,
  lineNumber,
  children,
}: {
  recipient: string;
  dateBucketReference: DateBucketReference;
  lineNumber: number;
  children: ReactNode;
}) => {
  const jumpToSearchResult = () => {
    navigate("/viewer", {
      query: {
        recipient,
        date: parseDateBucketIntoDateString(dateBucketReference),
        line: lineNumber,
      },
    });
  };

  return (
    <div className="pointer-events-auto" onClick={jumpToSearchResult}>
      {children}
    </div>
  );
};
