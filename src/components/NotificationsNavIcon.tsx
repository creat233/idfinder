
import { Link, useNavigate } from "react-router-dom";
import { FC } from "react";
import { useNotifications } from "@/hooks/useNotifications";
import { useAuthState } from "@/hooks/useAuthState";

type Props = {
  isMobile?: boolean;
  onClick?: () => void;
};

export const NotificationsNavIcon: FC<Props> = ({ isMobile = false, onClick }) => {
  const { unreadCount } = useNotifications();
  const { isAuthenticated } = useAuthState();
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      navigate("/auth");
      return;
    }
    onClick?.();
  };

  return (
    <Link
      to="/notifications"
      className={`text-gray-700 hover:text-primary relative${isMobile ? " block py-2" : ""}`}
      onClick={handleClick}
      aria-label="Notifications"
    >
      <span className="sr-only">Notifications</span>
      <span className="flex items-center">
        <div className="relative">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="#9694ff" strokeWidth="2" fill="none"/>
            <path d="M12 17a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2zm5-2V9a5 5 0 0 0-10 0v6l-1.293 1.293A1 1 0 0 0 7 19h10a1 1 0 0 0 .707-1.707L17 15z" stroke="#9694ff" strokeWidth="2" fill="none"/>
          </svg>
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </div>
        {isMobile && <span className="ml-2">Notifications</span>}
        {isMobile && unreadCount > 0 && (
          <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1 font-medium">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </span>
    </Link>
  );
};
