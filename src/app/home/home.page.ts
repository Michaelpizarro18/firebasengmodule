import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  posts: any[] = [];  // Inicia posts como un arreglo vacío

  constructor(
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private firestore: AngularFirestore
  ) {}

  ionViewWillEnter() {
    this.getPost();  // Llamamos al método para cargar las publicaciones cuando la vista entra
  }

  async getPost() {
    let loader = await this.loadingCtrl.create({
      message: 'Espere un momento por favor ...',
    });
    await loader.present();

    try {
      // Obtención de documentos de Firestore
      this.firestore.collection('posts').snapshotChanges().subscribe((data: any[]) => {
        this.posts = data.map((e: any) => {
          return {
            id: e.payload.doc.id,  // Corrección del error tipográfico
            title: e.payload.doc.data()['title'],  // Asignamos el título
            details: e.payload.doc.data()['details'],  // Asignamos los detalles
          };
        });
      });
    } catch (e: any) {
      console.error('Error al obtener los datos: ', e);
      this.showToast('Error al cargar los posts');
    } finally {
      await loader.dismiss();
    }
  }

  // Método para eliminar post
  async deletePost(id: string) {
    let loader = await this.loadingCtrl.create({
      message: 'Eliminando...',
    });
    await loader.present();
    try {
      // Eliminamos el documento de Firestore
      await this.firestore.doc('posts/' + id).delete();
      this.showToast('Post eliminado con éxito');
    } catch (error) {
      this.showToast('Error al eliminar el post');
    } finally {
      await loader.dismiss();
    }
  }

  // Método para mostrar toast de mensajes
  showToast(message: string) {
    this.toastCtrl
      .create({
        message: message,
        duration: 3000,  // Duración del mensaje
      })
      .then((toastData) => toastData.present());
  }
}
