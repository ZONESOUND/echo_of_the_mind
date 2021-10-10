//import * as firebase from 'firebase';
import firebase from 'firebase/compat/app';
import "firebase/compat/database";
//import { initializeApp } from 'firebase/app';
//import { database } from 'firebase/database';
import {firebaseConfig} from './config';

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const databaseRef = firebase.database().ref();
export const collectionRef = databaseRef.child("collections");