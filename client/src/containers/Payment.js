import React from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

class Payment extends React.Component {

    state = {
        // take this from current resource
        fee_cadence: "",
        fee_amount: "",
        source_account: ""
    };

    handleChange = name => event => {
        this.setState({ [name]: event.target.value })
    };

    handleSubmit = () => {
    };

    render () {

        const {
            fee_cadence,
            fee_amount,
            source_account
        } = this.state;

        return (
            <div class="container">
                <div class="row">
                    <label class="col-sm-2 control-label" style={{marginTop: 8 + 'px', textAlign: 'right'}}>
                        Fee amount
                    </label>
                    <div class="col-sm-2">
                        {/* want to prepopulate this with the specified fee amount of resource */}
                        <input class="form-control" type="text" id="feeAmountFormControl" value={fee_amount} onChange={this.handleChange('fee_amount')}></input>
                    </div>
                    <div class="col-sm-2">
                        {/* is this how i do this value thing for a select */}
                        <select class="form-control" id="feeCadenceFormControl" value={fee_cadence}>
                            <option value="hourly">Per Hour</option>
                            <option value="daily">Per Day</option>
                            <option value="weekly">Per Week</option>
                        </select>
                    </div>
                </div>

                <div class="row">
                    <label class="col-sm-2 control-label" style={{marginTop: 8 + 'px', textAlign: 'right'}}>
                        Withdrawal Account
                    </label>
                    <div class="col-sm-4">
                        {/* also want to prepopulate this from user info - should be in props.currentUser thing */}
                        <input class="form-control" type="text" id="sourceAccountFormControl" value={source_account} onChange={this.handleChange('source_account')}></input>
                    </div>
                </div>

                <div class="row">
                    <div class="col-sm-8" style={{textAlign: 'center', marginTop: 10+'px'}}>
                        <button type="submit" class="btn btn-primary" onclick={this.handleSubmit}>Submit Request</button>
                    </div>
                </div>
            </div>
        )
    };

}
const mapDispatchToProps = dispatch => ({

});

export default connect(null, mapDispatchToProps)(Payment)