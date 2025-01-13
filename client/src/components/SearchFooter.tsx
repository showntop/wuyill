// desktop/Verve/src/routes/App/lib/Footer.jsx
import React, { useEffect, useState, useRef } from 'react';

const SearchFooter = (props: {text: string}) => {
    const {text} = props;

    return (
        <div className="footer">
            <p>{text}</p>
        </div>
    );
};
    
export default SearchFooter;