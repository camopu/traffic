import React from 'react';

import '../../styles/changelog.css'

import ReactMarkdown from 'react-markdown'

const Changelog = ({text}) => {
    return (
        <ReactMarkdown
            source={text}
            className={"changelog-container"}
        />
    );
};

export default Changelog;