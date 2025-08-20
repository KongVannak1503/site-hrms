// TableHeaderComponents.js
import React from 'react';

export const tableHeaderComponents = {
    header: {
        cell: (props) => (
            <th
                {...props}
                style={{
                    backgroundColor: '#002060', // your header bg color
                    color: '#fff',               // text color
                    fontWeight: 'bold',          // optional styling
                }}
            />
        ),
    },
};
