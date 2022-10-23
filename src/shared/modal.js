 export class Modal {
    #message;
    #fn;

    constructor (message, fn){
        this.#message = message;
        this.#fn = fn; 
    }
    showModal(){
        const body = document.getElementsByTagName('body')[0];
        const modal = document.createElement('div');
        const modalBody = document.createElement('div');
        const message = document.createElement('p');
        const btns = document.createElement('div');
        const accept = document.createElement('button');
        const decline = document.createElement('button');

        modal.className = 'modal';
        modalBody.className = 'modal-container';
        accept.className = 'btn btn-primary';
        decline.className = 'btn btn-primary';
        btns.className = 'modal-container__btns';

        message.innerText = this.#message;
        accept.innerText = 'Ok';
        decline.innerText = 'Cancel';

        decline.onclick = () => modal.remove();
        accept.onclick = () => {
            modal.remove();
            this.#fn();
        }

        btns.append(accept, decline);
        modalBody.append(message, btns);
        modal.append(modalBody);
        body.prepend(modal);

    }

 }