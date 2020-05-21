// modal component
var OO = OO || {};
OO.Modules = OO.Modules || {};

OO.Modules.ModalComponent = function(options, container) {
	let _init = OO.Modules.ModalComponent.prototype._init;
	let methods = _init(options, container);

	this.show = methods.show;
};

// 初始化element
OO.Modules.ModalComponent.prototype._init = function (options, container) {

	let modal = container.append('div').attr('class', 'modal fade')
	let modalDialog = modal.append('div').attr('class', 'modal-dialog');
	let modalContent = modalDialog.append('div').attr('class', 'modal-content');
	let modalHeader = modalContent.append('div').attr('class', 'modal-header');

	modalHeader.append('button').attr('type', 'button').attr('class', 'close').attr('data-dismiss', 'modal')
		.append('span').attr('aria-hidden', 'true').text('×');
	modalHeader.append('h4').attr('class', 'modal-title');

    modalContent.append('div').attr('class', 'modal-body');

    modalContent.append('div').attr('class', 'modal-footer')
    	.append('button').attr('type', 'button').attr('class', 'btn btn-default')
    	.attr('data-dismiss', 'modal').text('OK');

    let show = function (title, content) {

    	modalHeader.select('.modal-title').text(title);
    	modalContent.select('.modal-body').text(content);

    	$(modal.node()).modal('show');
    };

    return {
    	show: show
    }
};
