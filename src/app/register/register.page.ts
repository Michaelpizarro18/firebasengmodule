import { Component, OnInit } from '@angular/core';
import {User} from "../models/user.model"
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
 user = {} as User;
  constructor(
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private afAuth: AngularFireAuth,
    private navCtrl: NavController
  ) { }

  async register(user: User) {
    console.log("Intentando registrar usuario:", user);
    if (this.formValidation()) {
      console.log("Validación pasada");
      let loader;
      try {
        loader = await this.loadingCtrl.create({
          message: "Espere por favor ...."
        });
        await loader.present();

        const result = await this.afAuth.createUserWithEmailAndPassword(user.email, user.password);
        console.log("Usuario registrado con éxito:", result);
        this.navCtrl.navigateRoot("home");

      } catch (error: any) {
        console.error("Error durante el registro:", error);
        this.showToast("Error al registrar el usuario: " + error.message);
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
  if (!this.user.email) {
    this.showToast("Ingrese un email");
    return false;
  }
  if (!this.user.password) {
    this.showToast("Ingrese una clave");
    return false;
  }
  return true; // Asegúrate de retornar true si todo está validado.
}

  showToast(message: string){
    this.toastCtrl.create({
      message: message,
      duration: 4000
    }).then(toastData => toastData.present());
  }


}
