import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Message } from '../interface/message.interface';
import { map } from 'rxjs/operators';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private itemsCollection: AngularFirestoreCollection<Message>;

  public chats: Message[] = [];
  public user: any = {};

  constructor(private afs: AngularFirestore,
              public afAuth: AngularFireAuth) { 

    this.afAuth.authState.subscribe(userAuth => {
      
      if(!userAuth) return;

      this.user.name = userAuth.displayName;
      this.user.uid = userAuth.uid;
      this.user.userpicture = userAuth.photoURL;
    })
  }

  login(provider: string) {
    if(provider === 'google') this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    else this.afAuth.auth.signInWithPopup(new firebase.auth.TwitterAuthProvider());
  }

  logout() {
    this.user = {};
    this.afAuth.auth.signOut();
  }

  loadMessages() {
    this.itemsCollection = this.afs.collection<Message>('chats', ref => ref.orderBy('date', 'desc'));

    return this.itemsCollection.valueChanges()
                                .pipe(
                                  map((messages: Message[]) => {
                                    this.chats = [];

                                    for(let message of messages) {
                                      this.chats.unshift(message);
                                    }

                                    return this.chats;
                                  })
                                )
  }

  addMessage(text: string) {
    let message: Message = {
      name: this.user.name,
      message: text,
      date: new Date().getTime(),
      uid:  this.user.uid,
      userpicture: this.user.userpicture
    }

    return this.itemsCollection.add(message);
  }
}
