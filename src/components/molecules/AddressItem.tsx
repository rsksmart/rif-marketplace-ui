import React, { useState } from "react";
import { Tooltip, Typography } from "@material-ui/core";
import { shortenAddress } from "@rsksmart/rif-ui";

const AddressItem = ({ value }) => {
    const [isCopied, setIsCopied] = useState(false);
    return <Tooltip
        interactive
        title={isCopied ? 'Copied!' : value}
        onClick={async ({ target }) => {
            const value = (target as any).value;
            navigator.clipboard.writeText(value)
                .then(() => { setIsCopied(true) })
        }}
        onClose={() => {
            setIsCopied(false);
        }}
    >
        <Typography>{shortenAddress(value)}</Typography>
    </Tooltip>
}

export default AddressItem;