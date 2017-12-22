import React from 'react';

export const Topic = ({ match }) => (
    <div>
        <h3>{match.params.topicId}</h3>
    </div>
);