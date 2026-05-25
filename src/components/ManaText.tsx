import type { ManaToken } from "../types/scryfall"; 

type ManaTextProps = {
  parsedText: ManaToken[];
};

function ManaText ({ parsedText }: ManaTextProps) {
    return (
        parsedText.map((token, index) => {
            if (token.type === "text") {
                return <span key={index}>{token.value}</span>;
            } else if (token.type === "symbol") {
                return <img 
                    key={index} 
                    src={`https://svgs.scryfall.io/card-symbols/${token.value.replace("/", "")}.svg`} 
                    alt={token.value} 
                    style={{ width: "1em", height: "1em", verticalAlign: "middle" 
                        
                    }} 
                />;
            }
            return null;
        })
    )
}

export default ManaText;