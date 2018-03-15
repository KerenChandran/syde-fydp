import React from 'react'

export default ({balance, id, type}) => {
    if (type === "research") {
        return null;
    }
    else {
        return (
            <div class="container" style={{padding: 0}}>
                <div class="row">
                    <label class="col-sm-4 control-label" style={{textAlign:'right'}}>
                        {type[0].toUpperCase() + type.slice(1)} Account No.
                    </label>
                    <div class="col-sm-6">
                    {id}
                    </div>
                </div>
            </div>
        )
    };
}