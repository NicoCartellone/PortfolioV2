import Email from "./icons/Email";
import { Snippet } from "@nextui-org/snippet";

const ButtonCopyClipboard = () => {

  return (
    <Snippet 
        hideSymbol
        color="primary"
        size="lg" 
        radius="lg"
        tooltipProps={{
            className: "p-2",
            delay: 0,
            content: "Copiar"
        }}
    >
      <div className="flex flex-row gap-x-2 items-center">
        <Email />
        <span>nicolas.cartellone@gmail.com</span>
      </div>
    </Snippet>
  );
};

export default ButtonCopyClipboard;
