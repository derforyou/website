import type React from "react";
import { useRef } from "react";
import { useNavigate } from "react-router";

export type ButtonProps = {
  className?: string;
  buttonClassName?: string;
  textClassName?: string;
  onClick?: () => void;
  children: React.ReactNode;
  to?: string;
  type?: HTMLButtonElement["type"];
  submitting?: boolean;
};

const BaseButton: React.FC<ButtonProps> = ({
  className,
  buttonClassName,
  textClassName,
  onClick,
  children,
  to,
  type = "button",
}) => {
  const ref = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();

  const effect = () => {
    if (ref.current) {
      ref.current.style.transform = "scale(0.985)";
      setTimeout(() => {
        if (ref.current) {
          ref.current.style.transform = "scale(1.0)";
        }
      }, 200);
    }
  };

  const handleClick = () => {
    effect();
    if (onClick) {
      onClick();
    }
    if (to) {
      setTimeout(() => {
        navigate(to);
      }, 100);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <button
        ref={ref}
        type={type}
        className={`absolute rounded-full w-full h-full button ${buttonClassName}`}
        onClick={handleClick}
      />
      <button
        type="button"
        className={`z-10 relative w-full pointer-events-none button ${textClassName}`}
      >
        {children}
      </button>
    </div>
  );
};

export default BaseButton;
