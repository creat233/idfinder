import { MCardAppointmentBooking } from "../features/MCardAppointmentBooking";

interface MCardViewAppointmentProps {
  mcardId: string;
  mcardOwnerId: string;
  mcardOwnerName: string;
  phoneNumber?: string;
  isOwner: boolean;
}

export const MCardViewAppointment = ({
  mcardId,
  mcardOwnerId,
  mcardOwnerName,
  phoneNumber,
  isOwner
}: MCardViewAppointmentProps) => {
  // Ne pas afficher pour le propriétaire
  if (isOwner) {
    return null;
  }

  return (
    <div className="mt-4">
      <MCardAppointmentBooking
        mcardId={mcardId}
        mcardOwnerId={mcardOwnerId}
        mcardOwnerName={mcardOwnerName}
        phoneNumber={phoneNumber}
      />
    </div>
  );
};
