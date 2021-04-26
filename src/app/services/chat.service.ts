import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Mensaje } from '../interface/mensaje.interface'; //creamos una interface con los atributos para no usar any
import {map} from 'rxjs/operators'
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';


@Injectable({
  providedIn: 'root'
})
export class ChatService {
  
  public chats: Mensaje[] = []
  public usuario : any = {};
  private itemsCollection: AngularFirestoreCollection<Mensaje>|undefined
  

  constructor(
    private afs: AngularFirestore,
    public auth: AngularFireAuth
    
  ) {

    this.auth.authState.subscribe( user => { //con esto podemos sacar un objeto con toda la informacion de la cuenta autenticada
      console.log('estado del usuario:', user)
      if (!user) {
        return
      }
      this.usuario.nombre = user.displayName
      this.usuario.uid = user.uid; //clave unica de cada cuenta
    })
    
   }
    
   login(provedor : string) {
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }
  logout() {
    this.usuario = {}
    this.auth.signOut();
  }

  cargarMensajes(){
    this.itemsCollection = this.afs.collection<Mensaje>('chats',ref =>ref.orderBy('fecha','desc').limit(5)); //Esa funciones de SQL, para darle el orden y el limite
    return this.itemsCollection.valueChanges().pipe(map((mensajes:Mensaje[]) =>{
                                  console.log(mensajes)
                                  //this.chats = mensajes
                                  this.chats = []
                                  for (let mensaje of mensajes){
                                    this.chats.unshift(mensaje) //Se incerta los mensajes en un array nuevo, para darlos en orden unshift y no push
                                  }
                                  return this.chats
                                })
    )
  }

  agregarMensaje(texto:string){ //se saca el text desde el input donde escribimos el mensaje, llamamos al agregar y le pasamos el mensaje como parametro
    //falta el UID del usuario
    let mensaje:Mensaje = {
      nombre:this.usuario.nombre,
      mensaje:texto,
      fecha: new Date().getTime(),
      uid: this.usuario.uid
    }
    return this.itemsCollection?.add(mensaje); //para hacer la insercion a firebase
  }
}
