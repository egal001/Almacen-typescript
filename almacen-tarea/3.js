import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin';
admin.initializeApp(functions.config().firebase);
const ref = admin.database().ref();
import * as _ from 'lodash'
import * as fs from 'fs-extra'
import * as sharp from 'sharp';
import { tmpdir } from 'os';
import { join, dirname } from 'path';
const {Storage} = require('@google-cloud/storage');
const gcs = new Storage();


// --- Crear Usuarios /Pass ---------------------------------------------------
    exports.creaUsuarios = functions.https.onCall((data, context) => {
        // console.log('Usuario que solicita creacion:',context.auth.token)
        return admin.auth().createUser({
            email: data.email,
            emailVerified: false,
            password: data.password,
            displayName: data.displayName,
            disabled: false
        }).then((userRecord)=> {
            // See the UserRecord reference doc for the contents of userRecord.
            console.log("Successfully created new user:", userRecord.uid);
            data.uid = userRecord.uid;
            return actualizaUsuario(data)
            
        }).catch((error)=> {
            console.error("Error creating new user:", error);
            // return error;
            if(error.code === 'auth/email-already-exists'){
                throw new functions.https.HttpsError('invalid-argument', 'La direccion de email ya esta en uso por otra cuenta de usuario');
            }else if(error.code === 'auth/invalid-email'){
                throw new functions.https.HttpsError('invalid-argument', 'Formato incoorecto para el email');
            }else{
                throw new functions.https.HttpsError(error.code, error);
            }
        });
    });
    exports.actualizaUsuarios = functions.https.onCall((data, context) => {
        // console.log('Usuario que solicita creacion:',context.auth.token)
        actualizaUsuario(data).then(()=>{console.log('ok')}).catch((error)=>{console.log('error',error)})
    });
    exports.SetSuper = functions.https.onCall((data, context) => {
        // const superUID = 'GZrOk0nDv5W7CSXRYP92uSKldRt2';
        const claims = {super:true, admin: false, empleado:false, usuario:false}
        return admin.auth().setCustomUserClaims(data, claims ).then(() => {
            // The new custom claims will propagate to the user's ID token the
            // next time a new one is issued.
            console.log("Successfully created Claims to new Super:",data);
            ref.child('super/' + data + '/rol').set('super').then(()=>{console.log('ok')}).catch((error)=>{console.log('error',error)})
            ref.child('n/' + data + '/rol').set('super').then(()=>{console.log('ok')}).catch((error)=>{console.log('error',error)})
            return {
                result:`Successfully created new Super: ${data}`
            }
        }).catch(function (error) {
            // console.log("Error creating new user:", error);
            // return error;
            throw new functions.https.HttpsError('unknown', error.message, error);
        });
    });
    function actualizaUsuario(data){
        console.log("Updated user:", data);
        let claims = {proveedor: false, admin: false, empleado: false, cliente: true}
        switch (data.rol) { //'admin' | 'empleado' | 'proveedor' | 'cliente'
            case 'proveedor':
                claims = {proveedor: true, admin: true, empleado: false, cliente: false}
                break;
            case 'admin':
                claims = {proveedor: false, admin: true, empleado: false, cliente: false}
                break;
            case 'empleado':
                claims = {proveedor: false, admin: false, empleado: true, cliente: false}
                break;
            case 'cliente':
                claims = {proveedor: false, admin: false, empleado: false, cliente: true}
                break;
        }
        return admin.auth().setCustomUserClaims(data.uid, claims ).then(() => {
            console.log("Successfully updated Claims to user:",data);
            ref.child('usuarios' + '/' + data.uid).update({
                rol: data.rol,
                key: data.uid,
                email: data.email,
                nombre: data.nombre,
                telefono: data.telefono,
                cedula: data.cedula,
                barrio: data.barrio,
                direccion: data.direccion
            }).then(()=>{console.log('ok')}).catch((error)=>{console.log('error',error)})
            return data.uid
        }).catch(function (error) {
            // console.log("Error creating new user:", error);
            // return error;
            throw new functions.https.HttpsError('unknown', error.message, error);
        });
    }
// ---- Pagos ----------------------------------------------------------------------
    exports.pagos = functions.https.onCall((data, context) => {
        // console.log('Usuario que solicita creacion:',context.auth.token)
        const docRef = 'documentos/'+data.documento+'/abonos'
        const pagosRef = 'pagos/'+data.key
        const docRefestado = 'documentos/'+data.documento+'/estado'
        childs[docRef] = data.valor
        childs[pagosRef] = {
            key: data.key,
            documento: data.documento,
            fecha: data.fecha,
            valor: data.valor,
            abono: data.abono,
            usuario: data.usuario
        }
        if(data.estado == 'pagado'){
            childs[docRefestado] = data.estado
        }
        return ref.update(childs).then(async a=>{
            return 'pago reportado correctamente en '+data.documento
        }).catch(error=>{
            console.error(error);
            return
        })
    });
