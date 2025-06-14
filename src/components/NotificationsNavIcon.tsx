
import { Link } from "react-router-dom";
import { FC } from "react";

type Props = {
  isMobile?: boolean;
  onClick?: () => void;
};

export const NotificationsNavIcon: FC<Props> = ({ isMobile = false, onClick }) => (
  <Link
    to="/notifications"
    className={`text-gray-700 hover:text-primary relative${isMobile ? " block py-2" : ""}`}
    onClick={onClick}
    aria-label="Notifications"
  >
    <span className="sr-only">Notifications</span>
    <span className="flex">
      {/* Bubble possible si tu veux */}
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="#9694ff" strokeWidth="2" fill="none"/>
        <path d="M12 17a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2zm5-2V9a5 5 0 0 0-10 0v6l-1.293 1.293A1 1 0 0 0 7 19h10a1 1 0 0 0 .707-1.707L17 15z" stroke="#9694ff" strokeWidth="2" fill="none"/>
      </svg>
    </span>
    {isMobile && <span className="ml-2">Notifications</span>}
  </Link>
);
