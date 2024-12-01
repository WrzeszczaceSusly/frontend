// style.tsx
import background2 from "./../images/pieski.jpg";

export const introBodyStyle = {
    backgroundImage: `url(${background2})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
    width: '100%', // Zmień '100vw' na '100%'
    position: 'absolute',
    top: 0,
    left: 0,
    minHeight: '100vh',
    zIndex: -1
};
