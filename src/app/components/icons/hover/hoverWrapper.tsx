import { FunctionComponent, ReactNode, useState } from 'react';

interface HoverWrapperProps {
  children: ReactNode;
  text: string;
}

const HoverWrapper = ({ children, text = '' }: HoverWrapperProps) => {
  const [hover, setHover] = useState(false);

  return (
    <div
      className="relative text-center"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {children}
      {text && hover && (
        <span
          className={`absolute top-[-100%] left-1/2 transform -translate-x-1/2 -translate-y-full whitespace-nowrap bg-black text-white py-1 px-2 rounded text-sm transition-opacity duration-300 ease-in-out ${
            hover ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
        >
          {text}
        </span>
      )}
    </div>
  );
};

export default HoverWrapper;
