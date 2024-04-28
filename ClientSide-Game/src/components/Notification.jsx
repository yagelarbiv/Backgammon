import {
  useState,
  useEffect
} from "react";
import notificationSound from "../assets/sounds/message-sound.mp3";

const Notification = ({
  otherUser,
  onAccept,
  onClose
}) => {
  const [playMessageSound, setPlayMessageSound] = useState(false);
  useEffect(() => {
    if (playMessageSound) {
      const audio = new Audio(notificationSound);
      audio.play();
      setPlayMessageSound(false);
    }
  }, [playMessageSound]);

  return (
    <div>
      <h3>Game invite from {otherUser}</h3>
      <button
        onClick={onAccept}
      >
        Accept
      </button>
      <button
        onClick={onClose}
      >
        Deny
      </button>

    </div>
  );
};

export default Notification;
