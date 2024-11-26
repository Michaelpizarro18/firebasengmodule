import { Component } from '@angular/core';
import { User } from '../models/user.model';
import { LoadingController, ToastController, NavController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  user = {} as User;

  constructor(
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private afAuth: AngularFireAuth,
    private navCtrl: NavController
  ) {}

  async login(user: User) {
    console.log("Intentando iniciar sesión con usuario:", user);
    if (this.formValidation()) {
      console.log("Validación pasada");
      let loader;
      try {
        loader = await this.loadingCtrl.create({
          message: "Espere por favor ....",
        });
        await loader.present();

        // Iniciar sesión con Firebase
        const result = await this.afAuth.signInWithEmailAndPassword(user.email, user.password);
        console.log("Inicio de sesión exitoso:", result);

        // Redirigir al home
        this.navCtrl.navigateRoot("home");
      } catch (error: any) {
        console.error("Error durante el inicio de sesión:", error);
        this.showToast("Error al iniciar sesión: " + error.message);
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

  showToast(message: string) {
    this.toastCtrl
      .create({
        message: message,
        duration: 4000,
      })
      .then((toastData) => toastData.present());
  }
}
