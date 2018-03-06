import React from 'react'

export default ({balance, id, type}) => (
    <div class="container" style={{padding: 0}}>
        <div class="row">
            <strong>
                {type[0].toUpperCase() + type.slice(1)} Account #:
            </strong>
        {id}
        </div>
        <div class="row">
            <strong>Balance: </strong>{balance}
        </div>
    </div>
)