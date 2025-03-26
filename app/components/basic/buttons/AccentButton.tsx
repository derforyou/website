import type React from "react";
import BaseButton, { type ButtonProps } from "./BaseButton";

const ItemButton: React.FC<ButtonProps> = (props) => {
  return (
    <BaseButton
      {...props}
      className={`${props.className || ""}`}
      buttonClassName={`hover:shadow-s-accent-1 hover:shadow-button-md bg-accent-1 ${
        props.buttonClassName || ""
      } ${props.submitting ? "bg-item-2" : "hover:bg-accent-1h"}`}
      textClassName={`text-dark ${props.textClassName || ""}`}
    />
  );
};

export default ItemButton;
