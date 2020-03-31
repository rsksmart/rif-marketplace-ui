import React, { FC } from 'react';
import { Button } from 'rifui';

export interface ReturnButtonProps {
    className?: string
    backTo: string
    handleBackTo: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
};

const ReturnButton: FC<ReturnButtonProps> = ({ className = '', backTo, handleBackTo }) => {
    return (
        <Button className={('return-btn ' + className).trim()} onClick={handleBackTo}>
            {'<'} Back to {backTo}
        </Button>
    );
};

export default ReturnButton;