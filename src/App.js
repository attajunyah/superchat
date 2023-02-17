import './App.css';

import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore'


firebase.initializeApp({
  apiKey: "AIzaSyCpL6OnmnCd7hMJH6yzJDgi_Fbjaa0ONsc",
  authDomain: "superchat-react-d46fd.firebaseapp.com",
  projectId: "superchat-react-d46fd",
  storageBucket: "superchat-react-d46fd.appspot.com",
  messagingSenderId: "685967959825",
  appId: "1:685967959825:web:2277b0ef6993238c264eb0",
  measurementId: "G-XC6DQHX8TR"
})

const auth = firebase.auth(); 
const firestore = firebase.firestore(); 

const [user] = useAuthState(auth);
 
function App() {
  return (
    <div className="App">
      <header>
        
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn() { 
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <button onClick={signInWithGoogle}>Sign in with Google</button>
  )
}

function SignOut() {
  return auth.currentUser && (
    <button onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function ChatRoom() {
  const messageRef = firestore.collection('messages'); 
  const query = messageRef.orderBy('createdAt').limit(25); 

  const [messages] = useCollectionData(query, {idField: 'id'});

  const [formValue, setFormValue] = useState('');

  const sendMessage = async(e) =>{
    e.preventDefault(); 

    const { uid, photoURL } = auth.currentUser; 

    await messageRef.add({
      text: formValue, 
      createdAt: firebase.firestore.FieldValue.serverTimestamp(), 
      uid, 
      photoURL
    });
  }

  return (
    <>
      <div>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
      </div>

      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} />

        <button type="submit">ß</button>
      </form>
    </>
  )
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message; 

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received'; 
  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL} />
      <p>{text}</p>
    </div>
  )
}
export default App;
