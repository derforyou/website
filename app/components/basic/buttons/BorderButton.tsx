import type React from "react";
import BaseButton, { type ButtonProps } from "./BaseButton";

const ItemButton: React.FC<ButtonProps> = (props) => {
  return (
    <BaseButton
      {...props}
      className={`${props.className || ""}`}
      buttonClassName={`hover:shadow-s-accent-1 hover:shadow-button-md border-accent-1 border-2 ${
        props.buttonClassName || ""
      } ${props.submitting ? "shadow-button-md shadow-s-accent-1" : ""}`}
      textClassName={`${props.textClassName || ""}`}
    />
  );
};

export default ItemButton;
