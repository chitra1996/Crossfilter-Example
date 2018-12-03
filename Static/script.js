csf = "";

dimnensionInit();
function dimnensionInit() {
    $.getJSON("./static/data.json", function(json) {
        myList = json
        console.log(myList)
        csf = crossfilter(myList);
        reportIdDim = csf.dimension(function(d) { return d.labReportId });
        pNameDim = csf.dimension(function(d) { return d.userDetailsId.fullName });
        tNameDim = csf.dimension(function(d) { return d.reportID.testName });
        tIdDim = csf.dimension(function(d) { return d.reportID.testID });
        sampleDateDim = csf.dimension(function(d) { return d.accessionDate });
        populateData();
    });
}

function appendData(param) {
    param.forEach(d => {
        $('#dataId').append(
            '<tr>\
                <td id="reportId" scope="row">' + d.labReportId + '</td>\
                <td id="pName" scope="row">' + d.userDetailsId.fullName + '</td>\
                <td id="tName" scope="row">' + d.reportID.testName + '</td>\
                <td id="tId" scope="row">' + d.reportID.testID + '</td>\
                <td id="sampleDate" scope="row">' + d.accessionDate + '</td>\
            </tr>'
        )
    });
}

function populateData() {
    $('#dataId').empty();
    appendData(reportIdDim.bottom(Infinity));
}

var flag = 0;
function sortData(param) {
    $('#dataId').empty();
    if(flag == 0) {
        appendData(param.bottom(Infinity));
        flag = 1;
    } else {
        appendData(param.top(Infinity));
        flag = 0;
    }
}


$(document).ready(function(){
    $("#reportIdSearch").keyup(function(){
        searchData('reportIdSearch', reportIdDim)
    });
    $("#patientNameSearch").keyup(function(){
        searchData('patientNameSearch', pNameDim);
    });
    $("#testNameSearch").keyup(function(){
        searchData('testNameSearch', tNameDim);
    });
    $("#testIdSearch").keyup(function(){
        searchData('testIdSearch', tIdDim);
    });
    $("#sampleDateSearch").keyup(function(){
        searchData('sampleDateSearch', sampleDateDim);
    });
    function searchData(idName, dimName) {
        if($("#" + idName).val() != "") {
            dimName.filterExact($("#" + idName).val());
        } else {
            dimName.filterAll();
        }
        populateData();
    }
});