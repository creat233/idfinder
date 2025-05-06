
import { ReactNode } from "react";

type DocumentSectionProps = {
  title: string;
  children: ReactNode;
};

export const DocumentSection = ({ title, children }: DocumentSectionProps) => {
  return (
    <div>
      <h4 className="font-medium mb-2">{title}</h4>
      {children}
    </div>
  );
};

export const DocumentSubSection = ({
  title,
  items,
}: {
  title: string;
  items: string[];
}) => {
  return (
    <div className="space-y-2 mt-3">
      <p className="font-medium">{title}</p>
      <ul className="list-disc pl-5 text-gray-600 space-y-1">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};
