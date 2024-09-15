import React from 'react';

const MainContent = ({ titulo, subtitulo, children }) => {
    return (
        <>
            <div className="pt-8 md:pt-16">
                <h1 className="text-left text-slate-800 dark:text-slate-50 font-bold text-3xl md:text-4xl">{titulo}</h1>
                <h2 className="text-left text-[#757575] dark:text-[#ababab] font-semibold text-2xl md:text-3xl pt-2">{subtitulo}</h2>
            </div>
            <div className="pt-8 overflow-auto">
                {children}
            </div>
        </>
    );
};

export default MainContent;
