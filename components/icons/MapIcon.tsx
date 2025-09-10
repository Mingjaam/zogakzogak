import React from 'react';

const MapIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.5-10.5-6.536 3.268a.75.75 0 00-.464.685v5.302a.75.75 0 00.927.734l6.036-2.382a.75.75 0 00.537-.71V6.312a.75.75 0 00-1-1.018L9.5 3.75z" />
    </svg>
);

export default MapIcon;
