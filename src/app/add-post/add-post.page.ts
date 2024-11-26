import { Component } from '@angular/core';
import { Post } from '../models/post.model';
import { ToastController, LoadingController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.page.html',
  styleUrls: ['./add-post.page.scss'],
})
export class AddPostPage {
  post = {} as Post;

  constructor(
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private firestore: AngularFirestore,
    private navCtrl: NavController
  ) {}

  async createPost(post: Post) {
    if (this.formValidation()) {
      let loader;
      try {
        // Mostrar indicador de carga
        loader = await this.loadingCtrl.create({
          message: "Espere por favor ....",
        });
        await loader.present();

        // Guardar el post en Firestore
        await this.firestore.collection('posts').add(post);
        console.log("Post creado exitosamente");

        // Mostrar mensaje de éxito
        this.showToast("Post creado con éxito");

        // Redirigir a la página principal
        this.navCtrl.navigateRoot("home");
      } catch (error: any) {
        console.error("Error al crear el post:", error);
        this.showToast("Error al crear el post: " + error.message);
      } finally {
        if (loader) {
          await loader.dismiss();
        }
      }
    } else {
      console.log("Validación fallida");
    }
  }

  formValidation(): boolean {
    if (!this.post.title) {
      this.showToast("Ingrese un título");
      return false;
    }
    if (!this.post.details) {
      this.showToast("Ingrese detalles");
      return false;
    }
    return true;
  }

  showToast(message: string) {
    this.toastCtrl
      .create({
        message: message,
        duration: 4000,
      })
      .then((toastData) => toastData.present());
  }
}
