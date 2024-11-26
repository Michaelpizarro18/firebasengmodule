import { Component, OnInit } from '@angular/core';
import { Post } from '../models/post.model';
import { ToastController, LoadingController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.page.html',
  styleUrls: ['./edit-page.page.scss'],
})
export class EditPagePage implements OnInit {
  post = {} as Post; // Objeto para los datos del post
  id: string = ''; // Inicializar como cadena vacía

  constructor(
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private firestore: AngularFirestore,
    private navCtrl: NavController,
    private actRoute: ActivatedRoute // Para obtener parámetros de la ruta
  ) {
    const routeId = this.actRoute.snapshot.paramMap.get("id");
    if (!routeId) {
      this.showToast("ID no encontrado");
      this.navCtrl.navigateRoot("home");
    } else {
      this.id = routeId; // Asignar el valor si es válido
    }
  }

  ngOnInit() {
    this.getPostById(this.id); // Cargar los datos del post
  }

  async getPostById(id: string) {
    let loader;
    try {
      loader = await this.loadingCtrl.create({
        message: "Cargando datos...",
      });
      await loader.present();

      // Obtener documento desde Firestore
      const postRef = this.firestore.collection("posts").doc(id);
      const doc = await postRef.get().toPromise();
      if (doc?.exists) {
        this.post = doc.data() as Post; // Asignar datos al objeto post
      } else {
        this.showToast("El post no existe");
        this.navCtrl.navigateRoot("home");
      }
    } catch (error: any) {
      console.error("Error al obtener los datos:", error);
      this.showToast("Error al cargar los datos: " + error.message);
    } finally {
      if (loader) {
        await loader.dismiss();
      }
    }
  }

  async updatePost(post: Post) {
    if (this.formValidation()) {
      let loader;
      try {
        loader = await this.loadingCtrl.create({
          message: "Actualizando post...",
        });
        await loader.present();

        // Actualizar el documento en Firestore
        await this.firestore.collection("posts").doc(this.id).update(post);

        this.showToast("Post actualizado con éxito");
        this.navCtrl.navigateRoot("home"); // Redirigir a la página principal
      } catch (error: any) {
        console.error("Error al actualizar el post:", error);
        this.showToast("Error al actualizar el post: " + error.message);
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
