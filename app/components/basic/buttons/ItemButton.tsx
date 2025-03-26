import type React from "react";
import BaseButton, { type ButtonProps } from "./BaseButton";

const ItemButton: React.FC<ButtonProps> = (props) => {
  return (
    <BaseButton
      {...props}
      className={`${props.className || ""}`}
      buttonClassName={`bg-item-2 ${props.buttonClassName || ""} ${
        props.submitting ? "bg-item-2" : "hover:bg-item-2h"
      }`}
      textClassName={`${props.textClassName || ""}`}
    />
  );
};

export default ItemButton;
