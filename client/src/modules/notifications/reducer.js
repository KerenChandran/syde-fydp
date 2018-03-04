const initialState = {

    notifications: [{
        request_id: '001' ,
        lender_id: '123' ,
        borrower_id: '456' ,
        date: "Feb 8 2018",
        total: "100",
        dates: "time block",
        status: "status"

        // title: "Ardino xyz"
    },{
        request_id: '002' ,
        lender_id: '123' ,
        borrower_id: '456' ,
        date: "Feb 8 2018",
        total: "100",
        dates: "time block",
        status: "status"


        //title: "Something"
    }]
}

export default (state = initialState, { type, payload }) => {
    switch(type) {

        default:
            return state;
    };
}
