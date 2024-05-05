import {
  useState,
  useEffect
} from "react";
import notificationSound from "../assets/sounds/message-sound.mp3";
import notificationChatSound from "../assets/sounds/message-alert-sound.mp3";
export { notificationChatSound }; 
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

  const [playMessageChatSound, setPlayMessageChatSound] = useState(false);
  useEffect(() => {
    if (playMessageChatSound) {
      const audio = new Audio(notificationChatSound);
      audio.play();
      setPlayMessageChatSound(false);
    }
  }, [playMessageChatSound]);

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
