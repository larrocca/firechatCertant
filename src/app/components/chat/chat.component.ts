import { Component, OnInit, NgModule } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { Mensaje } from '../../interface/mensaje.interface';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  mensaje:string = ''
  elemento:any

  constructor(
    public _chatService:ChatService
  ) {
    this._chatService.cargarMensajes().subscribe(() =>{
      setTimeout(()=>{
        this.elemento.scrollTop = this.elemento.scrollHeight; //Esto es para que la barra de chat comienze abajo 
      },20)
    });
   }

  ngOnInit(): void {
    this.elemento = document.getElementById('app-mensajes')
  }

  enviarMensaje(mensaje:string){
    if (this.mensaje.length == 0 ) {
      return;
    }
    this._chatService.agregarMensaje(mensaje)?.then(()=>this.mensaje="")
                                              .catch((err)=> console.log(err) )
    console.log(this.mensaje)
  }

  guardarTexto(){

  }

}
