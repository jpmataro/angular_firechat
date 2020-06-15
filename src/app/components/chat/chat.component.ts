import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../service/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styles: [
    '.name { font-size: 1rem; }',
    '.message-container { overflow: auto; max-height: 320px; padding: 0 1rem;}',
    '.message-container img { border-radius: 10px;}'
  ]
})
export class ChatComponent implements OnInit {

  message: string = "";
  disableElem: boolean;
  element: any;
  isLoading: boolean = true;

  constructor(public _cs: ChatService) {
    this._cs.loadMessages().subscribe(() => {
      this.isLoading = false;
      setTimeout(()=>{
        this.element.scrollTop = this.element.scrollHeight;
      },20)
    });
  }

  ngOnInit() {
    this.element = document.getElementById("app-messages");
  }

  sendMessage() {

    this.disableElem = true;
    
    if(this.message.length === 0) {
      return;
    }

    this._cs.addMessage(this.message)
            .then(()=> {
              this.disableElem = false;
              this.message = "";
            })
            .catch((error)=>{
              console.error("Send message error", error);
            });
  }

}
