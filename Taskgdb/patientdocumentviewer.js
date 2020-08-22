
function getdownloadfile(id) {
    window.open('http://localhost:8085/doc/download?access_token='+ window.localStorage.getItem('access_token')+'&uid='+id, '_blank', 'toolbar=yes, location=yes, status=yes, menubar=yes, scrollbars=yes');
    //new tenantapi().getdownloadpatientdocument(id, ondownloadSuccess, ondownloadError);
}
;
$(function () {
    var id = localStorage.getItem('currentpatientid');
    documentviewer(id);
});


$("#patientresource").on("click", ".thumbnail", function () {
    if (getdownloadfile(this.id) === true) {
     
    }
});

function thumbnailview(){
    
}